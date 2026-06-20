"use client";

import Link from "next/link";
import { Sparkles, Bug, Plane, Calendar, Trash2, type LucideIcon } from "lucide-react";
import type { Conversation } from "@/lib/types";

// Conversations no longer store an icon/accent, so derive a stable one from the
// id — the same conversation always gets the same colour and glyph.
const ICONS: LucideIcon[] = [Sparkles, Bug, Plane, Calendar];
const ACCENTS = [
  "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white",
  "bg-rose-500/15 text-rose-300",
  "bg-amber-500/15 text-amber-300",
  "bg-emerald-500/15 text-emerald-300",
];

function pickIndex(id: string, length: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % length;
  }
  return hash;
}

function formatStamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ConversationItem({
  conversation,
  isActive,
  onDelete,
}: {
  conversation: Conversation;
  isActive: boolean;
  onDelete: () => void;
}) {
  const index = pickIndex(conversation.id, ICONS.length);
  const Icon = ICONS[index];
  const accent = ACCENTS[index];

  const base =
    "relative flex w-full items-center gap-3 rounded-xl py-2.5 pl-3 pr-9 text-left transition";
  const state = isActive
    ? "border border-white/10 bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/10"
    : "border border-transparent hover:border-white/10 hover:bg-white/[0.04]";

  function handleDelete(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    onDelete();
  }

  return (
    <div className="group relative">
      <Link
        href={`/conversations/${conversation.id}`}
        aria-current={isActive ? "page" : undefined}
        className={`${base} ${state}`}
      >
        {isActive && (
          <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gradient-to-b from-indigo-400 to-fuchsia-400" />
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
            <span className="shrink-0 font-mono text-[10px] text-zinc-500">
              {formatStamp(conversation.updatedAt)}
            </span>
          </span>
          <span className="block truncate text-xs text-zinc-400">{conversation.preview}</span>
        </span>
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        aria-label="Delete conversation"
        className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 opacity-0 transition hover:bg-rose-500/15 hover:text-rose-300 focus:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
