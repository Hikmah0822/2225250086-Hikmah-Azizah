/**
 * Floating "Tanya Beru" assistant for general questions about segiempat (Beranda, bangun, Catatanku, Bandingkan).
 *
 * Cost and correctness first:
 *  1. Questions the app's own content can answer (conceptAnswer.ts) are answered OFFLINE —
 *     free, instant, always correct, nothing sent.
 *  2. Only other questions go to the AI (if it is switched on and configured). Otherwise Beru
 *     suggests questions he can answer.
 * Every answer ends with a question that makes the student think (RMT mediation).
 * The greeting uses the student's name locally; the name is never sent (CLAUDE.md §9).
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Mascot from './Mascot';
import SpeakButton from './SpeakButton';
import { askTutor } from '../../lib/ai';
import { NOT_UNDERSTOOD, QUICK_CONCEPT_QUESTIONS, answerConcept, type ConceptAnswer } from '../../lib/conceptAnswer';
import { RMT_STAGES, stageName, type RmtStageId } from '../../lib/tutorPedagogy';
import { TUTOR_LIMITS, type ChatMessage, type TutorContext } from '../../lib/tutorPrompt';
import { firstName, useProfile } from '../../store/profileStore';
import { useSettings } from '../../store/settingsStore';

interface Turn extends ChatMessage {
  stage?: RmtStageId | null;
  link?: ConceptAnswer['link'];
  ai?: boolean;
}

/** Screens with the floating button. Not on practice, literacy or research tests (they have their own Beru or must stay unaided). */
const SHOW_ON = [/^\/$/, /^\/bangun\//, /^\/catatan$/, /^\/bandingkan$/, /^\/jurnal$/, /^\/progres$/];

/** Student questions per session (keeps AI cost low). */
const MAX_QUESTIONS = 15;

const toMessages = (turns: Turn[]): ChatMessage[] => turns.slice(-TUTOR_LIMITS.messages).map(({ role, content }) => ({ role, content }));

function generalContext(question: string, reference: ConceptAnswer | null): TutorContext {
  return {
    topic: 'Pertanyaan umum segiempat',
    question,
    correctAnswer: reference?.text ?? 'Tidak ada acuan khusus. Jawab hanya sesuai materi segiempat SMP; jika ragu, sarankan membuka materi di aplikasi.',
    solutionSteps: [],
    attempts: 0,
    solutionShown: false,
    general: true,
  };
}

export default function BeruAssistant() {
  const { pathname } = useLocation();
  const first = useProfile((s) => firstName(s.name));
  const aiEnabled = useSettings((s) => s.aiTutor);
  const [open, setOpen] = useState(false);
  const [aiReady, setAiReady] = useState(true);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [turns, busy, open]);

  // Close when the student moves to another screen.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!SHOW_ON.some((re) => re.test(pathname))) return null;

  const left = MAX_QUESTIONS - turns.filter((t) => t.role === 'user').length;
  const useAi = aiEnabled && aiReady;

  const ask = async (raw: string) => {
    const q = raw.trim().slice(0, TUTOR_LIMITS.messageChars);
    if (!q || busy || left <= 0) return;
    const history: Turn[] = [...turns, { role: 'user', content: q }];
    setTurns(history);
    setText('');
    const local = answerConcept(q);
    if (local) {
      setTurns([...history, { role: 'assistant', content: local.text, stage: local.stage, link: local.link }]);
      return;
    }
    if (!useAi) {
      setTurns([...history, { role: 'assistant', content: NOT_UNDERSTOOD }]);
      return;
    }
    setBusy(true);
    const r = await askTutor(generalContext(q, null), toMessages(history));
    setBusy(false);
    if (r.ok) setTurns([...history, { role: 'assistant', content: r.reply, stage: r.stage, ai: true }]);
    else {
      if (r.unavailable) setAiReady(false);
      setTurns([...history, { role: 'assistant', content: NOT_UNDERSTOOD }]);
    }
  };

  const onHome = pathname === '/';

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Tanya Beru, asisten belajarmu"
        className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-14 items-center gap-2 rounded-full bg-amber-400 pl-2 pr-4 font-extrabold text-amber-950 shadow-lg shadow-amber-700/30 ring-2 ring-white active:scale-95 dark:ring-slate-900"
      >
        {onHome ? <Mascot kind="bear" mood="happy" className="h-11 w-9" /> : <span className="text-2xl" aria-hidden>🐻</span>}
        Tanya Beru
      </button>
    );
  }

  return (
    <section
      aria-label="Tanya Beru"
      className="fixed inset-x-2 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 mx-auto flex max-h-[75dvh] max-w-lg animate-fade-up flex-col rounded-3xl bg-white shadow-2xl ring-1 ring-amber-200 dark:bg-slate-900 dark:ring-slate-700"
    >
      <header className="flex items-center gap-2 rounded-t-3xl bg-amber-100 px-3 py-2 dark:bg-slate-800">
        <span className="text-2xl" aria-hidden>
          🐻
        </span>
        <div className="flex-1">
          <p className="font-extrabold leading-tight">Beru</p>
          <p className="text-xs text-amber-900/80 dark:text-slate-400">Asisten belajarmu</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Tutup Tanya Beru" className="btn-ghost h-11 w-11 p-0 text-lg">
          ✕
        </button>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto p-3" aria-live="polite">
        <p className="mr-6 rounded-2xl rounded-bl-sm bg-amber-50 px-3 py-2 text-sm ring-1 ring-amber-100 dark:bg-slate-800 dark:ring-slate-700">
          Halo, {first}! 👋 Aku Beru. Mau tanya apa tentang segiempat?
        </p>
        {turns.map((m, i) =>
          m.role === 'user' ? (
            <p key={i} className="ml-8 rounded-2xl rounded-br-sm bg-brand-600 px-3 py-2 text-sm text-white">
              {m.content}
            </p>
          ) : (
            <div key={i} className="mr-6 space-y-1.5 rounded-2xl rounded-bl-sm bg-amber-50 px-3 py-2 text-sm ring-1 ring-amber-100 dark:bg-slate-800 dark:ring-slate-700">
              {m.stage && (
                <p className="text-[11px] font-bold">
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                    🧭 Tahap {RMT_STAGES.findIndex((s) => s.id === m.stage) + 1}: {stageName(m.stage)}
                  </span>
                </p>
              )}
              <p className="whitespace-pre-line">{m.content}</p>
              <div className="flex flex-wrap items-center gap-2">
                {m.link && (
                  <Link to={m.link.to} className="btn-secondary min-h-[44px] px-3 py-1 text-xs">
                    {m.link.label} →
                  </Link>
                )}
                <SpeakButton text={m.content} />
              </div>
              {m.ai && <p className="text-[11px] text-slate-500 dark:text-slate-400">Jawaban AI bisa keliru. Cocokkan dengan materi.</p>}
            </div>
          ),
        )}
        {busy && <p className="text-sm text-slate-500">Beru sedang berpikir…</p>}
        <div ref={endRef} />
      </div>

      <div className="space-y-2 border-t border-amber-100 p-3 dark:border-slate-700">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {QUICK_CONCEPT_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={busy || left <= 0}
              onClick={() => void ask(q)}
              className="min-h-[44px] shrink-0 rounded-full bg-amber-50 px-3 text-xs font-bold text-amber-900 ring-1 ring-amber-200 disabled:opacity-50 dark:bg-slate-800 dark:text-amber-200 dark:ring-slate-600"
            >
              {q}
            </button>
          ))}
        </div>
        {left > 0 ? (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void ask(text);
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={TUTOR_LIMITS.messageChars}
              placeholder="Tulis pertanyaanmu…"
              aria-label="Pertanyaan untuk Beru"
              className="min-h-[44px] min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-4 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
            <button type="submit" disabled={busy || !text.trim()} className="btn-primary min-h-[44px] px-4 text-sm">
              Kirim
            </button>
          </form>
        ) : (
          <p className="text-sm text-slate-500">Kamu sudah bertanya banyak hari ini. Yuk, coba buka materinya!</p>
        )}
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {useAi ? 'Jangan tulis data pribadimu (nama, sekolah, nomor HP).' : 'Mode tanpa internet: Beru menjawab dari materi aplikasi.'}
        </p>
      </div>
    </section>
  );
}
