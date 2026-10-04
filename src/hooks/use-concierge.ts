"use client";

import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { ChatMessage, AskConciergeResponse } from "@/types/rag.types";
import { conciergeContent } from "@/content/concierge.content";

const INITIAL_WELCOME: ChatMessage = {
  id: "welcome-msg",
  role: "assistant",
  content: conciergeContent.welcomeMessage,
  timestamp: new Date().toISOString(),
};

export function useConcierge() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggleOpen = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const setOpen = React.useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const sendMessage = React.useCallback(
    async (query: string) => {
      if (!query || !query.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: query.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);
      setError(null);

      try {
        const res = await apiClient.post<
          | AskConciergeResponse
          | { data: AskConciergeResponse }
          | { reply: string; answer?: string; sources?: AskConciergeResponse["sources"] }
        >("/rag/ask", {
          query: query.trim(),
        });

        const responseData =
          (res as { data?: AskConciergeResponse }).data || (res as AskConciergeResponse);

        const replyText =
          responseData?.reply ||
          (responseData as unknown as { answer?: string }).answer ||
          "I am delighted to assist you. Our team is at your service.";

        const sources = responseData?.sources || [];

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: replyText,
          sources,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        const fallbackMsg: ChatMessage = {
          id: `assistant-fallback-${Date.now()}`,
          role: "assistant",
          content:
            "I am currently experiencing a brief connection delay to our policy database. For immediate assistance with breakfast hours, checkout policies, or valet service, please dial 0 from your suite phone or visit our Front Desk Reception.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setError("Unable to reach AI Concierge. Front Desk available 24/7.");
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming]
  );

  return {
    messages,
    isOpen,
    isStreaming,
    error,
    toggleOpen,
    setOpen,
    sendMessage,
  };
}
