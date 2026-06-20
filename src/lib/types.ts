// Shared types used by both the client modules and the server API routes.
// (Type-only imports are erased at build time, so this file is safe on both sides.)

export type Role = "user" | "assistant" | "system";

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  icon: string;
  accent: string;
  time: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  time: string;
  isError?: boolean;
}
