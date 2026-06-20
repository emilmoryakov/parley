import { Sparkles } from "lucide-react";

// Loading indicator shown while we wait for the assistant's reply.
export default function TypingIndicator() {
  return (
    <div className="message-in flex w-full gap-3" aria-label="Parley is typing">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.06] px-4 py-3.5 text-zinc-300 backdrop-blur-md">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
