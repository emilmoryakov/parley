import ChatPanel from "@/components/chat/ChatPanel";

// Dynamic route: every conversation has its own URL, e.g. /conversations/c1.
// In Next 15+, `params` is async and must be awaited.
export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // `key` remounts ChatPanel when the conversation changes, so its state resets
  // cleanly (fresh messages + loading) without setting state inside an effect.
  return <ChatPanel key={id} conversationId={id} />;
}
