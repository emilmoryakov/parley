"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { fetchMessages, createMessage } from "@/lib/api/messages";
import { fetchAssistantReply } from "@/lib/api/chat";
import type { Message } from "@/lib/types";

export default function ChatPanel({ conversationId }: { conversationId: string }) {
  const queryClient = useQueryClient();
  const messagesKey = ["messages", conversationId];

  // Fetch messages for the active conversation. The query key includes the id,
  // so the data refetches when the conversation changes — never when the
  // messages array itself changes (which would loop forever).
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: messagesKey,
    queryFn: () => fetchMessages(conversationId),
  });

  // Sending: save the user message, ask the LLM, save the assistant reply, then
  // invalidate so the UI reflects the persisted rows automatically.
  const sendMessage = useMutation({
    mutationFn: async ({ text, history }: { text: string; history: Message[] }) => {
      await createMessage({ conversationId, role: "user", content: text });
      const reply = await fetchAssistantReply([...history, { role: "user", content: text }]);
      await createMessage({
        conversationId,
        role: "assistant",
        content: reply || "(no response)",
      });
    },
    // Show the user's message instantly (optimistic), before the round-trip.
    onMutate: async ({ text }) => {
      await queryClient.cancelQueries({ queryKey: messagesKey });
      const previous = queryClient.getQueryData<Message[]>(messagesKey) ?? [];
      const optimistic: Message = {
        id: `optimistic-${crypto.randomUUID()}`,
        conversationId,
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Message[]>(messagesKey, [...previous, optimistic]);
      return { previous };
    },
    // Either way, refetch the real rows (and the sidebar previews).
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  function handleSendMessage(text: string) {
    sendMessage.mutate({ text, history: messages });
  }

  const errorText =
    sendMessage.isError && sendMessage.error instanceof Error ? sendMessage.error.message : null;

  return (
    <section className="flex min-w-0 flex-col">
      <ChatHeader isReplyLoading={sendMessage.isPending} />
      <MessageList
        messages={messages}
        isMessagesLoading={isMessagesLoading}
        isReplyLoading={sendMessage.isPending}
        errorText={errorText}
      />
      <MessageInput onSendMessage={handleSendMessage} disabled={sendMessage.isPending} />
    </section>
  );
}
