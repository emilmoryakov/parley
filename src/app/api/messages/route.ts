import { NextRequest, NextResponse } from "next/server";
import type { Message, Role } from "@/lib/types";

/*
 * Messages API route.
 *
 * The in-memory "database" lives here on the server. Module-level state persists
 * across requests within a running dev server, which is enough for this mock
 * (it resets on restart, as an in-memory store would).
 */
const messages: Message[] = [
  {
    id: "m1",
    conversationId: "c1",
    role: "user",
    content:
      "I want to redesign our chat UI — something modern with glassy panels and smooth motion. Where do we start?",
    time: "2:14 PM",
  },
  {
    id: "m2",
    conversationId: "c1",
    role: "assistant",
    content:
      "Great brief. I would anchor on three pillars: a calm dark canvas, a single accent gradient, and motion that is felt but never loud. Want me to sketch the layout?",
    time: "2:14 PM",
  },
  {
    id: "m3",
    conversationId: "c1",
    role: "user",
    content: "Yes — keep the sidebar slim and let the conversation breathe.",
    time: "2:15 PM",
  },
  {
    id: "m4",
    conversationId: "c1",
    role: "assistant",
    content:
      "Done. Sidebar pinned at 300px with your recents, the thread fills the rest, and the composer floats on a soft blur.",
    time: "2:15 PM",
  },
  {
    id: "m5",
    conversationId: "c2",
    role: "user",
    content: "Our fetch calls fail silently sometimes. How should we handle errors?",
    time: "11:02 AM",
  },
  {
    id: "m6",
    conversationId: "c2",
    role: "assistant",
    content:
      "Wrap fetch in a helper that checks response.ok, throws on non-2xx, and surfaces the message to the UI. Add a short retry with backoff for network blips.",
    time: "11:03 AM",
  },
  {
    id: "m7",
    conversationId: "c3",
    role: "user",
    content: "Planning four days in Lisbon. What should I not miss?",
    time: "9:20 AM",
  },
  {
    id: "m8",
    conversationId: "c3",
    role: "assistant",
    content:
      "Alfama at golden hour, the tram 28 loop, pastéis in Belém, and a day trip to Sintra for Pena Palace.",
    time: "9:21 AM",
  },
];

let nextId = messages.length + 1;

function clockTime(): string {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// GET /api/messages?conversationId=c1 → that conversation's messages.
export async function GET(request: NextRequest) {
  const conversationId = request.nextUrl.searchParams.get("conversationId");
  const result = conversationId
    ? messages.filter((message) => message.conversationId === conversationId)
    : messages;
  return NextResponse.json(result);
}

// POST /api/messages → insert a message and return the saved row.
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    conversationId?: string;
    role?: Role;
    content?: string;
  };

  if (!body.conversationId || !body.role || !body.content) {
    return NextResponse.json(
      { error: "conversationId, role and content are required" },
      { status: 400 },
    );
  }

  const message: Message = {
    id: `m${nextId++}`,
    conversationId: body.conversationId,
    role: body.role,
    content: body.content,
    time: clockTime(),
  };
  messages.push(message);

  return NextResponse.json(message, { status: 201 });
}
