import type { ChatMessage } from "../hooks/useWebSocket";

export default function Message({ role, content }: ChatMessage) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          borderRadius: 14,
          background: isUser ? "#DCF8C6" : "#F1F0F0",
          color: "#000",
          maxWidth: "70%",
          whiteSpace: "pre-wrap",
          lineHeight: 1.4,
        }}
      >
        {content}
      </div>
    </div>
  );
}
