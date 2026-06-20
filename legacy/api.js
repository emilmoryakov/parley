/*
 * Parley — network layer.
 *
 * One job: send the conversation to OpenRouter and stream the reply back token
 * by token. No DOM access lives here (see chat.js) and no event wiring (main.js).
 *
 * OpenRouter speaks the OpenAI chat-completions protocol. With "stream": true the
 * response is Server-Sent Events: newline-delimited frames, each shaped like
 *   data: {"choices":[{"delta":{"content":"Hel"}}]}
 * terminated by a final `data: [DONE]`.
 */

import { OPENROUTER_API_KEY, MODEL } from "./config.js";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Stream a chat completion from OpenRouter.
 *
 * @param {Array<{role: string, content: string}>} messages Full conversation history.
 * @param {(delta: string) => void} onDelta Called with each text fragment as it arrives.
 * @returns {Promise<string>} Resolves with the complete assistant reply.
 */
export async function streamChatCompletion(messages, onDelta) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "YOUR_OPENROUTER_API_KEY") {
    throw new Error("Missing OpenRouter API key — set OPENROUTER_API_KEY in config.js.");
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      // Optional OpenRouter attribution headers — safe to keep or remove.
      "X-Title": "Parley",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`OpenRouter request failed (${response.status}) ${detail}`.trim());
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let reply = "";
  let reading = true;

  while (reading) {
    const { value, done } = await reader.read();
    if (done) {
      reading = false;
      continue;
    }

    // A chunk may end mid-line, so keep the trailing fragment in `buffer` and
    // only process whole lines.
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) {
        continue;
      }

      const payload = trimmed.slice("data:".length).trim();
      if (payload === "[DONE]") {
        reading = false;
        break;
      }

      let frame;
      try {
        frame = JSON.parse(payload);
      } catch {
        // Comments / keep-alive frames aren't JSON — skip them.
        continue;
      }

      const delta = frame.choices?.[0]?.delta?.content;
      if (delta) {
        reply += delta;
        onDelta(delta);
      }
    }
  }

  return reply;
}
