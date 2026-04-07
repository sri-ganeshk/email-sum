import { google } from "googleapis";
import { googleService } from "./google.service";

export interface CreateEventInput {
  title: string;
  startDateTime: string; // ISO 8601
  endDateTime: string;   // ISO 8601
  location?: string;
  description?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  htmlLink: string;
}

class CalendarService {
  private getCalendarClient(accessToken: string) {
    const auth = googleService.createOAuth2Client(accessToken);
    return google.calendar({ version: "v3", auth });
  }

  async createEvent(accessToken: string, input: CreateEventInput): Promise<{ eventId: string; htmlLink: string }> {
    const calendar = this.getCalendarClient(accessToken);

    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: input.title,
        location: input.location,
        description: input.description,
        start: {
          dateTime: input.startDateTime,
          timeZone: "UTC",
        },
        end: {
          dateTime: input.endDateTime,
          timeZone: "UTC",
        },
      },
    });

    return {
      eventId: res.data.id!,
      htmlLink: res.data.htmlLink!,
    };
  }

  async listEvents(accessToken: string, timeMin: string, timeMax: string): Promise<CalendarEvent[]> {
    const calendar = this.getCalendarClient(accessToken);

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    return (res.data.items ?? []).map((item) => ({
      id: item.id!,
      title: item.summary ?? "",
      startDateTime: item.start?.dateTime ?? item.start?.date ?? "",
      endDateTime: item.end?.dateTime ?? item.end?.date ?? "",
      location: item.location ?? undefined,
      htmlLink: item.htmlLink ?? "",
    }));
  }
}

export const calendarService = new CalendarService();
