import { google } from "googleapis";
import { convert } from "html-to-text";
import { googleService } from "./google.service";
import { EmailSummary, EmailDetail, EmailListResponse } from "../types/email";

function decodeBase64(encoded: string): string {
  return Buffer.from(encoded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

function getHeader(headers: { name?: string | null; value?: string | null }[], name: string): string {
  return headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function stripHtml(html: string): string {
  return convert(html, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  });
}

function extractBody(payload: any): { text: string; html?: string } {
  // Recursively find text/plain and text/html parts
  const findPart = (part: any, mimeType: string): string | null => {
    if (part.mimeType === mimeType && part.body?.data) {
      return decodeBase64(part.body.data);
    }
    if (part.parts) {
      for (const p of part.parts) {
        const result = findPart(p, mimeType);
        if (result) return result;
      }
    }
    return null;
  };

  const plainText = findPart(payload, "text/plain");
  const htmlText = findPart(payload, "text/html");

  if (plainText) {
    return { text: plainText, html: htmlText ?? undefined };
  }
  if (htmlText) {
    return { text: stripHtml(htmlText), html: htmlText };
  }
  // Fallback: decode body data directly
  if (payload.body?.data) {
    const decoded = decodeBase64(payload.body.data);
    return { text: decoded };
  }
  return { text: "" };
}

class GmailService {
  private getGmailClient(accessToken: string) {
    const auth = googleService.createOAuth2Client(accessToken);
    return google.gmail({ version: "v1", auth });
  }

  async listMessages(
    accessToken: string,
    labelIds = ["INBOX"],
    pageToken?: string,
    maxResults = 20
  ): Promise<EmailListResponse> {
    const gmail = this.getGmailClient(accessToken);

    const listRes = await gmail.users.messages.list({
      userId: "me",
      labelIds,
      maxResults,
      pageToken,
    });

    const messages = listRes.data.messages ?? [];
    const nextPageToken = listRes.data.nextPageToken ?? undefined;

    // Fetch metadata for each message in parallel
    const emails = await Promise.all(
      messages.map(async (msg): Promise<EmailSummary> => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        });

        const headers = detail.data.payload?.headers ?? [];
        const labelIdList = detail.data.labelIds ?? [];

        return {
          id: detail.data.id!,
          threadId: detail.data.threadId ?? "",
          subject: getHeader(headers, "Subject") || "(no subject)",
          from: getHeader(headers, "From"),
          snippet: detail.data.snippet ?? "",
          date: getHeader(headers, "Date"),
          isRead: !labelIdList.includes("UNREAD"),
          labelIds: labelIdList,
        };
      })
    );

    return { emails, nextPageToken };
  }

  async getMessage(accessToken: string, messageId: string): Promise<EmailDetail> {
    const gmail = this.getGmailClient(accessToken);

    const detail = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    const headers = detail.data.payload?.headers ?? [];
    const labelIdList = detail.data.labelIds ?? [];
    const { text, html } = extractBody(detail.data.payload);

    return {
      id: detail.data.id!,
      threadId: detail.data.threadId ?? "",
      subject: getHeader(headers, "Subject") || "(no subject)",
      from: getHeader(headers, "From"),
      to: getHeader(headers, "To"),
      cc: getHeader(headers, "Cc") || undefined,
      snippet: detail.data.snippet ?? "",
      date: getHeader(headers, "Date"),
      isRead: !labelIdList.includes("UNREAD"),
      labelIds: labelIdList,
      body: text,
      bodyHtml: html,
    };
  }
}

export const gmailService = new GmailService();
