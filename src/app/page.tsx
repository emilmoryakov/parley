import { Sparkles } from "lucide-react";

// Home page. Renders into the chat column of the layout shell. The sidebar (in
// the layout) lists conversations; pick one to open its own URL.
export default function Home() {
  return (
    <section className="flex min-w-0 flex-col items-center justify-center p-8">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
          <Sparkles className="h-7 w-7" />
        </span>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-zinc-100">Welcome to Parley</h1>
          <p className="text-sm text-zinc-400">
            Pick a conversation from the sidebar to start chatting.
          </p>
        </div>
      </div>
    </section>
  );
}
