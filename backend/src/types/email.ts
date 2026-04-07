export interface EmailSummary {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  isRead: boolean;
  labelIds: string[];
}

export interface EmailDetail extends EmailSummary {
  body: string;
  bodyHtml?: string;
  to: string;
  cc?: string;
}

export interface EmailListResponse {
  emails: EmailSummary[];
  nextPageToken?: string;
}
