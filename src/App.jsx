import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import ChatPanel from "./components/chat/ChatPanel.jsx";
import { fetchMessages, createMessage } from "./api/messages.js";
import { fetchAssistantReply } from "./api/llm.js";

export default function App() {
  // The two pieces of top-level state the app revolves around.
  const [activeConversationId, setActiveConversationId] = useState("c1");
  const [messages, setMessages] = useState([]);

  // UI status flags.
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  // Load the thread whenever the active conversation changes. The `active` guard
  // ignores a stale response if the user switches conversations mid-fetch.
  useEffect(() => {
    let active = true;
    setIsMessagesLoading(true);

    fetchMessages(activeConversationId).then((loaded) => {
      if (active) {
        setMessages(loaded);
        setIsMessagesLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [activeConversationId]);

  async function handleSendMessage(text) {
    // 1. Persist + show the user's message immediately.
    const userMessage = await createMessage({
      conversationId: activeConversationId,
      role: "user",
      content: text,
    });
    setMessages((previous) => [...previous, userMessage]);

    // 2. Ask the LLM, showing the loading indicator while we wait.
    setIsReplyLoading(true);
    try {
      const history = [...messages, userMessage];
      const reply = await fetchAssistantReply(history);
      const assistantMessage = await createMessage({
        conversationId: activeConversationId,
        role: "assistant",
        content: reply || "(no response)",
      });
      setMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      // Surface failures as an assistant bubble rather than swallowing them.
      setMessages((previous) => [
        ...previous,
        {
          id: `err-${crypto.randomUUID()}`,
          conversationId: activeConversationId,
          role: "assistant",
          content: `⚠ ${error.message}`,
          time: "",
          isError: true,
        },
      ]);
    } finally {
      setIsReplyLoading(false);
    }
  }

  return (
    <>
      {/* Drifting aurora backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="aurora-blob aurora-blob--1"></div>
        <div className="aurora-blob aurora-blob--2"></div>
        <div className="aurora-blob aurora-blob--3"></div>
      </div>

      {/* Floating glass app card */}
      <div className="relative mx-auto flex h-[100dvh] max-w-[1440px] p-0 sm:p-4 lg:p-6">
        <div className="grid h-full w-full grid-cols-1 overflow-hidden rounded-none border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/60 backdrop-blur-2xl sm:rounded-3xl md:grid-cols-[300px_1fr]">
          <Sidebar
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
          />
          <ChatPanel
            messages={messages}
            isMessagesLoading={isMessagesLoading}
            isReplyLoading={isReplyLoading}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
}
