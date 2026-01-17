import { useRef, useState } from "react";

export function useVoiceInput(
  audioWsUrl: string,
  onText: (text: string) => void   // 👈 callback trả text STT
) {
  const wsRef = useRef<WebSocket | null>(null);
  const [recording, setRecording] = useState(false);

  async function start() {
    if (recording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const source = audioCtx.createMediaStreamSource(stream);

    await audioCtx.audioWorklet.addModule("/pcm-processor.js");
    const worklet = new AudioWorkletNode(audioCtx, "pcm-processor");

    wsRef.current = new WebSocket(audioWsUrl);
    wsRef.current.binaryType = "arraybuffer";

    // 👇 NHẬN TEXT TỪ SERVER STT
    wsRef.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
      
          if (data.reply) {
            onText(data.reply); // 👈 callback lên Chat.tsx
          }
        } catch (err) {
          console.error("Invalid WS message", e.data);
        }
      };

    wsRef.current.onclose = () => {
      console.log("🔌 Audio WS closed");
    };

    wsRef.current.onerror = (err) => {
      console.error("❌ Audio WS error", err);
    };

    // 👇 STREAM AUDIO
    worklet.port.onmessage = (e) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(e.data);
      }
    };

    source.connect(worklet);
    worklet.connect(audioCtx.destination);

    setRecording(true);
  }

  function stop() {
    wsRef.current?.close();
    wsRef.current = null;
    setRecording(false);
  }

  return { start, stop, recording };
}
