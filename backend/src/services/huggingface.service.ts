import axios from "axios";
import { config } from "../config";
import { AIResult, ExtractedEvent, ProcessEmailRequest } from "../types/ai";

function buildPrompt(req: ProcessEmailRequest): string {
  const body = req.body.slice(0, 6000);
  return `You are an email analysis assistant. Analyze this email and return ONLY valid JSON, no markdown fences, no extra text.

Email Details:
Subject: ${req.subject}
From: ${req.sender}
Date: ${req.date}

Body:
${body}

Return this exact JSON structure:
{
  "summary": "2-4 sentence summary of the email",
  "events": [
    {
      "title": "Event title",
      "date": "date string or null",
      "time": "time string or null",
      "location": "location or null",
      "confidence": 0.9
    }
  ]
}

If no calendar events are mentioned, return an empty events array.`;
}

export async function processEmail(req: ProcessEmailRequest): Promise<AIResult> {
  const start = Date.now();

  const response = await axios.post(
    config.HF_API_URL,
    { inputs: buildPrompt(req) },
    {
      headers: {
        Authorization: `Bearer ${config.HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const raw: unknown = response.data;
  let text: string;

  if (Array.isArray(raw) && raw.length > 0 && typeof (raw[0] as { generated_text?: unknown }).generated_text === "string") {
    text = (raw[0] as { generated_text: string }).generated_text;
  } else if (typeof raw === "string") {
    text = raw;
  } else {
    text = JSON.stringify(raw);
  }

  text = text.replace(/```json\n?|\n?```/g, "").trim();
  const parsed = JSON.parse(text);

  return {
    emailId: req.email_id,
    summary: parsed.summary ?? "",
    events: ((parsed.events ?? []) as ExtractedEvent[]).map((e) => ({
      ...e,
      confidence: e.confidence ?? 0.9,
    })),
    processingTimeMs: Date.now() - start,
  };
}
