/*
 * Parley — DOM layer.
 *
 * Everything that touches the page lives here: building message bubbles,
 * streaming text into the assistant's bubble, the typing indicator, the
 * composer's auto-grow/busy states, and the GSAP entrance animation. No network
 * code (see api.js) and no event wiring (main.js) — those import the helpers below.
 *
 * Tailwind, GSAP and Lucide load from CDNs in index.html and are read off
 * `window` so a missing CDN degrades gracefully instead of throwing.
 */

const log = document.querySelector("#log");
const emptyState = document.querySelector("#empty-state");
const field = document.querySelector("#field");
const sendButton = document.querySelector("#send");

// Bubble styling, kept verbatim from the A2 markup so dynamic messages match the
// look of the rest of the UI.
const BUBBLE_USER =
  "rounded-2xl rounded-tr-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-lg shadow-fuchsia-500/20";
const BUBBLE_AI =
  "rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[15px] leading-relaxed text-zinc-200 backdrop-blur-md";
const BUBBLE_ERROR =
  "rounded-2xl rounded-tl-md border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-[15px] leading-relaxed text-rose-200 backdrop-blur-md";

const TYPING_DOTS =
  '<span class="flex items-center gap-1.5 py-1 text-zinc-300">' +
  '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>' +
  "</span>";

// ---- internal helpers ------------------------------------------------------

function scrollToBottom() {
  log.scrollTop = log.scrollHeight;
}

// Re-render any <i data-lucide> placeholders the avatars just produced.
function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function animateRow(row) {
  const gsap = window.gsap;
  if (!gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  gsap.from(row, { y: 14, opacity: 0, duration: 0.4, ease: "power3.out", clearProps: "all" });
}

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function avatar(isUser) {
  const el = document.createElement("span");
  if (isUser) {
    el.className =
      "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 text-xs font-semibold text-zinc-100 ring-1 ring-white/15";
    el.textContent = "EM";
  } else {
    el.className =
      "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30";
    el.innerHTML = '<i data-lucide="sparkles" class="h-4 w-4"></i>';
  }
  return el;
}

/**
 * Build an avatar + bubble row, append it to the log, and return the bubble
 * element so callers can write or stream text into it. Text is always set via
 * textContent, never innerHTML, so model output and user input can't inject markup.
 */
function appendRow(role) {
  const isUser = role === "user";

  const row = document.createElement("div");
  row.className = isUser ? "flex w-full gap-3 flex-row-reverse" : "flex w-full gap-3";

  const column = document.createElement("div");
  column.className = `flex max-w-[80%] flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`;

  const meta = document.createElement("span");
  meta.className = "font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500";
  meta.textContent = `${isUser ? "Emil" : "Parley"} · ${timestamp()}`;

  const bubble = document.createElement("div");
  bubble.className = isUser ? BUBBLE_USER : BUBBLE_AI;

  column.append(meta, bubble);
  row.append(avatar(isUser), column);

  if (emptyState && emptyState.isConnected) {
    emptyState.remove();
  }
  log.append(row);
  refreshIcons();
  animateRow(row);
  scrollToBottom();

  return bubble;
}

// ---- public API ------------------------------------------------------------

/** Render the user's message bubble. */
export function addUserMessage(text) {
  const bubble = appendRow("user");
  bubble.textContent = text;
}

/**
 * Open an empty assistant bubble (showing a typing indicator) and return a
 * controller for streaming the reply into it.
 */
export function createAssistantStream() {
  const bubble = appendRow("ai");
  bubble.innerHTML = TYPING_DOTS;

  let text = "";
  let started = false;

  return {
    /** Append one streamed fragment, replacing the typing dots on the first call. */
    push(delta) {
      if (!started) {
        bubble.textContent = "";
        started = true;
      }
      text += delta;
      bubble.textContent = text;
      scrollToBottom();
    },
    /** Called once the stream ends; covers the "model said nothing" case. */
    finish() {
      if (!started) {
        bubble.textContent = "Parley didn't return anything.";
        bubble.classList.add("text-zinc-400");
      }
    },
    /** Turn the bubble into an error notice. */
    error(message) {
      bubble.className = BUBBLE_ERROR;
      bubble.textContent = message;
      scrollToBottom();
    },
  };
}

// ---- composer helpers ------------------------------------------------------

/** Current trimmed value of the message field. */
export function readField() {
  return field.value.trim();
}

/** Clear the field and collapse it back to one row. */
export function clearField() {
  field.value = "";
  autoGrow();
}

export function focusField() {
  field.focus();
}

/** Grow the textarea with its content, up to the CSS max height. */
export function autoGrow() {
  field.style.height = "auto";
  field.style.height = `${Math.min(field.scrollHeight, 192)}px`;
}

/** Disable input + send button while a request is in flight. */
export function setBusy(busy) {
  field.disabled = busy;
  if (sendButton) {
    sendButton.disabled = busy;
    sendButton.classList.toggle("opacity-50", busy);
    sendButton.classList.toggle("pointer-events-none", busy);
  }
}

/**
 * Render icons and play the one-off entrance animation for the app shell.
 * Called once from main.js at startup.
 */
export function mountChrome() {
  refreshIcons();

  const gsap = window.gsap;
  if (!gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const timeline = gsap.timeline({
    defaults: { ease: "power3.out", duration: 0.7 },
    onComplete: () => gsap.set("[data-anim]", { clearProps: "all" }),
  });
  timeline
    .from("[data-anim='sidebar']", { x: -28, opacity: 0 })
    .from("[data-anim='conv']", { x: -18, opacity: 0, stagger: 0.06 }, "-=0.45")
    .from("[data-anim='header']", { y: -16, opacity: 0 }, "-=0.45")
    .from("#empty-state", { y: 18, opacity: 0 }, "-=0.3")
    .from("[data-anim='composer']", { y: 24, opacity: 0 }, "-=0.4");
}
