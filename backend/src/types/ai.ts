export interface ExtractedEvent {
  title: string;
  date: string | null;
  time: string | null;
  location: string | null;
  confidence: number;
}

export interface AIResult {
  emailId: string;
  summary: string;
  events: ExtractedEvent[];
  processingTimeMs: number;
}

export interface ProcessEmailRequest {
  email_id: string;
  subject: string;
  body: string;
  sender: string;
  date: string;
}

export interface ProcessEmailResponse {
  email_id: string;
  summary: string;
  events: ExtractedEvent[];
  processing_time_ms: number;
}
