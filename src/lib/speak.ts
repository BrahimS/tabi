/** Browser speech synthesis for Japanese text-to-speech. */

let primed = false;
// Chrome can garbage-collect an in-flight utterance; keep a live reference.
let liveUtterance: SpeechSynthesisUtterance | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

export function primeSpeech() {
  if (typeof window === 'undefined' || primed) return;
  primed = true;
  try {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.getVoices();
      // Voice list loads async — keep it warm.
      synth.onvoiceschanged = () => synth.getVoices();
    }
  } catch {
    // speech not available — ignore
  }
}

export function speakJapanese(text: string, rate = 0.85) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  // cancel() immediately before speak() can drop the new utterance in Chrome —
  // only cancel when something is actually queued or playing.
  if (synth.speaking || synth.pending || synth.paused) synth.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = rate;
  u.pitch = 1;
  // Deliberately no explicit u.voice — Chrome picks a working ja-JP voice
  // itself; forcing a specific system voice can silently drop the utterance.
  liveUtterance = u;

  let retried = false;
  u.onend = () => {
    if (liveUtterance === u) liveUtterance = null;
  };
  u.onerror = (e) => {
    if (liveUtterance === u) liveUtterance = null;
    // 'interrupted'/'audio-busy' means Chrome dropped it — retry once cleanly.
    if (!retried && (e.error === 'interrupted' || e.error === 'audio-busy')) {
      retried = true;
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(() => speakJapanese(text, rate), 250);
    }
  };
  synth.speak(u);
  // Chrome/macOS auto-pauses the synth after ~15s idle — nudge it awake.
  if (synth.paused) synth.resume();
}
