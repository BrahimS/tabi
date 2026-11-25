/** Browser speech synthesis for Japanese text-to-speech. */

let primed = false;
// Chrome can garbage-collect an in-flight utterance; keep a live reference.
let liveUtterance: SpeechSynthesisUtterance | null = null;

export function primeSpeech() {
  if (typeof window === 'undefined' || primed) return;
  primed = true;
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  } catch {
    // speech not available — ignore
  }
}

function japaneseVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const ja = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith('ja'));
  return ja[0] ?? null;
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
  const voice = japaneseVoice(synth);
  if (voice) u.voice = voice;
  liveUtterance = u;
  u.onend = u.onerror = () => {
    if (liveUtterance === u) liveUtterance = null;
  };
  synth.speak(u);
  // Chrome/macOS auto-pauses the synth after ~15s idle — nudge it awake.
  if (synth.paused) synth.resume();
}
