import type { Message, Role } from "@/lib/types";

/*
 * Client-side messages module. Calls the local API route (relative URLs) rather
 * than touching an in-memory array directly.
 */

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const response = await fetch(
    `/api/messages?conversationId=${encodeURIComponent(conversationId)}`,
  );
  if (!response.ok) {
    throw new Error("Failed to load messages");
  }
  return response.json();
}

export async function createMessage(input: {
  conversationId: string;
  role: Role;
  content: string;
}): Promise<Message> {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Failed to create message");
  }
  return response.json();
}
