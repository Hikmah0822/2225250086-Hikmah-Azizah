/** Side-by-side comparison with differences highlighted (F03; IL01, K03). */
import { useState } from 'react';
import { Page } from '../components/ui/Layout';
import ShapeFigure from '../components/geometry/ShapeFigure';
import { SHAPES, SHAPE_ORDER } from '../content/shapes';
import { ASPECT_LABELS, PROPERTY_ROWS } from '../content/properties';
import type { Layer, PropertyCell, ShapeId } from '../types';
import type { Quad } from '../lib/geometry/vector';

const SUGGESTED: [ShapeId, ShapeId][] = [
  ['rhombus', 'kite'],
  ['rhombus', 'parallelogram'],
  ['rectangle', 'parallelogram'],
  ['square', 'rhombus'],
];

const cell = (v: PropertyCell) => (v === true ? '✓' : v === false ? '✗' : v);

function Side({ shape, layers }: { shape: ShapeId; layers: Layer[] }) {
  const [quad, setQuad] = useState<Quad | undefined>();
  return (
    <div className="card p-1">
      <ShapeFigure shape={SHAPES[shape].labShape} quad={quad} onChange={setQuad} layers={layers} ariaLabel={SHAPES[shape].name} />
    </div>
  );
}

export default function ComparePage() {
  const [a, setA] = useState<ShapeId>('rhombus');
  const [b, setB] = useState<ShapeId>('kite');
  const [showAll, setShowAll] = useState(false);
  const [layers, setLayers] = useState<Layer[]>(['diagonals']);

  const rows = PROPERTY_ROWS.filter((r) => showAll || r.values[a] !== r.values[b]);

  const select = (value: ShapeId, set: (s: ShapeId) => void, label: string) => (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => set(e.target.value as ShapeId)}
      className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-2 font-semibold dark:border-slate-700 dark:bg-slate-900"
    >
      {SHAPE_ORDER.map((s) => (
        <option key={s} value={s}>{SHAPES[s].name}</option>
      ))}
    </select>
  );

  return (
    <Page title="Bandingkan" back="/">
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {SUGGESTED.map(([x, y]) => (
          <button key={`${x}-${y}`} type="button" className={x === a && y === b ? 'chip-on shrink-0' : 'chip-off shrink-0'} onClick={() => { setA(x); setB(y); }}>
            {SHAPES[x].name} vs {SHAPES[y].name}
          </button>
        ))}
      </div>

      <div className="mb-2 grid grid-cols-2 gap-2">
        {select(a, setA, 'Bangun pertama')}
        {select(b, setB, 'Bangun kedua')}
        <Side key={`a-${a}`} shape={a} layers={layers} />
        <Side key={`b-${b}`} shape={b} layers={layers} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['sides', 'angles', 'diagonals', 'symmetry'] as Layer[]).map((l) => (
          <button key={l} type="button" aria-pressed={layers.includes(l)} className={layers.includes(l) ? 'chip-on' : 'chip-off'} onClick={() => setLayers((ls) => (ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l]))}>
            {{ sides: 'Sisi', angles: 'Sudut', diagonals: 'Diagonal', symmetry: 'Simetri' }[l]}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="p-2">{showAll ? 'Semua sifat' : 'Perbedaan'}</th>
              <th className="w-24 p-2 text-center">{SHAPES[a].name}</th>
              <th className="w-24 p-2 text-center">{SHAPES[b].name}</th>
            </tr>
          </thead>
          <tbody>
            {a === b && <tr><td colSpan={3} className="p-3 text-slate-500">Pilih dua bangun yang berbeda.</td></tr>}
            {rows.map((r) => {
              const differ = r.values[a] !== r.values[b];
              return (
                <tr key={r.id} className={`border-t border-slate-200 dark:border-slate-800 ${differ ? 'bg-amber-50 dark:bg-amber-950/60' : ''}`}>
                  <td className="p-2">
                    {differ && <span className="mr-1 font-bold text-amber-700 dark:text-amber-300" aria-label="berbeda">≠</span>}
                    <span className="text-xs text-slate-500">{ASPECT_LABELS[r.aspect]} · </span>
                    {r.label}
                  </td>
                  <td className="p-2 text-center font-bold">{cell(r.values[a])}</td>
                  <td className="p-2 text-center font-bold">{cell(r.values[b])}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn-ghost mt-2 w-full" onClick={() => setShowAll((s) => !s)}>
        {showAll ? 'Tampilkan perbedaan saja' : 'Tampilkan semua sifat'}
      </button>
    </Page>
  );
}
