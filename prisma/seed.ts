import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/*
 * Seeds the database with a few conversations so the app has data on first load.
 * Run with `npm run db:seed`. Idempotent: it clears existing rows first.
 */

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// Fixed timestamps so message ordering (and the sidebar order) is deterministic.
const BASE = Date.parse("2026-06-20T09:00:00.000Z");
const at = (seconds: number) => new Date(BASE + seconds * 1000);

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();

  await prisma.conversation.create({
    data: {
      title: "UI redesign — glass & motion",
      createdAt: at(7200),
      messages: {
        create: [
          {
            role: "user",
            content:
              "I want to redesign our chat UI — something modern with glassy panels and smooth motion. Where do we start?",
            createdAt: at(7200),
          },
          {
            role: "assistant",
            content:
              "Great brief. I would anchor on three pillars: a calm dark canvas, a single accent gradient, and motion that is felt but never loud. Want me to sketch the layout?",
            createdAt: at(7220),
          },
          {
            role: "user",
            content: "Yes — keep the sidebar slim and let the conversation breathe.",
            createdAt: at(7240),
          },
          {
            role: "assistant",
            content:
              "Done. Sidebar pinned at 300px with your recents, the thread fills the rest, and the composer floats on a soft blur.",
            createdAt: at(7260),
          },
        ],
      },
    },
  });

  await prisma.conversation.create({
    data: {
      title: "API error handling pass",
      createdAt: at(3600),
      messages: {
        create: [
          {
            role: "user",
            content: "Our fetch calls fail silently sometimes. How should we handle errors?",
            createdAt: at(3600),
          },
          {
            role: "assistant",
            content:
              "Wrap fetch in a helper that checks response.ok, throws on non-2xx, and surfaces the message to the UI. Add a short retry with backoff for network blips.",
            createdAt: at(3660),
          },
        ],
      },
    },
  });

  await prisma.conversation.create({
    data: {
      title: "Trip planning: Lisbon",
      createdAt: at(0),
      messages: {
        create: [
          {
            role: "user",
            content: "Planning four days in Lisbon. What should I not miss?",
            createdAt: at(0),
          },
          {
            role: "assistant",
            content:
              "Alfama at golden hour, the tram 28 loop, pastéis in Belém, and a day trip to Sintra for Pena Palace.",
            createdAt: at(60),
          },
        ],
      },
    },
  });

  console.log("Seeded 3 conversations with messages.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
