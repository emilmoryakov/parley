"use client";

import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { fetchMessages, createMessage } from "@/lib/api/messages";
import { fetchAssistantReply } from "@/lib/api/chat";
import type { Message } from "@/lib/types";

export default function ChatPanel({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  // Starts true: the component remounts per conversation (see the `key` in the
  // route), so loading begins on mount rather than via a setState in the effect.
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  // Fetch messages when the ACTIVE CONVERSATION changes — not when the messages
  // array changes. Depending on `messages` here would refetch on every send and
  // loop endlessly; `conversationId` is the only correct dependency.
  useEffect(() => {
    let active = true;
    fetchMessages(conversationId)
      .then((loaded) => {
        if (active) {
          setMessages(loaded);
          setIsMessagesLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setMessages([]);
          setIsMessagesLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [conversationId]);

  async function handleSendMessage(text: string) {
    // 1. Persist the user message and show it immediately.
    const userMessage = await createMessage({ conversationId, role: "user", content: text });
    setMessages((previous) => [...previous, userMessage]);

    // 2. Ask the server for the AI reply, showing the loading indicator.
    setIsReplyLoading(true);
    try {
      const history = [...messages, userMessage];
      const reply = await fetchAssistantReply(history);
      const assistantMessage = await createMessage({
        conversationId,
        role: "assistant",
        content: reply || "(no response)",
      });
      // 3. Append the assistant message — it appears without any refetch.
      setMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Something went wrong";
      setMessages((previous) => [
        ...previous,
        {
          id: `err-${crypto.randomUUID()}`,
          conversationId,
          role: "assistant",
          content: `⚠ ${detail}`,
          time: "",
          isError: true,
        },
      ]);
    } finally {
      setIsReplyLoading(false);
    }
  }

  return (
    <section className="flex min-w-0 flex-col">
      <ChatHeader isReplyLoading={isReplyLoading} />
      <MessageList
        messages={messages}
        isMessagesLoading={isMessagesLoading}
        isReplyLoading={isReplyLoading}
      />
      <MessageInput onSendMessage={handleSendMessage} disabled={isReplyLoading} />
    </section>
  );
}
