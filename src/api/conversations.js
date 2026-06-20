/*
 * Mock conversations API.
 *
 * Stands in for a real backend: an in-memory array is the "database" and every
 * call returns a Promise (with a small delay) so the UI code looks exactly like
 * it would against a real server. Swap these functions for `fetch(...)` later
 * and nothing in the components has to change.
 */

// In-memory "database". Pre-populated so the app has data on first load.
const conversations = [
  {
    id: "c1",
    title: "UI redesign — glass & motion",
    preview: "Ship the prototype 🚀",
    icon: "sparkles",
    accent: "indigo",
    time: "now",
  },
  {
    id: "c2",
    title: "API error handling pass",
    preview: "Let's wrap fetch in a retry…",
    icon: "bug",
    accent: "rose",
    time: "2h",
  },
  {
    id: "c3",
    title: "Trip planning: Lisbon",
    preview: "Add a day in Sintra",
    icon: "plane",
    accent: "emerald",
    time: "Jun 12",
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Return all conversations, newest first. Resolves with copies. */
export async function fetchConversations() {
  await delay(250);
  return conversations.map((conversation) => ({ ...conversation }));
}
