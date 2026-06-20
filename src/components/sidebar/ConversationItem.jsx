import { Sparkles, Bug, Plane, Calendar, MessageCircle } from "lucide-react";

// Map the icon/accent names stored on a conversation to concrete values. Full
// class strings (not concatenated fragments) so the Tailwind CDN picks them up.
const ICONS = {
  sparkles: Sparkles,
  bug: Bug,
  plane: Plane,
  calendar: Calendar,
};

const ACCENTS = {
  indigo: "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white",
  rose: "bg-rose-500/15 text-rose-300",
  amber: "bg-amber-500/15 text-amber-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
};

export default function ConversationItem({ conversation, isActive, onSelect }) {
  const Icon = ICONS[conversation.icon] ?? MessageCircle;
  const accent = ACCENTS[conversation.accent] ?? ACCENTS.indigo;

  const base =
    "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition";
  const state = isActive
    ? "border border-white/10 bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/10"
    : "border border-transparent hover:border-white/10 hover:bg-white/[0.04]";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? "page" : undefined}
      className={`${base} ${state}`}
    >
      {isActive && (
        <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gradient-to-b from-indigo-400 to-fuchsia-400"></span>
      )}
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${accent}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-sm ${isActive ? "font-semibold text-zinc-100" : "font-medium text-zinc-200"}`}
          >
            {conversation.title}
          </span>
          <span className="shrink-0 font-mono text-[10px] text-zinc-500">{conversation.time}</span>
        </span>
        <span className="block truncate text-xs text-zinc-400">{conversation.preview}</span>
      </span>
    </button>
  );
}
