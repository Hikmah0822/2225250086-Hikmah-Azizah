/** 🔊 "Bacakan" button. Hidden when the device cannot speak; explains when sound fails. */
import { useEffect, useState } from 'react';
import { speak, speechSupported, stopSpeaking } from '../../lib/speech';

export default function SpeakButton({ text, label = 'Bacakan' }: { text: string; label?: string }) {
  const [playing, setPlaying] = useState(false);
  const [note, setNote] = useState<{ kind: 'info' | 'error'; text: string; link?: { label: string; href: string } } | null>(null);
  // Stop reading when the button disappears (e.g. the student moves to the next question).
  useEffect(
    () => () => {
      void stopSpeaking();
    },
    [],
  );
  if (!speechSupported()) return null;

  const toggle = () => {
    if (playing) {
      setPlaying(false);
      void stopSpeaking();
      return;
    }
    setNote(null);
    setPlaying(true);
    // Called directly inside the tap: mobile browsers only allow sound from a user gesture.
    void speak(text, {
      onEnd: () => setPlaying(false),
      onError: (m, link) => {
        setPlaying(false);
        setNote({ kind: 'error', text: m, link });
      },
      onInfo: (m) => setNote({ kind: 'info', text: m }),
    });
  };

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-sm font-bold ring-1 transition active:scale-95 ${
          playing ? 'bg-sky-500 text-white ring-sky-500' : 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-slate-800 dark:text-sky-200 dark:ring-slate-700'
        }`}
      >
        <span aria-hidden>{playing ? '⏹' : '🔊'}</span>
        {playing ? 'Berhenti' : label}
      </button>
      {note && (
        <span
          role="status"
          className={`absolute right-0 top-full z-20 mt-1 w-64 rounded-xl p-2.5 pr-8 text-left text-xs font-normal shadow-lg ring-1 ring-black/5 ${
            note.kind === 'error' ? 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200' : 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100'
          }`}
        >
          <button type="button" onClick={() => setNote(null)} aria-label="Tutup pesan" className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full text-sm opacity-70 hover:opacity-100">
            ✕
          </button>
          {note.text}
          {note.link && (
            <a href={note.link.href} className="mt-1.5 flex min-h-[36px] items-center justify-center rounded-lg bg-white px-2 font-bold text-sky-800 ring-1 ring-sky-200 dark:bg-slate-900 dark:text-sky-200">
              🌐 {note.link.label}
            </a>
          )}
        </span>
      )}
    </span>
  );
}
