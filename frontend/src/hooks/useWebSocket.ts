import { useEffect, useRef, useState } from "react";

export interface WSMessage {
  user_id: string;
  message: string;
  topic?: string;
  vocab_focus?: string[];
}

interface WSResponse {
  session_id: string;
  reply: string;
}

export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export function useWebSocket(url: string) {
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
      if (!active) return;

      const data: WSResponse = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
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
