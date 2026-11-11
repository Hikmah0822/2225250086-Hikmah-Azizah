/** Pretes / postes runner: one item at a time, no feedback, answers locked after sending. */
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Page, ProgressBar } from '../components/ui/Layout';
import ShapeFigure from '../components/geometry/ShapeFigure';
import Mascot from '../components/ui/Mascot';
import { POSTTEST, PRETEST } from '../content/assessment';
import { scoreTest } from '../lib/research';
import { useResearch } from '../store/researchStore';

export default function ResearchTestPage() {
  const { kind } = useParams();
  const navigate = useNavigate();
  const isPre = kind === 'pretes';
  const items = isPre ? PRETEST : POSTTEST;
  const { pre, post, savePre, savePost } = useResearch();
  const [startedAt, setStartedAt] = useState(0);
  const [index, setIndex] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (kind !== 'pretes' && kind !== 'postes') return <Navigate to="/penelitian" replace />;
  if (!isPre && !pre) return <Navigate to="/penelitian" replace />;
  const already = isPre ? pre : post;
  const title = isPre ? 'Pretes' : 'Postes';

  if (already) {
    return (
      <Page title={title} back="/penelitian">
        <div className="card space-y-3 text-center">
          <Mascot kind="bear" mood="happy" className="mx-auto w-24" />
          <p className="text-lg font-bold">{title} sudah dikerjakan. Terima kasih!</p>
          <button type="button" className="btn-primary w-full" onClick={() => navigate('/penelitian')}>
            Kembali ke Mode Penelitian
          </button>
        </div>
      </Page>
    );
  }

  if (index === -1) {
    return (
      <Page title={title} back="/penelitian">
        <div className="card space-y-3">
          <Mascot kind="cat" mood="normal" className="mx-auto w-24" />
          <h2 className="text-center text-xl font-extrabold">Siap mengerjakan {title}?</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Ada {items.length} soal. Kerjakan sendiri tanpa bertanya atau membuka catatan.</li>
            <li>Tidak ada petunjuk dan pembahasan selama tes.</li>
            <li>Kamu bisa kembali ke soal sebelumnya sebelum mengirim.</li>
            <li>Setelah dikirim, jawaban tidak bisa diubah.</li>
          </ul>
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => {
              setStartedAt(Date.now());
              setIndex(0);
            }}
          >
            Mulai {title} →
          </button>
        </div>
      </Page>
    );
  }

  const item = items[index];
  const value = answers[item.id] ?? '';
  const set = (v: string) => setAnswers((a) => ({ ...a, [item.id]: v }));
  const last = index === items.length - 1;
  const unanswered = items.filter((i) => !answers[i.id]?.trim()).length;

  const submit = () => {
    const msg = unanswered > 0 ? `Masih ada ${unanswered} soal yang belum dijawab. Tetap kirim?` : `Kirim jawaban ${title}? Jawaban tidak bisa diubah lagi.`;
    if (!window.confirm(msg)) return;
    const result = scoreTest(items, answers, startedAt, Date.now());
    (isPre ? savePre : savePost)(result);
    navigate('/penelitian', { replace: true });
  };

  return (
    <Page title={`${title} · ${index + 1}/${items.length}`} back="/penelitian">
      <div className="mb-4">
        <ProgressBar value={Math.round(((index + 1) / items.length) * 100)} label="Kemajuan tes" />
      </div>
      <div key={item.id} className="card animate-slide-in space-y-4">
        <p className="text-lg font-semibold leading-snug">
          <span className="mr-2 text-brand-600">{index + 1}.</span>
          {item.stem}
        </p>
        {item.figure && <ShapeFigure {...item.figure} ariaLabel="Gambar soal" />}

        {item.type === 'multiple-choice' ? (
          <fieldset className="space-y-2">
            <legend className="sr-only">Pilihan jawaban</legend>
            {item.options!.map((o) => (
              <label
                key={o.id}
                className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ring-1 ${
                  value === o.id ? 'bg-brand-50 ring-brand-500 dark:bg-slate-800' : 'bg-white ring-slate-300 dark:bg-slate-900 dark:ring-slate-700'
                }`}
              >
                <input type="radio" name={item.id} className="h-5 w-5 shrink-0 accent-brand-600" checked={value === o.id} onChange={() => set(o.id)} />
                <span>
                  <b className="mr-1 uppercase">{o.id}.</b> {o.text}
                </span>
              </label>
            ))}
          </fieldset>
        ) : (
          <label className="flex items-center gap-2">
            <span className="font-semibold">Jawaban:</span>
            {item.prefix && <span className="font-semibold">{item.prefix}</span>}
            <input
              inputMode="decimal"
              autoComplete="off"
              value={value}
              onChange={(e) => set(e.target.value)}
              className="min-h-[48px] w-40 rounded-xl border border-slate-300 bg-white px-3 text-lg font-bold focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
              aria-label="Jawaban angka"
            />
            {item.unit && <span className="font-semibold">{item.unit}</span>}
          </label>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button type="button" className="btn-secondary flex-1" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ← Sebelumnya
        </button>
        {last ? (
          <button type="button" className="btn-primary flex-1" onClick={submit}>
            Kirim ✓
          </button>
        ) : (
          <button type="button" className="btn-primary flex-1" onClick={() => setIndex(index + 1)}>
            Berikutnya →
          </button>
        )}
      </div>
    </Page>
  );
}
