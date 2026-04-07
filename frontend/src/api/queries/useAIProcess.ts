import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "../backendClient";
import { AIResult } from "../../types/ai";
import { useUIStore } from "../../store/uiStore";

export function useAIProcess() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation<AIResult, Error, string>({
    mutationFn: (emailId: string) =>
      backendClient.post(`/emails/${emailId}/process`).then((r) => r.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["ai", data.emailId], data);
      addToast({ type: "success", message: "AI analysis complete" });
    },
    onError: () => {
      addToast({ type: "error", message: "AI processing failed. Please try again." });
    },
  });
}

export function useAIResult(emailId: string | null) {
  const queryClient = useQueryClient();
  if (!emailId) return null;
  return queryClient.getQueryData<AIResult>(["ai", emailId]) ?? null;
}
