/**
 * Asisten Belajar Beru — guides the student's mathematical thinking (lecturer's requirements):
 * step by step along the RMT stages, with cognitive-load-aware replies and a hint ladder that
 * rises with the student's difficulty. Never gives the final answer before real effort.
 *
 * Two modes, same pedagogy (src/lib/tutorPedagogy.ts):
 *  - AI mode: DeepSeek through our Netlify Function (needs a key and internet).
 *  - Guided mode: built from the problem's own hints and steps — free, offline, nothing sent.
 */
import { useEffect, useRef, useState } from 'react';
import Mascot from '../ui/Mascot';
import SpeakButton from '../ui/SpeakButton';
import { askTutor } from '../../lib/ai';
import { DIFFICULTIES, HINT_LEVELS, RMT_STAGES, guidedReply, hintLevel, stageName, stageOf, type DifficultyId, type RmtStageId } from '../../lib/tutorPedagogy';
import { TUTOR_LIMITS, type ChatMessage, type TutorContext } from '../../lib/tutorPrompt';
import { useSettings } from '../../store/settingsStore';

interface Turn extends ChatMessage {
  stage?: RmtStageId | null;
  level?: 1 | 2 | 3 | 4;
}

/** Student requests per problem (keeps AI cost low and nudges students to think). */
const MAX_QUESTIONS = 8;

