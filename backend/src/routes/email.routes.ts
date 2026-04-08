import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { aiProcessLimiter } from "../middleware/rateLimit";
import { gmailService } from "../services/gmail.service";
import { processEmail } from "../services/huggingface.service";

const router = Router();

// All email routes require auth
router.use(requireAuth);

// GET /emails?labelIds=INBOX&pageToken=
router.get("/", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const labelIds = req.query.labelIds
      ? String(req.query.labelIds).split(",")
      : ["INBOX"];
    const pageToken = req.query.pageToken ? String(req.query.pageToken) : undefined;

    const result = await gmailService.listMessages(req.accessToken!, labelIds, pageToken);
    res.json(result);
  } catch (err) {
    console.error("listMessages error:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

// GET /emails/:id
router.get("/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const email = await gmailService.getMessage(req.accessToken!, req.params.id);
    res.json({ email });
  } catch (err) {
    console.error("getMessage error:", err);
    res.status(500).json({ error: "Failed to fetch email" });
  }
});

// POST /emails/:id/process — trigger ML analysis
router.post("/:id/process", aiProcessLimiter, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const email = await gmailService.getMessage(req.accessToken!, req.params.id);

    const result = await processEmail({
      email_id: email.id,
      subject: email.subject,
      body: email.body,      // plain text, HTML already stripped by gmailService
      sender: email.from,
      date: email.date,
    });

    res.json(result);
  } catch (err) {
    console.error("processEmail error:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
});

export default router;
