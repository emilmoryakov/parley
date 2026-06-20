# Legacy — A3 plain-JavaScript chat

These are the original plain-JavaScript source files from assignment A3, kept here
for reference. They are **not** part of the React/Vite build (the project root is
now a Vite app) and are excluded from linting and formatting.

- `index.html` — the static page that loaded the modules below
- `main.js` — entry point + event listeners
- `api.js` — `fetch` + streaming from OpenRouter
- `chat.js` — DOM rendering
- `styles.css` — aurora backdrop, scrollbars, typing dots
- `config.example.js` — key template (the real `config.js` was gitignored)

The React rewrite lives in [`../src`](../src). See the root
[README](../README.md) to run it.
