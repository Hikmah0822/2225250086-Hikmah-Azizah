/** 🔊 "Bacakan" button. Hidden when the device cannot speak. */
import { useEffect, useState } from 'react';
import { speak, speechSupported, stopSpeaking } from '../../lib/speech';

export default function SpeakButton({ text, label = 'Bacakan' }: { text: string; label?: string }) {
  const [playing, setPlaying] = useState(false);
  // Stop reading when the button disappears (e.g. the student moves to the next question).
  useEffect(() => () => void stopSpeaking(), []);
  if (!speechSupported()) return null;

  const toggle = async () => {
    if (playing) {
      setPlaying(false);
      await stopSpeaking();
      return;
    }
    setPlaying(true);
    await speak(text, () => setPlaying(false));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      className={`inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-bold ring-1 transition active:scale-95 ${
        playing ? 'bg-sky-500 text-white ring-sky-500' : 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-slate-800 dark:text-sky-200 dark:ring-slate-700'
      }`}
    >
      <span aria-hidden>{playing ? '⏹' : '🔊'}</span>
      {playing ? 'Berhenti' : label}
    </button>
  );
}
