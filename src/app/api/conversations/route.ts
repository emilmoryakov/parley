import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/*
 * Conversations API route — backed by Prisma/SQLite (no more in-memory arrays).
 *   GET  → list conversations (newest first), with a preview of the last message
 *   POST → create a conversation
 */

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { createdAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return NextResponse.json(
    conversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      preview: conversation.messages[0]?.content ?? "No messages yet",
      updatedAt: conversation.updatedAt,
    })),
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { title?: string };
  const conversation = await prisma.conversation.create({
    data: { title: body.title?.trim() || "New conversation" },
  });

  return NextResponse.json(
    {
      id: conversation.id,
      title: conversation.title,
      preview: "No messages yet",
      updatedAt: conversation.updatedAt,
    },
    { status: 201 },
  );
}
