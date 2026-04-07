import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { AIResult, ExtractedEvent, ProcessEmailRequest } from "../types/ai";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

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
  const model = genAI.getGenerativeModel({ model: config.GEMINI_MODEL });
  const result = await model.generateContent(buildPrompt(req));
  const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
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
