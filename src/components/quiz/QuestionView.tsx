/**
 * One practice question with fading support (F07):
 *  - example:     worked example, steps revealed one at a time
 *  - completion:  most steps already shown, student gives the final answer
 *  - independent: student works alone; 3 graded hints; solution after 2 wrong tries
 */
import { useState } from 'react';
import type { Question } from '../../types';
import { type GradeResult, grade } from '../../lib/quiz/grade';
import { formatNumber } from '../../lib/format';
import ShapeFigure from '../geometry/ShapeFigure';
import Celebrate from '../ui/Celebrate';
import Mascot from '../ui/Mascot';
import { QUESTIONS } from '../../content/questions';
import SpeakButton from '../ui/SpeakButton';
import InfoSorter from './InfoSorter';

export interface QuestionOutcome {
  /** 1 = right first time, 0.5 = right after retry, 0 = not solved, null = worked example (not scored). */
  score: number | null;
}

interface Props {
  question: Question;
  onNext: (outcome: QuestionOutcome) => void;
  onAttempt?: (result: GradeResult) => void;
}

function answerText(q: Question): string {
  if (q.type === 'numeric') return `${formatNumber(q.answer, 2)}${q.unit ? ` ${q.unit}` : ''}`;
  if (q.type === 'multiple-choice') return q.options.find((o) => o.id === q.answer)?.text ?? '';
  return q.options.filter((o) => q.answer.includes(o.id)).map((o) => o.text).join('; ');
}

