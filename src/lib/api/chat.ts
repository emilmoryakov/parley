import type { Message } from "@/lib/types";

/*
 * Client-side chat module. Posts the conversation to the local /api/chat route,
 * which talks to OpenRouter on the server. The API key never reaches the client.
 */
export async function fetchAssistantReply(history: Message[]): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: history.map(({ role, content }) => ({ role, content })),
    }),
  });

  const data = (await response.json()) as { content?: string; error?: string };
  if (!response.ok) {
    throw new Error(data.error || "Chat request failed");
  }
  return data.content ?? "";
}
