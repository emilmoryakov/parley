/*
 * Parley — application entry point.
 *
 * Owns the conversation `messages` array, wires the composer's events, and glues
 * user input to the streaming API (api.js) and the rendered bubbles (chat.js).
 */

import { streamChatCompletion } from "./api.js";
import {
  addUserMessage,
  createAssistantStream,
  readField,
  clearField,
  focusField,
  autoGrow,
  setBusy,
  mountChrome,
} from "./chat.js";

// Full conversation history, replayed to OpenRouter on every turn. The system
// message sets the assistant's persona; user/assistant turns accumulate below it.
const messages = [
  {
    role: "system",
    content: "You are Parley, a friendly and concise assistant.",
  },
];

// Guards against double-sends while a reply is still streaming.
let busy = false;

const form = document.querySelector("#composer");
const field = document.querySelector("#field");

async function send() {
  if (busy) {
    return;
  }

  const text = readField();
  if (!text) {
    return;
  }

  // 1. Show the user's message and record it in history.
  addUserMessage(text);
  messages.push({ role: "user", content: text });
  clearField();

  // 2. Open an assistant bubble and stream the reply into it word by word.
  busy = true;
  setBusy(true);
  const stream = createAssistantStream();

  try {
    const reply = await streamChatCompletion(messages, (delta) => stream.push(delta));
    stream.finish();
    // 3. Persist the finished reply so the next turn carries full context.
    messages.push({ role: "assistant", content: reply });
  } catch (error) {
    stream.error(`⚠ ${error.message}`);
  } finally {
    busy = false;
    setBusy(false);
    focusField();
  }
}

// Send on form submit (the send button) …
form.addEventListener("submit", (event) => {
  event.preventDefault();
  send();
});

// … and on Enter, while Shift+Enter still inserts a newline.
field.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    send();
  }
});

// Grow the textarea as the message wraps onto more lines.
field.addEventListener("input", autoGrow);

// Render icons and play the entrance animation.
mountChrome();
