# Parley

A tiny chat interface that runs entirely in the browser. No server, no API calls —
type a message, hit send, and it shows up in the log. It's the starting point for a
larger AI chat app.

## Layout

- `index.html` — the page: a message log, a text field, and a send button.
- `chat.js` — wires the form up; sending appends the message and clears the input.
- `styles.css` — all of the styling (warm paper palette, mono labels, serif text).

## Working on it

```sh
npm install      # pulls dev tooling and sets up the git hook
npm run lint     # ESLint
npm run format   # Prettier, write
```

A `pre-commit` hook checks staged files with Prettier and ESLint. If something isn't
formatted or has a lint error, the commit is rejected — run `npm run format` and
`npm run lint:fix`, then commit again.
