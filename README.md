# Parley

A small chat interface built with **Next.js (App Router) + TypeScript + Tailwind
CSS**. Conversations and messages are served by in-memory **API routes**, and the
assistant reply comes from OpenRouter through a **server-side** route so the API
key never reaches the browser.

## Quick start

```sh
npm install

# Add your OpenRouter key (server-side only, gitignored):
cp .env.example .env.local        # Windows: copy .env.example .env.local
# then edit .env.local and set OPENROUTER_API_KEY=sk-or-...

npm run dev
```

Open <http://localhost:3000>. The app loads conversations and messages from the
mock API routes without a key — only the live AI reply needs one.

> **Where do I put the API key?** In `.env.local` as `OPENROUTER_API_KEY` (no
> `NEXT_PUBLIC_` prefix). It is read with `process.env` only inside
> [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts), so Next.js never
> ships it to the browser. See [`.env.example`](.env.example).

## Architecture

- **File-based routing** — every conversation has its own URL,
  `/conversations/[id]`. The home page (`/`) shows a welcome message. The sidebar
  lives in the root layout, so it stays mounted (and fetches once) as you move
  between conversations.
- **Server-side API routes** hold the data and secrets:
  - [`api/conversations`](src/app/api/conversations/route.ts) — `GET` the list
  - [`api/messages`](src/app/api/messages/route.ts) — `GET` by conversation, `POST` to create
  - [`api/chat`](src/app/api/chat/route.ts) — `POST` → proxies OpenRouter with the server key
- **Client API modules** ([`src/lib/api`](src/lib/api)) call those routes with
  relative URLs instead of touching in-memory arrays directly.
- **Client components** carry the `"use client"` directive only where they use
  hooks/handlers (`Sidebar`, `ChatPanel`, `MessageList`, `MessageInput`).

### useEffect dependencies

- The conversation list is fetched **once on mount** (`[]` dependency) in
  [`Sidebar`](src/components/sidebar/Sidebar.tsx) — it does not refetch on every render.
- Messages are fetched when the **active conversation changes**
  (`[conversationId]`), never on changes to the `messages` array itself, which
  would loop endlessly. `ChatPanel` is remounted per conversation via a route
  `key`, so loading state resets cleanly without a setState-in-effect.

### Sending a message

The user message is created via `POST /api/messages` and shown immediately. While
the server fetches the AI reply (a typing indicator shows), the assistant message
is appended to state when it returns — no page refresh or manual refetch.

## Project layout

```
src/
  app/
    layout.tsx                  shell: fonts, aurora, persistent <Sidebar>
    page.tsx                    home (welcome)
    globals.css                 Tailwind + aurora/scrollbars/typing/animations
    conversations/[id]/page.tsx dynamic conversation route → <ChatPanel>
    api/
      conversations/route.ts    server data + GET
      messages/route.ts         server data + GET/POST
      chat/route.ts             server-only OpenRouter proxy (reads process.env)
  components/
    sidebar/   Sidebar, ConversationItem
    chat/      ChatPanel, ChatHeader, MessageList, Message, MessageInput, TypingIndicator
  lib/
    types.ts                    shared Conversation / Message types
    api/                        client fetch wrappers (conversations, messages, chat)
legacy/                         the A3 plain-JS version, preserved (not built)
```

## Scripts

```sh
npm run dev          # Next.js dev server on http://localhost:3000
npm run build        # production build (also type-checks)
npm run start        # serve the production build
npm run lint         # ESLint (eslint-config-next)
npm run format       # Prettier, write
```

A `pre-commit` hook (husky + lint-staged) checks staged files with Prettier and
ESLint. The `legacy/` folder is excluded from both.
