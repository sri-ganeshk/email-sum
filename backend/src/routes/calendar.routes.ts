import { Router, Response } from "express";
import { z } from "zod";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { calendarService } from "../services/calendar.service";

const router = Router();

router.use(requireAuth);

const createEventSchema = z.object({
  title: z.string().min(1),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime(),
  location: z.string().optional(),
  description: z.string().optional(),
});

// POST /calendar/events
router.post("/events", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
    return;
  }

  try {
    const result = await calendarService.createEvent(req.accessToken!, parsed.data);
    res.status(201).json(result);
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(500).json({ error: "Failed to create calendar event" });
  }
});

// GET /calendar/events?timeMin=&timeMax=
router.get("/events", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const timeMin = req.query.timeMin ? String(req.query.timeMin) : new Date().toISOString();
  const timeMax = req.query.timeMax
    ? String(req.query.timeMax)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const events = await calendarService.listEvents(req.accessToken!, timeMin, timeMax);
    res.json({ events });
  } catch (err) {
    console.error("listEvents error:", err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

export default router;
