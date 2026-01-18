import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import type { WSMessage } from "../hooks/useWebSocket";

import Message from "./Message";
import InputBox from "./InputBox";
import Controls from "./Controls";

const CHAT_WS_URL = "ws://localhost:8000/ws/chat";
const AUDIO_WS_URL = "ws://localhost:8000/ws/audio"; // 👈 THÊM
const USER_ID = "550e8400-e29b-41d4-a716-446655440000";

function playMp3Base64(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
  
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
  
    const blob = new Blob([bytes], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
  
    const audio = new Audio(url);
    audio.play();
  }

  
export default function Chat() {
    const { connected, messages, send } = useWebSocket(CHAT_WS_URL, {
        onAudio: playMp3Base64,
      });
      
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [topic, setTopic] = useState<string | null>(null);
  const [focusVocab, setFocusVocab] = useState<string[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!connected || !text.trim()) return;

    const payload: WSMessage = {
      user_id: USER_ID,
      message: text,
      topic: topic ?? undefined,
      vocab_focus: focusVocab.length ? focusVocab : undefined,
    };

    send(payload);
  };

  return (
    /* 🌍 VIEWPORT */
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
          height: "100vh",
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

        {/* MESSAGES */}
        <div
          style={{
            flex: 1,
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

        {/* INPUT */}
        <div
          style={{
            borderTop: "1px solid #eee",
            padding: 12,
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <InputBox
            onSend={handleSend}
            onVoiceText={(text) => {
                handleSend(text); // 👈 ĐÚNG
              }}
            disabled={!connected}
            audioWsUrl={AUDIO_WS_URL} // 👈 TRUYỀN XUỐNG
          />
        </div>
      </div>
    </div>
  );
}
