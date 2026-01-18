export function playAudioBase64(base64: string) {
    const audio = new Audio(`data:audio/mp3;base64,${base64}`);
    audio.play().catch((err) => {
      console.error("🔇 Audio play error:", err);
    });
  }
  