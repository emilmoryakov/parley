# Parley

A small chat interface built with **Next.js (App Router) + TypeScript + Tailwind
CSS**. Conversations and messages are persisted in **SQLite via Prisma**, served
by **API routes**, and fetched on the client with **TanStack Query**. The
assistant reply comes from OpenRouter through a **server-side** route so the API
key never reaches the browser.

## Quick start

```sh
npm install                       # also runs `prisma generate` (postinstall)

npx prisma migrate dev            # create the SQLite database + tables
npm run db:seed                   # seed a few conversations (optional)

# Add your OpenRouter key (server-side only, gitignored):
cp .env.example .env.local        # Windows: copy .env.example .env.local
# then edit .env.local and set OPENROUTER_API_KEY=sk-or-...

npm run dev
```

Open <http://localhost:3000>. The app reads conversations and messages from the
database without a key — only the live AI reply needs one.

> **Where do I put the API key?** In `.env.local` as `OPENROUTER_API_KEY` (no
> `NEXT_PUBLIC_` prefix). It is read with `process.env` only inside
> [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts), so Next.js never
> ships it to the browser. The database URL is non-secret and lives in the
> committed [`.env`](.env) (`DATABASE_URL="file:./dev.db"`).

## Data layer (Prisma + SQLite)

- [`prisma/schema.prisma`](prisma/schema.prisma) — `Conversation` and `Message`
  models; each message belongs to a conversation (and cascades on delete).
- [`src/lib/prisma.ts`](src/lib/prisma.ts) — a single shared `PrismaClient`,
  cached on `globalThis` so dev hot-reload reuses one connection. Prisma 7
  connects through the better-sqlite3 driver adapter.
- API routes read/write the database for every operation — there are no
  in-memory arrays:
  - [`api/conversations`](src/app/api/conversations/route.ts) — `GET` list, `POST` create
  - [`api/conversations/[id]`](src/app/api/conversations/[id]/route.ts) — `DELETE`
  - [`api/messages`](src/app/api/messages/route.ts) — `GET` by conversation, `POST` save
  - [`api/chat`](src/app/api/chat/route.ts) — `POST` → proxies OpenRouter with the server key

## Client data (TanStack Query)

[`QueryProvider`](src/components/providers/QueryProvider.tsx) wraps the layout so
every client component shares one query cache.

- **Queries** replace the old `useEffect` fetches:
  - [`Sidebar`](src/components/sidebar/Sidebar.tsx) — `useQuery(["conversations"])`,
    fetched once and cached (no refetch loop).
  - [`ChatPanel`](src/components/chat/ChatPanel.tsx) —
    `useQuery(["messages", conversationId])`, refetched when the **conversation
    changes**, never when the messages array changes.
- **Mutations** replace the writes and invalidate the relevant queries on
  success, so the UI updates automatically:
  - New Chat → create conversation → invalidate `["conversations"]`
  - Delete (trash icon on hover) → delete → invalidate `["conversations"]`
  - Send → save user message (shown optimistically) → OpenRouter reply → save
    assistant message → invalidate `["messages", id]`, so the reply appears with
    no manual refetch.

## File-based routing

Every conversation has its own URL, `/conversations/[id]`. The home page (`/`)
is a welcome screen. The sidebar lives in the root layout, so it stays mounted
across navigation.

## Scripts

```sh
npm run dev          # Next.js dev server on http://localhost:3000
npm run build        # production build (also type-checks)
npm run start        # serve the production build
npm run db:migrate   # prisma migrate dev
npm run db:seed      # seed the database
npm run db:reset     # drop + re-create + re-apply migrations
npm run lint         # ESLint (eslint-config-next)
npm run format       # Prettier, write
```

A `pre-commit` hook (husky + lint-staged) checks staged files with Prettier and
ESLint. The `legacy/` folder (the original A3 plain-JS version) and the generated
Prisma client are excluded from build/lint/format.
