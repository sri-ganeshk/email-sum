import { google } from "googleapis";
import { config } from "../config";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

class GoogleService {
  createOAuth2Client(accessToken?: string, refreshToken?: string) {
    const client = new google.auth.OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      config.GOOGLE_REDIRECT_URI
    );
    if (accessToken || refreshToken) {
      client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
    return client;
  }

  getAuthUrl(): string {
    const client = this.createOAuth2Client();
    return client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent", // always request refresh_token
    });
  }

  async exchangeCode(code: string): Promise<GoogleTokens> {
    const client = this.createOAuth2Client();
    const { tokens } = await client.getToken(code);
    if (!tokens.access_token) {
      throw new Error("No access token returned from Google");
    }
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? undefined,
      expiry_date: tokens.expiry_date ?? undefined,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
    const client = this.createOAuth2Client(undefined, refreshToken);
    const { credentials } = await client.refreshAccessToken();
    if (!credentials.access_token) {
      throw new Error("Failed to refresh access token");
    }
    return {
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token ?? refreshToken,
      expiry_date: credentials.expiry_date ?? undefined,
    };
  }

  async getUserInfo(accessToken: string): Promise<GoogleUser> {
    const client = this.createOAuth2Client(accessToken);
    const oauth2 = google.oauth2({ version: "v2", auth: client });
    const { data } = await oauth2.userinfo.get();
    if (!data.id || !data.email || !data.name) {
      throw new Error("Incomplete user info from Google");
    }
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture ?? "",
    };
  }

  async verifyToken(accessToken: string): Promise<void> {
    const client = this.createOAuth2Client(accessToken);
    const tokenInfo = await client.getTokenInfo(accessToken);
    if (!tokenInfo.email) {
      throw new Error("Invalid token");
    }
  }
}

export const googleService = new GoogleService();