export default function TutorChat({ context }: { context: TutorContext }) {
  const aiEnabled = useSettings((s) => s.aiTutor);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'ai' | 'guide'>(aiEnabled ? 'ai' : 'guide');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [asked, setAsked] = useState<Partial<Record<DifficultyId, number>>>({});
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const used = turns.filter((m) => m.role === 'user').length;
  const left = MAX_QUESTIONS - used;

  // Braces matter: newer browsers return a Promise from scrollIntoView, which React would treat as a cleanup function.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [turns, busy]);

  const guide = (history: Turn[], d: DifficultyId, level: 1 | 2 | 3 | 4) => {
    const g = guidedReply(context, d, level);
    setTurns([...history, { role: 'assistant', content: g.text, stage: g.stage, level }]);
  };

  /** A difficulty button: the main way to ask (works in both modes). */
  const askAbout = async (d: DifficultyId) => {
    if (busy || left <= 0) return;
    const level = hintLevel(context, asked[d] ?? 0);
    setAsked((a) => ({ ...a, [d]: (a[d] ?? 0) + 1 }));
    const label = DIFFICULTIES.find((x) => x.id === d)!.label;
    const history: Turn[] = [...turns, { role: 'user', content: label }];
    setTurns(history);
    setError(null);
    if (mode === 'guide') return guide(history, d, level);
    setBusy(true);
    const r = await askTutor(context, plain(history), { difficulty: d, level });
    setBusy(false);
    if (r.ok) setTurns([...history, { role: 'assistant', content: r.reply, stage: r.stage ?? stageOf(d), level }]);
    else {
      if (r.unavailable) setMode('guide');
      setError(r.message);
      guide(history, d, level);
    }
  };

  /** Free text: AI mode only. */
  const send = async () => {
    const msg = text.trim().slice(0, TUTOR_LIMITS.messageChars);
    if (!msg || busy || left <= 0 || mode !== 'ai') return;
    const history: Turn[] = [...turns, { role: 'user', content: msg }];
    setTurns(history);
    setText('');
    setError(null);
    setBusy(true);
    const r = await askTutor(context, plain(history));
    setBusy(false);
    if (r.ok) setTurns([...history, { role: 'assistant', content: r.reply, stage: r.stage }]);
    else {
      if (r.unavailable) setMode('guide');
      setError(`${r.message} Pilih salah satu tombol kesulitan di bawah.`);
      setTurns(turns);
      setText(msg);
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-secondary w-full gap-2 ring-amber-300">
        <Mascot kind="bear" mood="normal" className="h-7 w-6" />
        Minta bimbingan Beru
      </button>
    );
  }

  return (
    <section className="animate-fade-up space-y-3 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-3 ring-1 ring-amber-200 dark:from-slate-900 dark:to-slate-900 dark:ring-slate-700" aria-label="Asisten Belajar Beru">
      <div className="flex items-center gap-2">
        <Mascot kind="bear" mood="happy" className="h-12 w-10 shrink-0" />
        <div className="flex-1">
          <p className="font-extrabold">Asisten Belajar Beru</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'ai' ? 'Mode AI · Beru bisa keliru, cocokkan dengan pembahasan.' : 'Mode terpandu · tanpa internet, memakai petunjuk dari soal.'}
          </p>
        </div>
        <button type="button" className="btn-ghost min-h-[36px] px-2 text-sm" onClick={() => setOpen(false)} aria-label="Tutup Asisten Belajar">
          ✕
        </button>
      </div>

      {turns.length === 0 && (
        <p className="rounded-xl bg-white p-2 text-sm dark:bg-slate-800">
          Hai! Aku membimbingmu berpikir langkah demi langkah, bukan memberi jawaban. Bagian mana yang sulit? 🐻
        </p>
      )}

      <div className="max-h-80 space-y-2 overflow-y-auto" aria-live="polite">
        {turns.map((m, i) =>
          m.role === 'user' ? (
            <p key={i} className="ml-8 rounded-2xl rounded-br-sm bg-brand-600 px-3 py-2 text-sm text-white">
              {m.content}
            </p>
          ) : (
            <div key={i} className="mr-6 space-y-1.5 rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm ring-1 ring-amber-100 dark:bg-slate-800 dark:ring-slate-700">
              {(m.stage || m.level) && (
                <p className="flex flex-wrap gap-1 text-[11px] font-bold">
                  {m.stage && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                      🧭 Tahap {RMT_STAGES.findIndex((s) => s.id === m.stage) + 1}: {stageName(m.stage)}
                    </span>
                  )}
                  {m.level && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                      Bantuan {m.level}/4 · {HINT_LEVELS[m.level]}
                    </span>
                  )}
                </p>
              )}
              <p className="whitespace-pre-line">{m.content}</p>
              <SpeakButton text={m.content} label="Dengar" />
            </div>
          ),
        )}
        {busy && <p className="mr-6 animate-pulse rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 dark:bg-slate-800">Beru sedang berpikir… 🐾</p>}
        <div ref={endRef} />
      </div>

      {error && (
        <p role="status" className="rounded-lg bg-amber-50 p-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {error}
        </p>
      )}

      {left > 0 ? (
        <>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Bagian mana yang sulit?</p>
          <div className="grid gap-1.5">
            {DIFFICULTIES.map((d, i) => (
              <button
                key={d.id}
                type="button"
                disabled={busy}
                onClick={() => void askAbout(d.id)}
                className="flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-3 text-left text-sm font-semibold ring-1 ring-slate-200 transition active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-700"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-200">{i + 1}</span>
                {d.label}
              </button>
            ))}
          </div>
          {mode === 'ai' && (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={TUTOR_LIMITS.messageChars}
                placeholder="Atau tulis pertanyaanmu…"
                aria-label="Pertanyaan untuk Beru"
                className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
              />
              <button type="submit" className="btn-primary px-4" disabled={busy || !text.trim()}>
                Kirim
              </button>
            </form>
          )}
          <p className="text-right text-xs text-slate-400">Sisa bimbingan untuk soal ini: {left}</p>
        </>
      ) : (
        <p className="rounded-lg bg-slate-100 p-2 text-sm dark:bg-slate-800">Kamu sudah meminta bimbingan {MAX_QUESTIONS} kali untuk soal ini. Coba kerjakan dulu, atau buka pembahasan. 💪</p>
      )}
    </section>
  );
}

const plain = (turns: Turn[]): ChatMessage[] => turns.slice(-TUTOR_LIMITS.messages).map(({ role, content }) => ({ role, content }));
