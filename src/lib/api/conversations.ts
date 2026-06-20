import type { Conversation } from "@/lib/types";

/*
 * Client-side conversations module. Instead of holding an in-memory array, it
 * now calls the local API route (relative URL) — the data lives on the server.
 */
export async function fetchConversations(): Promise<Conversation[]> {
  const response = await fetch("/api/conversations");
  if (!response.ok) {
    throw new Error("Failed to load conversations");
  }
  return response.json();
}
