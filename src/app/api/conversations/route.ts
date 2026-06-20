import { NextResponse } from "next/server";
import type { Conversation } from "@/lib/types";

/*
 * Conversations API route.
 *
 * The in-memory "database" now lives here on the server (it used to be an array
 * inside the client-side api module). The client reaches it over HTTP via
 * src/lib/api/conversations.ts.
 */
const conversations: Conversation[] = [
  {
    id: "c1",
    title: "UI redesign — glass & motion",
    preview: "Ship the prototype 🚀",
    icon: "sparkles",
    accent: "indigo",
    time: "now",
  },
  {
    id: "c2",
    title: "API error handling pass",
    preview: "Let us wrap fetch in a retry…",
    icon: "bug",
    accent: "rose",
    time: "2h",
  },
  {
    id: "c3",
    title: "Trip planning: Lisbon",
    preview: "Add a day in Sintra",
    icon: "plane",
    accent: "emerald",
    time: "Jun 12",
  },
];

// GET /api/conversations → the full conversation list.
export async function GET() {
  return NextResponse.json(conversations);
}