function Steps({ steps, from = 0, label }: { steps: string[]; from?: number; label: string }) {
  return (
    <ol className="space-y-2" aria-label={label}>
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{from + i + 1}</span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

function StoryBlocks({ q, open }: { q: Question; open: boolean }) {
  if (!q.story) return null;
  return (
    <div className="space-y-2">
      <details open={open} className="rounded-xl bg-sky-50 p-3 dark:bg-sky-950">
        <summary className="cursor-pointer font-bold text-sky-800 dark:text-sky-200">✏️ Diketahui</summary>
        <ul className="mt-1 list-disc pl-5">{q.story.known.map((k) => <li key={k}>{k}</li>)}</ul>
      </details>
      <details open={open} className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950">
        <summary className="cursor-pointer font-bold text-amber-800 dark:text-amber-200">❓ Ditanya</summary>
        <p className="mt-1">{q.story.asked}</p>
      </details>
    </div>
  );
}

export default function QuestionView({ question: q, onNext, onAttempt }: Props) {
  const [choice, setChoice] = useState<string>('');
  const [multi, setMulti] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GradeResult | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [revealed, setRevealed] = useState(q.level === 'example' ? 1 : 0);
  const [showSimilar, setShowSimilar] = useState(false);
  // Story problems: sort the information first (not for worked examples).
  const needsSorting = Boolean(q.story?.facts?.length) && q.level !== 'example';
  const [sorted, setSorted] = useState(false);
  const ready = !needsSorting || sorted;

  const isExample = q.level === 'example';
  const solved = result?.status === 'correct';
  const gaveUp = wrongCount >= 2 && !solved;
  const finished = solved || gaveUp;
  const similar = QUESTIONS.find((x) => x.shape === q.shape && x.level === 'example' && x.id !== q.id);
  // Completion problems show every step except the last one.
  const givenSteps = q.level === 'completion' ? q.solutionSteps.slice(0, -1) : [];

  const check = () => {
    const r = grade(q, q.type === 'numeric' ? input : q.type === 'multi-select' ? multi : choice);
    setResult(r);
    if (r.status === 'invalid') return;
    onAttempt?.(r);
    if (r.status === 'wrong') setWrongCount((c) => c + 1);
  };

  const retry = () => setResult(null);

  const next = () => onNext({ score: isExample ? null : solved ? (wrongCount === 0 ? 1 : 0.5) : 0 });

  const locked = finished || result?.status === 'wrong';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
        {isExample && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">Contoh soal</span>}
        {q.level === 'completion' && <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-800 dark:bg-sky-900 dark:text-sky-100">Lengkapi</span>}
        {q.level === 'independent' && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Mandiri</span>}
      </div>

      <div className="flex items-start gap-2">
        <p className="flex-1 text-lg font-semibold leading-snug">{q.stem}</p>
        <SpeakButton text={q.stem} />
      </div>

      {q.figure && (
        <div className="card p-2">
          <ShapeFigure {...q.figure} ariaLabel="Gambar soal" />
        </div>
      )}

      {needsSorting && !sorted && <InfoSorter id={q.id} story={q.story!} onDone={() => setSorted(true)} />}
      {ready && <StoryBlocks q={q} open={q.level !== 'independent' || needsSorting} />}

      {/* Worked example: reveal steps one by one */}
      {isExample && (
        <div className="space-y-3">
          <Steps steps={q.solutionSteps.slice(0, revealed)} label="Langkah penyelesaian" />
          {revealed < q.solutionSteps.length ? (
            <button type="button" className="btn-secondary w-full" onClick={() => setRevealed((r) => r + 1)}>
              Tampilkan langkah {revealed + 1} ▸
            </button>
          ) : (
            <>
              <p className="rounded-xl bg-emerald-50 p-3 font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">Jawaban: {answerText(q)}</p>
              <button type="button" className="btn-primary w-full" onClick={next}>
                Saya paham, lanjut →
              </button>
            </>
          )}
        </div>
      )}

      {!isExample && ready && (
        <>
          {givenSteps.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Langkah yang sudah dikerjakan:</p>
              <Steps steps={givenSteps} label="Langkah yang sudah dikerjakan" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Sekarang giliranmu menyelesaikan langkah terakhir:</p>
            </div>
          )}

          {/* Answer input */}
          {q.type === 'numeric' && (
            <label className="flex items-center gap-3">
              <span className="font-semibold">Jawaban:</span>
              <input
                inputMode="decimal"
                autoComplete="off"
                value={input}
                disabled={locked}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !locked && check()}
                className="min-h-[48px] w-36 rounded-xl border border-slate-300 bg-white px-3 text-lg font-bold focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
                aria-label="Jawaban angka"
              />
              {q.unit && <span className="text-lg font-semibold">{q.unit}</span>}
            </label>
          )}

          {(q.type === 'multiple-choice' || q.type === 'multi-select') && (
            <fieldset className="space-y-2">
              <legend className="sr-only">Pilihan jawaban</legend>
              {q.type === 'multi-select' && <p className="text-sm text-slate-500 dark:text-slate-400">Boleh pilih lebih dari satu.</p>}
              {q.options.map((o) => {
                const selected = q.type === 'multi-select' ? multi.includes(o.id) : choice === o.id;
                const isAnswer = q.type === 'multi-select' ? q.answer.includes(o.id) : q.answer === o.id;
                const reveal = finished;
                return (
                  <label
                    key={o.id}
                    className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ring-1 transition-colors ${
                      reveal && isAnswer
                        ? 'bg-emerald-50 ring-emerald-500 dark:bg-emerald-950'
                        : selected
                          ? 'bg-brand-50 ring-brand-500 dark:bg-slate-800'
                          : 'bg-white ring-slate-300 dark:bg-slate-900 dark:ring-slate-700'
                    }`}
                  >
                    <input
                      type={q.type === 'multi-select' ? 'checkbox' : 'radio'}
                      name={q.id}
                      className="h-5 w-5 accent-brand-600"
                      checked={selected}
                      disabled={locked}
                      onChange={() =>
                        q.type === 'multi-select'
                          ? setMulti((m) => (m.includes(o.id) ? m.filter((x) => x !== o.id) : [...m, o.id]))
                          : setChoice(o.id)
                      }
                    />
                    <span className="font-medium">{o.text}</span>
                    {reveal && isAnswer && <span className="ml-auto" aria-label="jawaban benar">✓</span>}
                  </label>
                );
              })}
            </fieldset>
          )}

          {/* Feedback */}
          {result && (
            <div
              key={`${result.status}-${wrongCount}`}
              role="status"
              className={`relative rounded-xl p-3 ${result.status === 'correct' ? 'animate-pop' : 'animate-fade-up'} ${
                result.status === 'correct'
                  ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100'
                  : result.status === 'wrong'
                    ? 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100'
                    : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {result.status === 'correct' && <Celebrate />}
              <div className="flex items-start gap-3">
                {result.status !== 'invalid' && (
                  <Mascot
                    kind={result.status === 'correct' ? 'bear' : 'bunny'}
                    mood={result.status === 'correct' ? 'happy' : 'think'}
                    className="h-14 w-12 shrink-0"
                  />
                )}
                <div>
                  <p className="font-bold">{result.status === 'correct' ? '🎉 Betul!' : result.status === 'wrong' ? 'Hmm, belum tepat' : 'ℹ️'}</p>
                  {/* Skip the plain "Betul!" so the heading isn't repeated. */}
                  {result.feedback !== 'Betul!' && <p>{result.feedback}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Hints (concept → formula → first step) */}
          {!finished && hintsShown > 0 && (
            <div className="space-y-1 rounded-xl bg-yellow-50 p-3 dark:bg-yellow-950">
              {q.hints.slice(0, hintsShown).map((h, i) => (
                <p key={i}>
                  <span className="font-bold">💡 Petunjuk {i + 1}:</span> {h}
                </p>
              ))}
            </div>
          )}

          {/* Solution after finishing */}
          {finished && (
            <div className="space-y-2">
              <p className="font-bold">Pembahasan</p>
              <Steps steps={q.solutionSteps} label="Pembahasan" />
            </div>
          )}

          {showSimilar && similar && (
            <div className="space-y-2 rounded-xl border border-dashed border-slate-300 p-3 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Contoh serupa</p>
              <p className="font-semibold">{similar.stem}</p>
              <Steps steps={similar.solutionSteps} label="Pembahasan contoh serupa" />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {!finished && result?.status !== 'wrong' && (
              <>
                <button type="button" className="btn-primary flex-1" onClick={check}>
                  Periksa
                </button>
                <button type="button" className="btn-secondary" disabled={hintsShown >= 3} onClick={() => setHintsShown((h) => h + 1)}>
                  💡 Petunjuk {hintsShown}/3
                </button>
              </>
            )}
            {!finished && result?.status === 'wrong' && (
              <>
                <button type="button" className="btn-primary flex-1" onClick={retry}>
                  Coba lagi
                </button>
                <button type="button" className="btn-secondary" onClick={() => setWrongCount(2)}>
                  Lihat pembahasan
                </button>
              </>
            )}
            {!finished && similar && (
              <button type="button" className="btn-ghost" onClick={() => setShowSimilar((s) => !s)}>
                📒 {showSimilar ? 'Tutup contoh' : 'Lihat contoh serupa'}
              </button>
            )}
            {finished && (
              <button type="button" className="btn-primary w-full" onClick={next}>
                Lanjut →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
