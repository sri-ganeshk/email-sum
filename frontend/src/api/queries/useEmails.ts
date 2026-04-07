import { useInfiniteQuery } from "@tanstack/react-query";
import { backendClient } from "../backendClient";
import { EmailListResponse, GmailLabel } from "../../types/email";

export function useEmails(label: GmailLabel) {
  return useInfiniteQuery<EmailListResponse>({
    queryKey: ["emails", label],
    queryFn: ({ pageParam }) =>
      backendClient
        .get("/emails", { params: { labelIds: label, pageToken: pageParam ?? undefined } })
        .then((r) => r.data),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? null,
    staleTime: 2 * 60 * 1000,
  });
}
