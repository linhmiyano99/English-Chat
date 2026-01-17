import { useState } from "react";
import { useVoiceInput } from "../hooks/useVoiceInput";


interface InputBoxProps {
    onSend: (text: string) => void;
    onVoiceText: (text: string) => void; // 👈 BẮT BUỘC
    disabled?: boolean;
    audioWsUrl: string; // 👈 thêm

  }
  
  export default function InputBox({ onSend, onVoiceText, disabled, audioWsUrl, }: InputBoxProps) {
    
    const [text, setText] = useState("");

    const { start, stop, recording } = useVoiceInput(audioWsUrl, onVoiceText);

    const handleSend = () => {
      if (!text.trim()) return;
      onSend(text);
      setText("");
    };
  
    return (
      <div
        style={{
          display: "flex",        // ⭐ BẮT BUỘC
          gap: 8,
          width: "100%",          // ⭐ FULL WIDTH
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
          disabled={disabled}
          style={{
            flex: 1,              // ⭐ INPUT SCALE
            padding: "10px 12px",
            fontSize: 14,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
        onClick={recording ? stop : start}
        disabled={disabled}
        title={recording ? "Stop recording" : "Start recording"}
        style={{
          padding: "0 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: recording ? "#ef4444" : "#eee",
          cursor: "pointer",
        }}
      >
        {recording ? "🎙️" : "🎤"}
      </button>
  
        <button
          onClick={handleSend}
          disabled={disabled}
          style={{
            padding: "0 16px",
            borderRadius: 6,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </div>
    );
  }
  