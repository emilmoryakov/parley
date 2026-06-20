import { NextRequest, NextResponse } from "next/server";

/*
 * Chat completion API route.
 *
 * This is the only place the OpenRouter key is used. It is read from
 * process.env on the server, has no NEXT_PUBLIC_ prefix, and is never sent to
 * the browser — the client only ever talks to this route.
 */

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_MESSAGE = {
  role: "system",
  content: "You are Parley, a friendly and concise assistant.",
};

interface ChatTurn {
  role: string;
  content: string;
}

interface OpenRouterResponse {
  choices?: { message?: { content?: string } }[];
}

// POST /api/chat → forwards the conversation to OpenRouter, returns { content }.
export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY on the server. Add it to .env.local and restart." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { messages?: ChatTurn[] };
  const history = body.messages ?? [];
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

  const upstream = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Title": "Parley",
    },
    body: JSON.stringify({
      model,
      messages: [SYSTEM_MESSAGE, ...history.map(({ role, content }) => ({ role, content }))],
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: `OpenRouter request failed (${upstream.status}) ${detail}`.trim() },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as OpenRouterResponse;
  const content = data.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ content });
}
