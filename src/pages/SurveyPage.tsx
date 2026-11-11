/** Cognitive load questionnaire (Leppink et al., 2013) + mental effort (Paas, 1992). */
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Page } from '../components/ui/Layout';
import Mascot from '../components/ui/Mascot';
import { CL_ITEMS, CL_SCALE, PAAS_ITEM } from '../content/assessment';
import { useResearch } from '../store/researchStore';

function Scale({ name, min, max, value, onChange, minLabel, maxLabel }: { name: string; min: number; max: number; value?: number; onChange: (v: number) => void; minLabel: string; maxLabel: string }) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div>
      <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={`h-10 w-10 rounded-full text-sm font-bold ring-1 transition active:scale-90 ${
              value === v ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-slate-700 ring-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>
          {min} = {minLabel}
        </span>
        <span>
          {max} = {maxLabel}
        </span>
      </div>
    </div>
  );
}

export default function SurveyPage() {
  const navigate = useNavigate();
  const { post, survey, saveSurvey } = useResearch();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [paas, setPaas] = useState<number | undefined>();
  const [error, setError] = useState(false);

  if (!post) return <Navigate to="/penelitian" replace />;
  if (survey) return <Navigate to="/penelitian" replace />;

  const complete = CL_ITEMS.every((i) => answers[i.id] !== undefined) && paas !== undefined;

  const submit = () => {
    if (!complete) {
      setError(true);
      return;
    }
    saveSurvey({ answers, paas: paas!, at: Date.now() });
    navigate('/penelitian', { replace: true });
  };

  return (
    <Page title="Angket" back="/penelitian">
      <div className="card mb-4 flex items-center gap-3">
        <Mascot kind="bunny" mood="happy" className="h-16 w-14 shrink-0" />
        <p className="text-sm">Tidak ada jawaban benar atau salah. Pilih angka yang paling sesuai dengan yang kamu rasakan saat belajar dengan aplikasi ini.</p>
      </div>

      <ol className="space-y-3">
        {CL_ITEMS.map((item, i) => (
          <li key={item.id} className={`card space-y-2 ${error && answers[item.id] === undefined ? 'ring-2 ring-rose-400' : ''}`}>
            <p className="font-semibold">
              {i + 1}. {item.text}
            </p>
            <Scale name={item.text} min={CL_SCALE.min} max={CL_SCALE.max} value={answers[item.id]} onChange={(v) => setAnswers((a) => ({ ...a, [item.id]: v }))} minLabel={CL_SCALE.minLabel} maxLabel={CL_SCALE.maxLabel} />
          </li>
        ))}
        <li className={`card space-y-2 ${error && paas === undefined ? 'ring-2 ring-rose-400' : ''}`}>
          <p className="font-semibold">
            {CL_ITEMS.length + 1}. {PAAS_ITEM.text}
          </p>
          <Scale name={PAAS_ITEM.text} min={PAAS_ITEM.min} max={PAAS_ITEM.max} value={paas} onChange={setPaas} minLabel={PAAS_ITEM.minLabel} maxLabel={PAAS_ITEM.maxLabel} />
        </li>
      </ol>

      {error && !complete && <p role="alert" className="mt-3 text-sm font-semibold text-rose-600">Masih ada pernyataan yang belum dijawab (ditandai merah).</p>}
      <button type="button" className="btn-primary mt-4 w-full" onClick={submit}>
        Kirim angket ✓
      </button>
    </Page>
  );
}
