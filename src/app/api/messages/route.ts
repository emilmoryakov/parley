import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/types";

/*
 * Messages API route — backed by Prisma/SQLite.
 *   GET  ?conversationId=… → that conversation's messages (oldest first)
 *   POST → save a message and return the saved row
 */

export async function GET(request: NextRequest) {
  const conversationId = request.nextUrl.searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}

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

  const message = await prisma.message.create({
    data: {
      conversationId: body.conversationId,
      role: body.role,
      content: body.content,
    },
  });

  return NextResponse.json(message, { status: 201 });
}
