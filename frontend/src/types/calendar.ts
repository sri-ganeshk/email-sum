export interface CreateEventInput {
  title: string;
  startDateTime: string;
  endDateTime: string;
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
