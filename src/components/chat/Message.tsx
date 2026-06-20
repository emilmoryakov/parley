import { Sparkles } from "lucide-react";
import type { Message as ChatMessage } from "@/lib/types";

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const author = isUser ? "Emil" : "Parley";
  const time = formatTime(message.createdAt);

  const avatar = isUser ? (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 text-xs font-semibold text-zinc-100 ring-1 ring-white/15">
      EM
    </span>
  ) : (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
      <Sparkles className="h-4 w-4" />
    </span>
  );

  const bubble = isUser
    ? "rounded-2xl rounded-tr-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-lg shadow-fuchsia-500/20"
    : "rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[15px] leading-relaxed text-zinc-200 backdrop-blur-md";

  return (
    <div className={`message-in flex w-full gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {avatar}
      <div className={`flex max-w-[80%] flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
          {author}
          {time ? ` · ${time}` : ""}
        </span>
        <div className={bubble}>{message.content}</div>
      </div>
    </div>
  );
}
