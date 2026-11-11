/**
 * Practice session with fading and a summary (F07, F09).
 * - After a student needed the solution, a twin question (same structure, new numbers) follows.
 * - id "ulang" = Latihan Ulang Pintar: a set built from the student's own mistakes.
 */
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Page, ProgressBar } from '../components/ui/Layout';
import QuestionView, { type QuestionOutcome } from '../components/quiz/QuestionView';
import { QUESTIONS, questionsFor } from '../content/questions';
import { SHAPES } from '../content/shapes';
import { MISCONCEPTION_LABELS } from '../lib/quiz/grade';
import { makeTwin } from '../lib/quiz/twins';
import { buildReviewSet } from '../lib/quiz/review';
import { useProgress } from '../store/progressStore';
import Mascot from '../components/ui/Mascot';
import { firstName, useProfile } from '../store/profileStore';
import type { Level, MisconceptionId, Question, ShapeId } from '../types';

const LEVEL_ORDER: Record<Level, number> = { example: 0, completion: 1, independent: 2 };

/** Remount per practice set so switching sets starts fresh. */
export default function PracticeRoute() {
  const { id = '' } = useParams();
  return <PracticePage key={id} id={id} />;
}

function PracticePage({ id }: { id: string }) {
  const isMixed = id === 'campuran';
  const isReview = id === 'ulang';
  const shape = isMixed ? 'mixed' : (id as ShapeId);
  const attempts = useProgress((s) => s.attempts);
  const [seed] = useState(() => Math.floor(Math.random() * 100000));
  // Built once when the page opens, so the set does not change while the student answers.
  const [initial] = useState(() =>
    isReview
      ? buildReviewSet(QUESTIONS, attempts, seed)
      : { questions: [...questionsFor(shape)].sort((x, y) => LEVEL_ORDER[x.level] - LEVEL_ORDER[y.level]), focus: [] as MisconceptionId[] },
  );
  const [questions, setQuestions] = useState<Question[]>(initial.questions);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState<MisconceptionId[]>([]);
  const [finished, setFinished] = useState(false);
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const finishPractice = useProgress((s) => s.finishPractice);
  const first = useProfile((s) => firstName(s.name));

  if (!isMixed && !isReview && !(id in SHAPES)) return <Navigate to="/" replace />;
  const title = isReview ? 'Latihan Ulang Pintar' : isMixed ? 'Latihan Campuran' : `Latihan ${SHAPES[id as ShapeId].name}`;
  const backTo = isReview ? '/progres' : isMixed ? '/' : `/bangun/${id}`;

  if (isReview && questions.length === 0) {
    return (
      <Page title={title} back={backTo}>
        <div className="card space-y-3 text-center">
          <Mascot kind="bear" mood="happy" className="mx-auto w-28" />
          <p className="text-lg font-bold">Belum ada yang perlu diulang, {first}! 🎉</p>
          <p className="text-slate-600 dark:text-slate-300">Kerjakan latihan dulu. Jika ada jawaban yang keliru, latihan khusus untukmu akan muncul di sini.</p>
          <Link to="/" className="btn-primary">
            Ke Beranda
          </Link>
        </div>
      </Page>
    );
  }

  const q = questions[index];
  const isTwin = q.id.startsWith('TW-');

  const finish = (all: number[]) => {
    const pct = all.length ? Math.round((all.reduce((s, v) => s + v, 0) / all.length) * 100) : 0;
    if (!isReview) finishPractice(shape, pct);
    setFinished(true);
  };

  const onNext = ({ score }: QuestionOutcome) => {
    const all = score === null ? scores : [...scores, score];
    setScores(all);
    if (score !== null) setStreak((s) => (score === 1 ? s + 1 : 0));
    // Needed help? Practise once more with a twin question right away (consolidation).
    let list = questions;
    if (score !== null && score < 1 && !isTwin) {
      const twin = makeTwin(q, seed + index);
      if (twin) {
        list = [...questions.slice(0, index + 1), twin, ...questions.slice(index + 1)];
        setQuestions(list);
      }
    }
    if (index + 1 >= list.length) finish(all);
    else setIndex(index + 1);
  };

  if (finished) {
    const pct = scores.length ? Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 100) : 0;
    const unique = [...new Set(mistakes)];
    return (
      <Page title={title} back={backTo}>
        <div className="card space-y-4 text-center">
          <div className="mx-auto w-28 animate-pop">
            <Mascot kind={pct >= 80 ? 'bear' : pct >= 50 ? 'cat' : 'bunny'} mood={pct >= 50 ? 'happy' : 'normal'} className="w-full" />
          </div>
          <p className="text-2xl font-extrabold">Skor kamu: {pct}</p>
          <p className="text-slate-600 dark:text-slate-300">
            {pct >= 80 ? `Hebat, ${first}! Kamu sudah menguasai bagian ini.` : pct >= 50 ? `Bagus, ${first}! Ulangi bagian yang masih keliru.` : `Tidak apa-apa, ${first}. Coba buka lagi Materi dan Lab, lalu ulangi latihannya.`}
          </p>
        </div>
        {unique.length > 0 && (
          <div className="card mt-4">
            <p className="mb-2 font-bold">Perlu diperhatikan:</p>
            <ul className="list-disc space-y-1 pl-5">{unique.map((m) => <li key={m}>{MISCONCEPTION_LABELS[m]}</li>)}</ul>
          </div>
        )}
        <div className="mt-4 grid gap-2">
          {unique.length > 0 && !isReview && (
            <Link to="/latihan/ulang" className="btn-primary">
              🔁 Latihan Ulang Pintar
            </Link>
          )}
          {isReview && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                // Rebuild from the latest attempts (including the ones just made).
                const fresh = buildReviewSet(QUESTIONS, useProgress.getState().attempts, seed + 1000 + scores.length);
                setQuestions(fresh.questions);
                setIndex(0);
                setScores([]);
                setMistakes([]);
                setFinished(false);
              }}
            >
              🔁 Buat latihan ulang baru
            </button>
          )}
          {!isReview && (
            <button
              type="button"
              className={unique.length > 0 ? 'btn-secondary' : 'btn-primary'}
              onClick={() => {
                setQuestions(initial.questions);
                setIndex(0);
                setScores([]);
                setStreak(0);
                setMistakes([]);
                setFinished(false);
              }}
            >
              ↺ Ulangi latihan
            </button>
          )}
          <Link to={isMixed || isReview ? '/catatan' : `/catatan?bangun=${id}`} className="btn-secondary">
            📒 Buka Catatanku
          </Link>
          <Link to="/" className="btn-ghost">
            Kembali ke Beranda
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <Page title={title} back={backTo} right={<span className="text-sm font-bold text-slate-500">{index + 1} / {questions.length}</span>}>
      <div className="mb-4">
        <ProgressBar value={Math.round((index / questions.length) * 100)} label="Kemajuan latihan" />
      </div>

      {isReview && index === 0 && initial.focus.length > 0 && (
        <div className="card mb-4 flex items-center gap-3 bg-gradient-to-r from-amber-50 to-white dark:from-slate-900">
          <Mascot kind="cat" mood="normal" className="h-14 w-12 shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Latihan ini dibuat dari kesalahanmu sebelumnya.</p>
            <p className="text-slate-600 dark:text-slate-300">Fokus: {initial.focus.map((m) => MISCONCEPTION_LABELS[m]).join(' · ')}</p>
          </div>
        </div>
      )}

      {isTwin && (
        <p className="mb-3 animate-pop rounded-xl bg-violet-50 p-3 text-sm font-semibold text-violet-900 dark:bg-violet-950 dark:text-violet-100">
          👯 Soal kembar: angkanya berbeda, caranya sama. Coba terapkan langkah dari pembahasan tadi!
        </p>
      )}

      {streak >= 3 && index < questions.length - 1 && !isReview && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950">
          <p className="text-sm font-semibold">3 benar berturut-turut! Kamu boleh menyelesaikan sekarang.</p>
          <button type="button" className="btn-secondary shrink-0" onClick={() => finish(scores)}>
            Selesai
          </button>
        </div>
      )}

      <QuestionView
        key={q.id}
        question={q}
        onNext={onNext}
        onAttempt={(r) => {
          recordAttempt({ questionId: q.id, correct: r.status === 'correct', misconception: r.misconception });
          if (r.misconception) setMistakes((m) => [...m, r.misconception!]);
        }}
      />
    </Page>
  );
}
