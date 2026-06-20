"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessagesSquare, Plus, Search, Settings2 } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { fetchConversations } from "@/lib/api/conversations";
import type { Conversation } from "@/lib/types";

export default function Sidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const pathname = usePathname();

  // Fetch the conversation list ONCE, when the sidebar mounts. The empty
  // dependency array is the point: it must not refetch on every render.
  useEffect(() => {
    let active = true;
    fetchConversations()
      .then((loaded) => {
        if (active) {
          setConversations(loaded);
        }
      })
      .catch(() => {
        if (active) {
          setConversations([]);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <aside className="hidden flex-col border-r border-white/10 bg-black/20 md:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pb-4 pt-6">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
          <MessagesSquare className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-mono text-sm font-medium tracking-[0.2em] text-zinc-100">parley</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            local session
          </p>
        </div>
      </div>

      {/* New chat */}
      <div className="px-4 pb-4">
        <button
          type="button"
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition duration-200 hover:scale-[1.02] hover:shadow-fuchsia-500/40 active:scale-[0.99]"
        >
          <Plus className="h-4 w-4 transition group-hover:rotate-90" />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-500 transition focus-within:border-white/20">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search chats…"
            className="w-full bg-transparent text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
      </div>

      <p className="px-5 pb-2 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
        Recents
      </p>

      {/* Conversation list */}
      <nav className="scroll-soft flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={pathname === `/conversations/${conversation.id}`}
          />
        ))}
      </nav>

      {/* Profile */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/[0.04]">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 text-xs font-semibold text-zinc-100 ring-1 ring-white/15">
            EM
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-medium text-zinc-100">Emil</span>
            <span className="block truncate text-[11px] text-zinc-500">Pro · local</span>
          </span>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
            aria-label="Settings"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
