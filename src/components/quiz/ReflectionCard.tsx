/**
 * RMT reflection after an activity (Learning Activity: reflection + self-evaluation).
 * 1. Which thinking actions did you use?  2. How well do you understand?
 * 3. What did you learn, and why is it true (logical evidence)?  4. What is still confusing?
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { COGNITIVE_FUNCTIONS, type CognitiveFunctionId } from '../../content/rmt';
import { JOURNAL_TEXT_MAX, useJournal } from '../../store/journalStore';

const CONFIDENCE = [
  { v: 1, icon: '😟', label: 'Belum paham' },
  { v: 2, icon: '🤔', label: 'Sedikit paham' },
  { v: 3, icon: '🙂', label: 'Paham' },
  { v: 4, icon: '😄', label: 'Sangat paham' },
] as const;

export default function ReflectionCard({ activity, score, suggested }: { activity: string; score: number | null; suggested: CognitiveFunctionId[] }) {
  const add = useJournal((s) => s.add);
  const [functions, setFunctions] = useState<CognitiveFunctionId[]>([]);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | null>(null);
  const [learned, setLearned] = useState('');
  const [confusing, setConfusing] = useState('');
  const [saved, setSaved] = useState(false);

  const toggle = (id: CognitiveFunctionId) => setFunctions((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const canSave = functions.length > 0 && confidence !== null && learned.trim().length >= 5;

  if (saved) {
    return (
      <div className="card space-y-2 bg-gradient-to-br from-violet-50 to-white text-center dark:from-slate-900">
        <p className="font-bold">📓 Refleksimu sudah disimpan di Jurnal Berpikirku.</p>
        <Link to="/jurnal" className="btn-secondary">
          Buka Jurnal Berpikirku
        </Link>
      </div>
    );
  }

  return (
    <section className="card space-y-4 bg-gradient-to-br from-violet-50 to-white dark:from-slate-900" aria-label="Refleksi">
      <div>
        <h2 className="text-lg font-extrabold">🪞 Refleksi</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Berpikir tentang caramu berpikir. Hanya disimpan di perangkat ini.</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold">1. Fungsi berpikir apa yang kamu pakai?</p>
        <div className="flex flex-wrap gap-1.5">
          {suggested.map((id) => (
            <button key={id} type="button" aria-pressed={functions.includes(id)} onClick={() => toggle(id)} className={`${functions.includes(id) ? 'chip-on' : 'chip-off'} text-sm`}>
              {COGNITIVE_FUNCTIONS[id].icon} {COGNITIVE_FUNCTIONS[id].name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold">2. Seberapa paham kamu sekarang?</p>
        <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Seberapa paham">
          {CONFIDENCE.map((c) => (
            <button
              key={c.v}
              type="button"
              role="radio"
              aria-checked={confidence === c.v}
              onClick={() => setConfidence(c.v)}
              className={`flex min-h-[56px] flex-col items-center justify-center rounded-xl text-xs font-semibold ring-1 ${
                confidence === c.v ? 'bg-violet-600 text-white ring-violet-600' : 'bg-white ring-slate-200 dark:bg-slate-900 dark:ring-slate-700'
              }`}
            >
              <span className="text-xl" aria-hidden>
                {c.icon}
              </span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-bold">3. Apa yang kamu pelajari, dan mengapa itu benar?</span>
        <textarea
          value={learned}
          onChange={(e) => setLearned(e.target.value)}
          maxLength={JOURNAL_TEXT_MAX}
          rows={3}
          placeholder="Contoh: Luas jajargenjang memakai tinggi, karena jika dipotong dan digeser bentuknya menjadi persegi panjang."
          className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-bold">4. Apa yang masih membingungkan? (boleh kosong)</span>
        <textarea
          value={confusing}
          onChange={(e) => setConfusing(e.target.value)}
          maxLength={JOURNAL_TEXT_MAX}
          rows={2}
          className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </label>

      <button
        type="button"
        className="btn-primary w-full"
        disabled={!canSave}
        onClick={() => {
          add({ activity, score, functions, confidence: confidence!, learned, confusing });
          setSaved(true);
        }}
      >
        Simpan ke Jurnal Berpikirku
      </button>
      {!canSave && <p className="text-center text-xs text-slate-500">Pilih fungsi berpikir, tingkat pahammu, dan tulis apa yang kamu pelajari.</p>}
    </section>
  );
}
