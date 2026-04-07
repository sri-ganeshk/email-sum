import { create } from "zustand";
import { GmailLabel } from "../types/email";

interface EmailState {
  selectedEmailId: string | null;
  selectedLabel: GmailLabel;
  pageToken: string | null;
  setSelectedEmail: (id: string | null) => void;
  setLabel: (label: GmailLabel) => void;
  setPageToken: (token: string | null) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  selectedEmailId: null,
  selectedLabel: "INBOX",
  pageToken: null,
  setSelectedEmail: (id) => set({ selectedEmailId: id }),
  setLabel: (label) => set({ selectedLabel: label, selectedEmailId: null, pageToken: null }),
  setPageToken: (token) => set({ pageToken: token }),
}));
