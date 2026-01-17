import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import type { WSMessage } from "../hooks/useWebSocket";

import Message from "./Message";
import InputBox from "./InputBox";
import Controls from "./Controls";

const WS_URL = "ws://localhost:8000/ws/chat";
const USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function Chat() {
  const { connected, messages, send } = useWebSocket(WS_URL);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [topic, setTopic] = useState<string | null>(null);
  const [focusVocab, setFocusVocab] = useState<string[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!connected) return;

    const payload: WSMessage = {
      user_id: USER_ID,
     message: text,
      topic: topic ?? undefined,
      vocab_focus: focusVocab.length ? focusVocab : undefined,
    };

    send(payload);
  };

  return (
    /* 🌍 VIEWPORT — center như ChatGPT */
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      {/* 💬 CHAT COLUMN */}
      <div
        style={{
          width: 768,
          height: "100vh", // ✅ FIX CỨNG
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          borderLeft: "1px solid #eee",
          borderRight: "1px solid #eee",
        }}
      >
        {/* HEADER */}
        <h2
          style={{
            padding: "16px",
            margin: 0,
            borderBottom: "1px solid #eee",
            flexShrink: 0,
          }}
        >
          🗣️ Speaking Coach
        </h2>
  
        {/* CONTROLS */}
        <div style={{ padding: "0 16px", flexShrink: 0 }}>
          <Controls
            topic={topic}
            onTopicChange={setTopic}
            focusVocab={focusVocab}
            onFocusVocabChange={setFocusVocab}
          />
  
          <div style={{ fontSize: 12, margin: "8px 0" }}>
            Status: {connected ? "🟢 Connected" : "🔴 Connecting..."}
          </div>
        </div>
  
        {/* MESSAGES — CHỖ DUY NHẤT ĐƯỢC SCROLL */}
        <div
          style={{
            flex: 1, // ⭐ CỰC KỲ QUAN TRỌNG
            overflowY: "auto",
            padding: 12,
            background: "#f7f7f7",
          }}
        >
          {messages.map((m, idx) => (
            <Message key={idx} role={m.role} content={m.content} />
          ))}
          <div ref={bottomRef} />
        </div>
  
        {/* INPUT — LUÔN DÍNH DƯỚI */}
        <div
          style={{
            borderTop: "1px solid #eee",
            padding: 12,
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <InputBox onSend={handleSend} disabled={!connected} />
        </div>
      </div>
    </div>
  );
  
  
} 
