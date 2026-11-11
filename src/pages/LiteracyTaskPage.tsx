/** One Mathematical Literacy problem, worked stage by stage (Tahap 1 → n). */
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Page, ProgressBar } from '../components/ui/Layout';
import ShapeFigure from '../components/geometry/ShapeFigure';
import LiteracyStageView from '../components/quiz/LiteracyStageView';
import { INDICATOR_LABELS, LITERACY_TASKS } from '../content/literacy';
import { useProgress } from '../store/progressStore';
import Mascot from '../components/ui/Mascot';
import SpeakButton from '../components/ui/SpeakButton';
import { firstName, useProfile } from '../store/profileStore';
import { formatNumber } from '../lib/format';

/** Remount per problem so moving to "Soal berikutnya" starts fresh. */
export default function LiteracyTaskRoute() {
  const { id } = useParams();
  return <LiteracyTaskPage key={id} id={id} />;
}

function LiteracyTaskPage({ id }: { id: string | undefined }) {
  const task = LITERACY_TASKS.find((t) => t.id === id);
  const [scores, setScores] = useState<number[]>([]);
  const [attempt, setAttempt] = useState(0);
  const finishLiteracy = useProgress((s) => s.finishLiteracy);
  const first = useProfile((s) => firstName(s.name));
  const recordAttempt = useProgress((s) => s.recordAttempt);

  if (!task) return <Navigate to="/literasi" replace />;

  const stageIndex = scores.length;
  const done = stageIndex >= task.stages.length;
  const max = task.stages.reduce((s, st) => s + st.score, 0);
  const total = scores.reduce((a, b) => a + b, 0);
  const next = LITERACY_TASKS.find((t) => t.no === task.no + 1);

  const onStageDone = (score: number) => {
    const all = [...scores, score];
    setScores(all);
    if (all.length === task.stages.length) finishLiteracy(task.id, all);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Page title={`${task.no}. ${task.title}`} back="/literasi">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-100">
        {INDICATOR_LABELS[task.indicator].name} · {INDICATOR_LABELS[task.indicator].english}
      </p>
      <div className="mb-4">
        <ProgressBar value={Math.round((stageIndex / task.stages.length) * 100)} label="Kemajuan tahap" />
      </div>

      {/* The problem stays visible so students don't have to remember it (split attention). */}
      <details open={!done} className="card mb-4">
        <summary className="cursor-pointer font-bold">📖 Soal</summary>
        <div className="mt-2 space-y-3">
          {task.figure && <ShapeFigure {...task.figure} ariaLabel={`Gambar ${task.title}`} />}
          <SpeakButton text={`${task.story} ${task.question}`} label="Bacakan soal" />
          <p className="whitespace-pre-line leading-relaxed">{task.story}</p>
          <p className="font-bold">{task.question}</p>
        </div>
      </details>

      {scores.length > 0 && (
        <ol className="mb-4 space-y-1">
          {scores.map((s, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
              <span>
                <b>Tahap {task.stages[i].tahap}</b> · {task.stages[i].title}
              </span>
              <span className={`font-bold ${s === task.stages[i].score ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                {formatNumber(s, 1)}/{task.stages[i].score}
              </span>
            </li>
          ))}
        </ol>
      )}

      {!done ? (
        <LiteracyStageView
          key={`${attempt}-${stageIndex}`}
          stage={task.stages[stageIndex]}
          totalStages={task.stages.length}
          onDone={onStageDone}
          onMistake={(m) => recordAttempt({ questionId: `${task.id}-T${task.stages[stageIndex].tahap}`, correct: false, misconception: m })}
        />
      ) : (
        <div className="space-y-4">
          <div className="card space-y-2 text-center">
            <div className="mx-auto w-28 animate-pop">
            <Mascot kind={total >= max * 0.8 ? 'bear' : total >= max * 0.5 ? 'cat' : 'bunny'} mood={total >= max * 0.5 ? 'happy' : 'normal'} className="w-full" />
          </div>
            <p className="text-2xl font-extrabold">
              {total >= max * 0.8 ? `Hebat, ${first}!` : `Ayo semangat, ${first}!`}
            </p>
            <p className="text-xl font-bold">
              Skor: {formatNumber(total, 1)} / {max}
            </p>
            <p className="rounded-xl bg-emerald-50 p-3 text-left font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
              Kesimpulan: {task.conclusion}
            </p>
          </div>
          <div className="grid gap-2">
            {next && (
              <Link to={`/literasi/${next.id}`} className="btn-primary">
                Soal {next.no}: {next.title} →
              </Link>
            )}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setScores([]);
                setAttempt((a) => a + 1);
              }}
            >
              ↺ Kerjakan ulang
            </button>
            <Link to="/literasi" className="btn-ghost">
              Daftar soal literasi
            </Link>
          </div>
        </div>
      )}
    </Page>
  );
}
