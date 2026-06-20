import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/conversations/[id] → remove a conversation (its messages cascade).
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.conversation.delete({ where: { id } });
  } catch {
    // Already gone — treat delete as idempotent.
  }
  return NextResponse.json({ ok: true });
}
