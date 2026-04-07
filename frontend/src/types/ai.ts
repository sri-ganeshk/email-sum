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
