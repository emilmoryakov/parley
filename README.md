# Parley

A chat interface that runs entirely in the browser. No server, no API calls — it's
a static, two-column chat layout: a sidebar of conversations on the left and the
active thread on the right, with a composer pinned to the bottom.

## Layout

- `index.html` — the page: a sidebar (New Chat, search, conversation list, profile)
  and a main area split into a scrollable message list and a bottom composer.
- `chat.js` — defines the `<chat-message>` custom element that renders each bubble,
  runs the GSAP entrance animations, and adds small composer polish.
- `styles.css` — low-level polish underneath Tailwind: the drifting aurora backdrop,
  custom scrollbars, the typing-indicator dots, and reduced-motion handling.

## UI stack

Everything is loaded from CDNs, so opening `index.html` is all you need:

- **Tailwind CSS** (Play CDN) — layout and component styling via utility classes.
- **GSAP** — the choreographed entrance animation (sidebar → messages → composer).
- **Lucide** — the icon set.
- **Inter** + **JetBrains Mono** — typography (Google Fonts).

The libraries are read off `window` and guarded, so the page still works as a plain
chat if a CDN is unavailable. Send is intentionally inert — this is a styling
exercise, not a working backend.

## Working on it

```sh
npm install      # pulls dev tooling and sets up the git hook
npm run lint     # ESLint
npm run format   # Prettier, write
```

A `pre-commit` hook checks staged files with Prettier and ESLint. If something isn't
formatted or has a lint error, the commit is rejected — run `npm run format` and
`npm run lint:fix`, then commit again.
