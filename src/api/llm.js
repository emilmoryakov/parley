/*
 * OpenRouter LLM API.
 *
 * The only module here that talks to a real network. Given the running
 * conversation it asks OpenRouter for a completion and resolves with the
 * assistant's reply text.
 *
 * ── Where to put your key ───────────────────────────────────────────────────
 * The key is read from a Vite env var, NOT hard-coded. Copy `.env.example` to
 * `.env.local` and set:
 *     VITE_OPENROUTER_API_KEY=sk-or-...
 * `.env.local` is gitignored, so the key never gets committed. Restart
 * `npm run dev` after editing env files.
 */

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini";

// Gives the assistant its persona; prepended to the conversation on every turn.
const SYSTEM_MESSAGE = {
  role: "system",
  content: "You are Parley, a friendly and concise assistant.",
};

/**
 * Request a chat completion from OpenRouter.
 *
 * @param {Array<{role: string, content: string}>} history The conversation so far.
 * @returns {Promise<string>} The assistant's reply text.
 */
export async function fetchAssistantReply(history) {
  if (!API_KEY) {
    throw new Error(
      "Missing OpenRouter API key — set VITE_OPENROUTER_API_KEY in .env.local (see .env.example).",
    );
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      // Optional OpenRouter attribution header — safe to keep or remove.
      "X-Title": "Parley",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [SYSTEM_MESSAGE, ...history.map(({ role, content }) => ({ role, content }))],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`OpenRouter request failed (${response.status}) ${detail}`.trim());
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}
