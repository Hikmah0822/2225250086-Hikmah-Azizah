/**
 * One stage (Tahap) of a Mathematical Literacy problem.
 * - All fields are checked together; correct fields lock.
 * - One correction round for the wrong fields (half credit), then the answer key is shown.
 */
import { useState } from 'react';
import type { LiteracyStage, MisconceptionId, StageField } from '../../types';
import type { GradeResult } from '../../lib/quiz/grade';
import { fieldCredit, gradeField, stageScore } from '../../lib/quiz/literacy';
import { formatNumber } from '../../lib/format';
import Celebrate from '../ui/Celebrate';
import Mascot from '../ui/Mascot';

interface FieldState {
  result: GradeResult;
  correctOnTry: 1 | 2 | null;
}

interface Props {
  stage: LiteracyStage;
  totalStages: number;
  onDone: (score: number) => void;
  onMistake?: (misconception: MisconceptionId | undefined) => void;
}

const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

function correctText(f: StageField): string {
  if (f.kind === 'choice') return f.options.find((o) => o.id === f.answer)?.text ?? '';
  if (f.prefix === 'Rp') return rupiah(f.answer);
  return `${f.answer >= 1000 ? f.answer.toLocaleString('id-ID') : formatNumber(f.answer, 2)}${f.unit ? ` ${f.unit}` : ''}`;
}

export default function LiteracyStageView({ stage, totalStages, onDone, onMistake }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [states, setStates] = useState<Record<string, FieldState>>({});
  const [round, setRound] = useState<1 | 2>(1);
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const isLocked = (id: string) => finished || states[id]?.correctOnTry != null;

  const check = () => {
    const open = stage.fields.filter((f) => !isLocked(f.id));
    if (open.some((f) => !values[f.id]?.trim())) {
      setMessage('Isi semua jawaban pada tahap ini dulu.');
      return;
    }
    const graded = open.map((f) => ({ f, r: gradeField(f, values[f.id]) }));
    const invalid = graded.find((g) => g.r.status === 'invalid');
    if (invalid) {
      setStates((s) => ({ ...s, [invalid.f.id]: { result: invalid.r, correctOnTry: null } }));
      setMessage(invalid.r.feedback);
      return;
    }
    setMessage(null);
    const next = { ...states };
    for (const { f, r } of graded) {
      next[f.id] = { result: r, correctOnTry: r.status === 'correct' ? round : null };
      if (r.status === 'wrong') onMistake?.(r.misconception);
    }
    setStates(next);
    const allCorrect = stage.fields.every((f) => next[f.id]?.correctOnTry != null);
    if (allCorrect || round === 2) setFinished(true);
    else setRound(2);
  };

  const credits = stage.fields.map((f) => fieldCredit(states[f.id]?.correctOnTry ?? null));
  const score = stageScore(stage.score, credits);

  return (
    <section className="card animate-slide-in space-y-4" aria-label={`Tahap ${stage.tahap}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-100">
            Tahap {stage.tahap} dari {totalStages}
          </p>
          <h3 className="text-lg font-extrabold">{stage.title}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold dark:bg-slate-800">Skor {stage.score}</span>
      </div>

      {stage.fields.map((f) => {
        const st = states[f.id];
        const locked = isLocked(f.id);
        const correct = st?.correctOnTry != null;
        return (
          <div key={f.id} className="space-y-2">
            <p className="font-semibold">{f.label}</p>
            {f.kind === 'numeric' ? (
              <label className="flex items-center gap-2">
                {f.prefix && <span className="font-semibold">{f.prefix}</span>}
                <input
                  inputMode="decimal"
                  autoComplete="off"
                  value={values[f.id] ?? ''}
                  disabled={locked}
                  onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && !finished && check()}
                  aria-label={f.label}
                  className={`min-h-[48px] w-44 rounded-xl border bg-white px-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-80 dark:bg-slate-900 ${
                    correct ? 'border-emerald-500' : st?.result.status === 'wrong' ? 'border-amber-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {f.unit && <span className="font-semibold">{f.unit}</span>}
                {correct && <span aria-label="benar" className="text-emerald-600">✓</span>}
              </label>
            ) : (
              <fieldset className="space-y-2">
                <legend className="sr-only">{f.label}</legend>
                {f.options.map((o) => {
                  const selected = values[f.id] === o.id;
                  const reveal = finished && o.id === f.answer;
                  return (
                    <label
                      key={o.id}
                      className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ring-1 ${
                        reveal || (selected && correct)
                          ? 'bg-emerald-50 ring-emerald-500 dark:bg-emerald-950'
                          : selected
                            ? 'bg-brand-50 ring-brand-500 dark:bg-slate-800'
                            : 'bg-white ring-slate-300 dark:bg-slate-900 dark:ring-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${stage.tahap}-${f.id}`}
                        className="h-5 w-5 shrink-0 accent-brand-600"
                        checked={selected}
                        disabled={locked}
                        onChange={() => setValues((v) => ({ ...v, [f.id]: o.id }))}
                      />
                      <span>{o.text}</span>
                    </label>
                  );
                })}
              </fieldset>
            )}
            {st && st.result.status !== 'correct' && (
              <p role="status" className="rounded-lg bg-amber-50 p-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                {st.result.feedback}
                {finished && <> <b>Jawaban: {correctText(f)}</b></>}
              </p>
            )}
          </div>
        );
      })}

      {message && <p className="rounded-lg bg-slate-100 p-2 text-sm dark:bg-slate-800">{message}</p>}

      {!finished && showHint && (
        <p className="rounded-xl bg-yellow-50 p-3 dark:bg-yellow-950">
          <b>💡 Petunjuk:</b> {stage.hint}
        </p>
      )}

      {!finished ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary flex-1" onClick={check}>
            {round === 1 ? 'Periksa' : 'Periksa lagi'}
          </button>
          <button type="button" className="btn-secondary" disabled={showHint} onClick={() => setShowHint(true)}>
            💡 Petunjuk
          </button>
          {round === 2 && (
            <button type="button" className="btn-ghost w-full" onClick={() => setFinished(true)}>
              Lihat pembahasan
            </button>
          )}
          {round === 2 && <p className="w-full text-sm text-slate-500 dark:text-slate-400">Perbaiki isian yang belum tepat, lalu periksa lagi.</p>}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Pembahasan Tahap {stage.tahap}</p>
            {stage.explanation.map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
          <div className="relative flex animate-pop items-center gap-3">
            {score === stage.score && <Celebrate />}
            <Mascot kind={score === stage.score ? 'bear' : 'cat'} mood={score === stage.score ? 'happy' : 'normal'} className="h-14 w-12 shrink-0" />
            <p className="font-bold">
              {score === stage.score ? '🎉 Hebat! ' : 'Ayo, terus semangat! '}Skor tahap ini: {formatNumber(score, 1)} dari {stage.score}
            </p>
          </div>
          <button type="button" className="btn-primary w-full" onClick={() => onDone(score)}>
            {stage.tahap === totalStages ? 'Lihat hasil →' : 'Lanjut ke tahap berikutnya →'}
          </button>
        </div>
      )}
    </section>
  );
}
