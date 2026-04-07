import { Router, Request, Response } from "express";
import { googleService } from "../services/google.service";
import { User } from "../db/models/User";
import { config } from "../config";

async function upsertUser(
  googleId: string,
  email: string,
  name: string,
  picture: string,
  accessToken: string,
  refreshToken: string,
  tokenExpiry?: number
) {
  await User.findOneAndUpdate(
    { googleId },
    {
      email,
      name,
      picture,
      accessToken,
      refreshToken,
      tokenExpiry: tokenExpiry ? new Date(tokenExpiry) : undefined,
      lastLogin: new Date(),
    },
    { upsert: true, new: true }
  );
}

const router = Router();

const COOKIE_NAME = "refresh_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

// GET /auth/google/url — returns consent URL for the frontend to redirect to
router.get("/google/url", (_req: Request, res: Response) => {
  const url = googleService.getAuthUrl();
  res.json({ url });
});

// GET /auth/callback — Google redirects here after consent
router.get("/callback", async (req: Request, res: Response): Promise<void> => {
  const { code, error } = req.query;

  if (error || typeof code !== "string") {
    res.redirect(`${config.FRONTEND_URL}/?error=oauth_denied`);
    return;
  }

  try {
    const tokens = await googleService.exchangeCode(code);
    const user = await googleService.getUserInfo(tokens.access_token);

    // Store refresh token in HttpOnly cookie
    if (tokens.refresh_token) {
      res.cookie(COOKIE_NAME, tokens.refresh_token, COOKIE_OPTIONS);
    }

    // Persist user + tokens in MongoDB
    await upsertUser(
      user.id,
      user.email,
      user.name,
      user.picture,
      tokens.access_token,
      tokens.refresh_token ?? "",
      tokens.expiry_date
    );

    // Redirect to frontend with access token and user info in hash (not query, avoids server logs)
    const params = new URLSearchParams({
      access_token: tokens.access_token,
      user: JSON.stringify(user),
    });
    res.redirect(`${config.FRONTEND_URL}/callback#${params.toString()}`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.redirect(`${config.FRONTEND_URL}/?error=oauth_failed`);
  }
});

// POST /auth/refresh — uses HttpOnly cookie to get new access token
router.post("/refresh", async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.[COOKIE_NAME];
  if (!refreshToken) {
    res.status(401).json({ error: "No refresh token cookie" });
    return;
  }

  try {
    const tokens = await googleService.refreshAccessToken(refreshToken);
    const user = await googleService.getUserInfo(tokens.access_token);

    // Rotate refresh token if Google issued a new one
    const newRefresh = tokens.refresh_token ?? refreshToken;
    if (tokens.refresh_token && tokens.refresh_token !== refreshToken) {
      res.cookie(COOKIE_NAME, tokens.refresh_token, COOKIE_OPTIONS);
    }

    // Update tokens in MongoDB
    await upsertUser(
      user.id,
      user.email,
      user.name,
      user.picture,
      tokens.access_token,
      newRefresh,
      tokens.expiry_date
    );

    res.json({ access_token: tokens.access_token, user });
  } catch (err) {
    console.error("Token refresh error:", err);
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.status(401).json({ error: "Refresh token expired or invalid" });
  }
});

// POST /auth/logout — clears the refresh token cookie
router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

export default router;
