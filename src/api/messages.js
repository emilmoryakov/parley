/*
 * Mock messages API.
 *
 * Like conversations.js, this is an in-memory array behind a Promise-based API.
 * Messages are keyed to a conversation by `conversationId`. `createMessage`
 * mutates the array (as a real INSERT would) and resolves with the saved row.
 */

// In-memory "database", pre-populated with a few messages per conversation.
const messages = [
  {
    id: "m1",
    conversationId: "c1",
    role: "user",
    content:
      "I want to redesign our chat UI — something modern with glassy panels and smooth motion. Where do we start?",
    time: "2:14 PM",
  },
  {
    id: "m2",
    conversationId: "c1",
    role: "assistant",
    content:
      "Great brief. I'd anchor on three pillars: a calm dark canvas, a single accent gradient, and motion that's felt but never loud. Want me to sketch the layout?",
    time: "2:14 PM",
  },
  {
    id: "m3",
    conversationId: "c1",
    role: "user",
    content: "Yes — keep the sidebar slim and let the conversation breathe.",
    time: "2:15 PM",
  },
  {
    id: "m4",
    conversationId: "c1",
    role: "assistant",
    content:
      "Done. Sidebar pinned at 300px with your recents, the thread fills the rest, and the composer floats on a soft blur.",
    time: "2:15 PM",
  },
  {
    id: "m5",
    conversationId: "c2",
    role: "user",
    content: "Our fetch calls fail silently sometimes. How should we handle errors?",
    time: "11:02 AM",
  },
  {
    id: "m6",
    conversationId: "c2",
    role: "assistant",
    content:
      "Wrap fetch in a helper that checks response.ok, throws on non-2xx, and surfaces the message to the UI. Add a short retry with backoff for network blips.",
    time: "11:03 AM",
  },
  {
    id: "m7",
    conversationId: "c3",
    role: "user",
    content: "Planning four days in Lisbon. What should I not miss?",
    time: "9:20 AM",
  },
  {
    id: "m8",
    conversationId: "c3",
    role: "assistant",
    content:
      "Alfama at golden hour, the tram 28 loop, pastéis in Belém, and a day trip to Sintra for Pena Palace. Add a sunset at Miradouro da Senhora do Monte.",
    time: "9:21 AM",
  },
];

let nextId = messages.length + 1;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clockTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** Return every message in a conversation, oldest first. Resolves with copies. */
export async function fetchMessages(conversationId) {
  await delay(300);
  return messages
    .filter((message) => message.conversationId === conversationId)
    .map((message) => ({ ...message }));
}

/** Insert a new message and resolve with the saved row. */
export async function createMessage({ conversationId, role, content }) {
  await delay(120);
  const message = {
    id: `m${nextId++}`,
    conversationId,
    role,
    content,
    time: clockTime(),
  };
  messages.push(message);
  return { ...message };
}
