"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Image as ImageIcon, ArrowUp } from "lucide-react";

export default function MessageInput({
  onSendMessage,
  disabled,
}: {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow the textarea with its content, up to a max height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
  }, [text]);

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) {
      return;
    }
    onSendMessage(trimmed);
    setText("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    submit();
  }

  // Enter sends; Shift+Enter inserts a newline.
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/10 bg-white/[0.02] px-4 py-4 sm:px-8"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-lg shadow-black/20 transition focus-within:border-indigo-400/40 focus-within:shadow-indigo-500/10">
        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "Waiting for Parley…" : "Message Parley…"}
          aria-label="Your message"
          className="scroll-soft max-h-48 flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-60"
        />

        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
          aria-label="Add image"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <button
          type="submit"
          disabled={!canSend}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30 transition duration-200 hover:scale-105 hover:shadow-fuchsia-500/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          aria-label="Send message"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-2 px-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
        Parley keeps everything in your browser · Enter to send
      </p>
    </form>
  );
}
