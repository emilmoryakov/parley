# Parley

A small chat interface built with **React + Vite**. It loads conversations and
messages from a mock in-memory API and streams real replies from
[OpenRouter](https://openrouter.ai). Tailwind CSS is pulled in via the Play CDN.

## Quick start

```sh
npm install

# Add your OpenRouter key (gitignored, never committed):
cp .env.example .env.local        # Windows: copy .env.example .env.local
# then edit .env.local and set VITE_OPENROUTER_API_KEY=sk-or-...

npm run dev
```

Open the printed URL (default <http://localhost:5173>). Without a key the UI still
loads from the mock API — only the live AI reply needs one.

> **Where do I put the API key?** In `.env.local` as `VITE_OPENROUTER_API_KEY`.
> See `.env.example` and the comment at the top of [`src/api/llm.js`](src/api/llm.js).
> `.env.local` is listed in `.gitignore`, so the key is never committed.

## How it works

State lives in [`src/App.jsx`](src/App.jsx): the `messages` list and the
`activeConversationId`. Both are passed down to child components through props,
along with the callbacks they invoke.

- **Fetching** — a `useEffect` in `App` reloads messages from the mock API
  whenever `activeConversationId` changes; a `useEffect` in `Sidebar` fetches the
  conversation list once when it mounts.
- **Sending** — on submit, `App` creates a user message via the mock API, shows
  it, then requests a completion from OpenRouter. While it waits, a typing
  indicator is shown (the loading-indicator bonus); when the reply arrives it's
  added to state as an assistant message.

## Project layout

```
index.html              Tailwind CDN + #root mount point
src/
  main.jsx              React entry point
  App.jsx               top-level state (messages, activeConversationId)
  index.css             aurora backdrop, scrollbars, typing dots, animations
  api/
    conversations.js    mock API — in-memory array, returns Promises
    messages.js         mock API — in-memory array, returns Promises
    llm.js              real OpenRouter completion request
  components/
    sidebar/
      Sidebar.jsx           container — fetches conversations on mount
      ConversationItem.jsx  one conversation row
    chat/
      ChatPanel.jsx         container for the chat area
      ChatHeader.jsx        title + status
      MessageList.jsx       renders messages, empty/loading states, auto-scroll
      Message.jsx           one message bubble
      MessageInput.jsx      the composer form
      TypingIndicator.jsx   loading indicator while awaiting a reply
legacy/                 the A3 plain-JavaScript version, preserved (not built)
```

## Scripts

```sh
npm run dev          # start the Vite dev server
npm run build        # production build to dist/
npm run preview      # preview the production build
npm run lint         # ESLint
npm run format       # Prettier, write
```

A `pre-commit` hook (husky + lint-staged) checks staged files with Prettier and
ESLint. The `legacy/` folder is excluded from both.
