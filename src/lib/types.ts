// Shared types used by both the client modules and the server API routes.
// (Type-only imports are erased at build time, so this file is safe on both sides.)
//
// These mirror the JSON the API routes return: Prisma's DateTime fields are
// serialized to ISO strings over HTTP.

export type Role = "user" | "assistant" | "system";

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  createdAt: string;
}
