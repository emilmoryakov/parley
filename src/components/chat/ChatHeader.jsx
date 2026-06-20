import { Menu, Search, Share2, MoreHorizontal } from "lucide-react";

export default function ChatHeader({ isReplyLoading }) {
  return (
    <header className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-4">
      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-semibold text-zinc-100">Parley</h1>
        <p className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/70"></span>
          {isReplyLoading ? "Parley is typing…" : "Online · ready to chat"}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
          aria-label="Search in chat"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
          aria-label="Share"
        >
          <Share2 className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
          aria-label="More options"
        >
          <MoreHorizontal className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}
