import ChatHeader from "./ChatHeader.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

export default function ChatPanel({ messages, isMessagesLoading, isReplyLoading, onSendMessage }) {
  return (
    <section className="flex min-w-0 flex-col">
      <ChatHeader isReplyLoading={isReplyLoading} />
      <MessageList
        messages={messages}
        isMessagesLoading={isMessagesLoading}
        isReplyLoading={isReplyLoading}
      />
      <MessageInput onSendMessage={onSendMessage} disabled={isReplyLoading} />
    </section>
  );
}
