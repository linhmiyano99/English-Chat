import { useEffect, useRef, useState } from "react";
import { playAudioBase64 } from "../utils/audio";

export interface WSMessage {
  user_id: string;
  message: string;
  topic?: string;
  vocab_focus?: string[];
}

// interface WSResponse {
//   session_id: string;
//   reply: string;
// }

interface AssistantResponse {
  session_id: string;
  reply: string;
  audio?: string; // optional
}
  
// type WSIncoming = AssistantResponse;

interface WSOptions {
onAudio?: (base64: string) => void;
}

export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export function useWebSocket(url: string, options?: WSOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    console.log("WS INIT");
    let active = true;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!active) return;
      console.log("WS OPEN");
      setConnected(true);
    };

    ws.onmessage = (event) => {
        const data: AssistantResponse = JSON.parse(event.data);
        console.log("WS raw data:", data); // 👈 CHECK NGAY

      
        // 1️⃣ hiển thị text
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            session_id: data.session_id,
          },
        ]);
        console.log("audio length:", data.audio?.length);

      
        // 2️⃣ phát audio nếu có
        if (data.audio) {
          playAudioBase64(data.audio);
        }
      };

    ws.onerror = (err) => {
      console.error("WS ERROR", err);
    };

    ws.onclose = () => {
      if (!active) return;
      console.log("WS CLOSE");
      setConnected(false);
    };

    return () => {
      console.log("WS CLEANUP");
      active = false;
      try {
        ws.close();
      } catch {}
    };
  }, [url]);

  const send = (payload: WSMessage) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // optimistic UI
    setMessages((prev) => [
      ...prev,
      { role: "user", content: payload.message },
    ]);

    wsRef.current.send(JSON.stringify(payload));
  };

  return {
    connected,
    messages,
    send,
  };
}
