import { Sparkles } from "lucide-react";

export default function Message({ message }) {
  const isUser = message.role === "user";
  const author = isUser ? "Emil" : "Parley";

  const avatar = isUser ? (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 text-xs font-semibold text-zinc-100 ring-1 ring-white/15">
      EM
    </span>
  ) : (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
      <Sparkles className="h-4 w-4" />
    </span>
  );

  // Bubble styling depends on who's speaking, plus a red variant for errors.
  let bubble =
    "rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[15px] leading-relaxed text-zinc-200 backdrop-blur-md";
  if (isUser) {
    bubble =
      "rounded-2xl rounded-tr-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-lg shadow-fuchsia-500/20";
  } else if (message.isError) {
    bubble =
      "rounded-2xl rounded-tl-md border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-[15px] leading-relaxed text-rose-200 backdrop-blur-md";
  }

  return (
    <div className={`message-in flex w-full gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {avatar}
      <div className={`flex max-w-[80%] flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
          {author}
          {message.time ? ` · ${message.time}` : ""}
        </span>
        <div className={bubble}>{message.content}</div>
      </div>
    </div>
  );
}
