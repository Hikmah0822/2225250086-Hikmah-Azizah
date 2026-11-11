/** "Catatanku" — compact summary like a tidy notebook (F08; DS03, GL05). */
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Page } from '../components/ui/Layout';
import ShapeFigure from '../components/geometry/ShapeFigure';
import InteractiveFormula from '../components/formula/InteractiveFormula';
import { SHAPES, SHAPE_ORDER } from '../content/shapes';
import { ASPECT_LABELS, PROPERTY_ROWS } from '../content/properties';
import type { HighlightKey, PropertyCell, PropertyRow, ShapeId } from '../types';

const cell = (v: PropertyCell) => (v === true ? '✓' : v === false ? '–' : v);

function ShapeNote({ id }: { id: ShapeId }) {
  const info = SHAPES[id];
  const [active, setActive] = useState<HighlightKey | null>(null);
  return (
    <article className="card space-y-3">
      <div className="grid grid-cols-[7rem_1fr] items-start gap-3">
        <ShapeFigure shape={info.labShape} highlight={active ? [active] : []} hideLabels={false} ariaLabel={info.name} />
        <ul className="space-y-1 text-sm">
          {info.keyPoints.map((k) => (
            <li key={k} className="flex gap-1.5"><span className="text-brand-600" aria-hidden>•</span>{k}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-1 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
        <InteractiveFormula formula={info.perimeter} active={active} onSelect={setActive} />
        <InteractiveFormula formula={info.area} active={active} onSelect={setActive} />
      </div>
    </article>
  );
}

export default function SummaryPage() {
  const [params, setParams] = useSearchParams();
  const selected = params.get('bangun') as ShapeId | null;
  const tab = params.get('tab') === 'tabel' ? 'tabel' : 'bangun';
  const [aspect, setAspect] = useState<PropertyRow['aspect']>('diagonal');
  const current: ShapeId = selected && selected in SHAPES ? selected : 'rectangle';

  return (
    <Page title="Catatanku">
      <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-slate-200 p-1 dark:bg-slate-800" role="tablist">
        {(['bangun', 'tabel'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            type="button"
            className={`min-h-[40px] rounded-lg font-semibold ${tab === t ? 'bg-white shadow dark:bg-slate-950' : ''}`}
            onClick={() => setParams(t === 'tabel' ? { tab: 'tabel' } : { bangun: current }, { replace: true })}
          >
            {t === 'bangun' ? 'Per bangun' : 'Tabel sifat'}
          </button>
        ))}
      </div>

      {tab === 'bangun' ? (
        <>
          <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
            {SHAPE_ORDER.map((s) => (
              <button key={s} type="button" className={`${s === current ? 'chip-on' : 'chip-off'} shrink-0`} onClick={() => setParams({ bangun: s }, { replace: true })}>
                {SHAPES[s].name}
              </button>
            ))}
          </div>
          <ShapeNote key={current} id={current} />
        </>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            {(Object.keys(ASPECT_LABELS) as PropertyRow['aspect'][]).map((a) => (
              <button key={a} type="button" className={a === aspect ? 'chip-on' : 'chip-off'} onClick={() => setAspect(a)}>
                {ASPECT_LABELS[a]}
              </button>
            ))}
          </div>
          <div className="card overflow-x-auto p-0">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-2">Sifat</th>
                  {SHAPE_ORDER.map((s) => <th key={s} className="p-2 text-center text-xs">{SHAPES[s].name}</th>)}
                </tr>
              </thead>
              <tbody>
                {PROPERTY_ROWS.filter((r) => r.aspect === aspect).map((r) => (
                  <tr key={r.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="p-2">{r.label}</td>
                    {SHAPE_ORDER.map((s) => (
                      <td key={s} className={`p-2 text-center font-bold ${r.values[s] === true ? 'text-emerald-600 dark:text-emerald-400' : r.values[s] === false ? 'text-slate-400' : 'text-xs text-slate-700 dark:text-slate-200'}`}>
                        {cell(r.values[s])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">✓ = selalu berlaku · – = tidak harus berlaku. Geser tabel ke samping jika terpotong.</p>
        </>
      )}
    </Page>
  );
}
