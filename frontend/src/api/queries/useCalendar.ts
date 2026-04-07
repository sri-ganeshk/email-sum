import { useMutation } from "@tanstack/react-query";
import { backendClient } from "../backendClient";
import { CreateEventInput } from "../../types/calendar";
import { useUIStore } from "../../store/uiStore";

export function useAddToCalendar() {
  const addToast = useUIStore((s) => s.addToast);

  return useMutation<{ eventId: string; htmlLink: string }, Error, CreateEventInput>({
    mutationFn: (input) =>
      backendClient.post("/calendar/events", input).then((r) => r.data),
    onSuccess: (data) => {
      addToast({ type: "success", message: "Event added to Google Calendar!" });
      window.open(data.htmlLink, "_blank", "noopener,noreferrer");
    },
    onError: () => {
      addToast({ type: "error", message: "Failed to add event to calendar." });
    },
  });
}
