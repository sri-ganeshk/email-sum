import { useQuery } from "@tanstack/react-query";
import { backendClient } from "../backendClient";
import { EmailDetail } from "../../types/email";

export function useEmailDetail(emailId: string | null) {
  return useQuery<{ email: EmailDetail }>({
    queryKey: ["email", emailId],
    queryFn: () => backendClient.get(`/emails/${emailId}`).then((r) => r.data),
    enabled: !!emailId,
    staleTime: 5 * 60 * 1000,
  });
}
