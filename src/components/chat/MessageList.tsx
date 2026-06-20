"use client";

import { useEffect, useRef } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import type { Message as ChatMessage } from "@/lib/types";

export default function MessageList({
  messages,
  isMessagesLoading,
  isReplyLoading,
}: {
  messages: ChatMessage[];
  isMessagesLoading: boolean;
  isReplyLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the newest message (or the typing indicator) in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isReplyLoading]);

  return (
    <main
      className="scroll-soft flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-7 sm:px-8"
      aria-live="polite"
      aria-label="Conversation"
    >
      {isMessagesLoading ? (
        <div className="m-auto flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading conversation…
        </div>
      ) : messages.length === 0 ? (
        <div className="m-auto flex max-w-sm flex-col items-center gap-4 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-7 w-7" />
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-100">Start a conversation</h2>
            <p className="text-sm text-zinc-400">Ask Parley anything to get going.</p>
          </div>
        </div>
      ) : (
        messages.map((message) => <Message key={message.id} message={message} />)
      )}

      {isReplyLoading && <TypingIndicator />}

      <div ref={bottomRef} />
    </main>
  );
}
