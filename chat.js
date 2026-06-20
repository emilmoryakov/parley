/*
 * Parley — front-end behaviour for the static chat UI.
 *
 * The screen itself is a layout/styling exercise, so this file stays small:
 *   1. a <chat-message> custom element that renders each bubble,
 *   2. entrance animations driven by GSAP, and
 *   3. a little composer polish (auto-growing textarea, inert send).
 *
 * Tailwind, GSAP and Lucide load from CDNs in index.html. They're read off
 * `window` so this file stays lint-clean (no undeclared globals) and degrades
 * gracefully — if a CDN can't be reached, the page is still a usable chat.
 */

/**
 * <chat-message data-role="user|ai" data-author="…" data-time="…">…text…</chat-message>
 *
 * Reads its attributes and original text content, then rebuilds itself into a
 * styled avatar + bubble row. AI messages sit on the left, user messages on the
 * right. Kept in the light DOM on purpose so Tailwind's utilities apply.
 */
class ChatMessage extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered === "true") {
      return;
    }

    const isUser = this.dataset.role === "user";
    const author = this.dataset.author || (isUser ? "You" : "Parley");
    const time = this.dataset.time || "";
    const text = this.innerHTML.trim();

    const avatar = isUser
      ? `<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 text-xs font-semibold text-zinc-100 ring-1 ring-white/15">EM</span>`
      : `<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30"><i data-lucide="sparkles" class="h-4 w-4"></i></span>`;

    const bubble = isUser
      ? `<div class="rounded-2xl rounded-tr-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-lg shadow-fuchsia-500/20">${text}</div>`
      : `<div class="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[15px] leading-relaxed text-zinc-200 backdrop-blur-md">${text}</div>`;

    const meta = `<span class="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">${author} · ${time}</span>`;

    this.classList.add("flex", "w-full", "gap-3");
    if (isUser) {
      this.classList.add("flex-row-reverse");
    }

    this.innerHTML = `
      ${avatar}
      <div class="flex max-w-[80%] flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}">
        ${meta}
        ${bubble}
      </div>
    `;

    this.dataset.rendered = "true";
  }
}

customElements.define("chat-message", ChatMessage);

// Swap every <i data-lucide="…"> placeholder (including ones the custom element
// just produced) for its SVG icon.
if (window.lucide) {
  window.lucide.createIcons();
}

// Auto-grow the composer textarea as you type.
const field = document.querySelector("[data-composer-input]");
if (field) {
  const grow = () => {
    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, 192)}px`;
  };
  field.addEventListener("input", grow);
}

// The send button is intentionally inert — just stop the form from reloading.
const composer = document.querySelector("[data-composer]");
if (composer) {
  composer.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

// Choreographed entrance: sidebar, then conversations, header, messages and
// finally the composer. Skipped entirely if GSAP is missing or the visitor
// prefers reduced motion.
function animateIn() {
  const gsap = window.gsap;
  if (!gsap) {
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // clearProps on finish strips GSAP's inline styles so the DOM ends in its
  // natural, fully-visible state — nothing stays stranded at opacity 0.
  const targets = "[data-anim], chat-message";
  const timeline = gsap.timeline({
    defaults: { ease: "power3.out", duration: 0.7 },
    onComplete: () => gsap.set(targets, { clearProps: "all" }),
  });
  timeline
    .from("[data-anim='sidebar']", { x: -28, opacity: 0 })
    .from("[data-anim='conv']", { x: -18, opacity: 0, stagger: 0.06 }, "-=0.45")
    .from("[data-anim='header']", { y: -16, opacity: 0 }, "-=0.45")
    .from("chat-message", { y: 18, opacity: 0, stagger: 0.1 }, "-=0.3")
    .from("[data-anim='typing']", { y: 12, opacity: 0 }, "-=0.25")
    .from("[data-anim='composer']", { y: 24, opacity: 0 }, "-=0.4");
}

requestAnimationFrame(animateIn);
