import type { Conversation } from "@/lib/types";

/*
 * Client-side conversations module — thin fetch wrappers over the API routes.
 * Used as queryFn / mutationFn by TanStack Query in the components.
 */

export async function fetchConversations(): Promise<Conversation[]> {
  const response = await fetch("/api/conversations");
  if (!response.ok) {
    throw new Error("Failed to load conversations");
  }
  return response.json();
}

export async function createConversation(title = "New conversation"): Promise<Conversation> {
  const response = await fetch("/api/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error("Failed to create conversation");
  }
  return response.json();
}

export async function deleteConversation(id: string): Promise<void> {
  const response = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete conversation");
  }
}
