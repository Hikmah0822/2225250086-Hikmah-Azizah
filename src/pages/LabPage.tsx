/** Interactive simulation (F02): drag vertices, toggle information layers, guided task. */
import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '../store/progressStore';
import { useSearchParams } from 'react-router-dom';
import { Page } from '../components/ui/Layout';
import ShapeFigure from '../components/geometry/ShapeFigure';
import { SHAPE_MODELS } from '../lib/shapes';
import { computeProperties, supplementaryPartners } from '../lib/geometry/predicates';
import { VERTEX_NAMES, diagonalLengths, interiorAngles } from '../lib/geometry/measure';
import { classifyQuadrilateral } from '../lib/classify';
import { formatNumber, roundPreservingSum } from '../lib/format';
import { LAB_SHAPE_NAMES } from '../content/shapes';
import { LAB_TASKS } from '../content/labTasks';
import type { LabShapeId, Layer } from '../types';
import type { Quad } from '../lib/geometry/vector';

const SHAPE_CHOICES: LabShapeId[] = ['rectangle', 'square', 'parallelogram', 'rhombus', 'kite', 'trapezoid', 'trapezoid-isosceles', 'trapezoid-right', 'free'];
const LAYERS: { id: Layer; label: string }[] = [
  { id: 'sides', label: 'Sisi' },
  { id: 'angles', label: 'Sudut' },
  { id: 'diagonals', label: 'Diagonal' },
  { id: 'symmetry', label: 'Simetri' },
];
const TYPE_NAMES = { square: 'persegi', rectangle: 'persegi panjang', parallelogram: 'jajargenjang', rhombus: 'belah ketupat', kite: 'layang-layang', trapezoid: 'trapesium' } as const;

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span aria-label={ok ? 'berlaku' : 'tidak berlaku'} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${ok ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300'}`}>
        {ok ? '✓' : '✗'}
      </span>
      <span className={ok ? 'font-semibold' : 'text-slate-500 dark:text-slate-400'}>{children}</span>
    </li>
  );
}

function LabTaskPanel({ shape }: { shape: LabShapeId }) {
  const task = LAB_TASKS[shape];
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  if (!task) return null;
  const correct = checked && picked.length === task.answer.length && task.answer.every((a) => picked.includes(a));
  const wrongPicks = task.options.filter((o) => picked.includes(o.id) && !task.answer.includes(o.id));
  return (
    <section className="card space-y-3" aria-label="Tugas eksplorasi">
      <p className="font-bold">💡 Tugas: {task.instruction}</p>
      <p>{task.question} <span className="text-sm text-slate-500">(boleh pilih lebih dari satu)</span></p>
      <div className="space-y-2">
        {task.options.map((o) => (
          <label key={o.id} className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl px-3 ring-1 ring-slate-300 dark:ring-slate-700">
            <input
              type="checkbox"
              className="h-5 w-5 accent-brand-600"
              checked={picked.includes(o.id)}
              onChange={() => {
                setChecked(false);
                setPicked((p) => (p.includes(o.id) ? p.filter((x) => x !== o.id) : [...p, o.id]));
              }}
            />
            {o.text}
          </label>
        ))}
      </div>
      <button type="button" className="btn-primary w-full" disabled={picked.length === 0} onClick={() => setChecked(true)}>
        Periksa
      </button>
      {checked && (
        <div role="status" className={`rounded-xl p-3 ${correct ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100'}`}>
          {correct ? (
            <p><b>Betul!</b> {task.summary}</p>
          ) : (
            <>
              <p className="font-bold">Belum tepat. Geser lagi titiknya dan amati.</p>
              {wrongPicks.map((o) => <p key={o.id}>“{o.text}”: {o.feedback}</p>)}
              {wrongPicks.length === 0 && <p>Masih ada sifat yang belum kamu pilih.</p>}
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default function LabPage() {
  const [params, setParams] = useSearchParams();
  const initialShape = (params.get('shape') as LabShapeId) ?? 'rectangle';
  const shape: LabShapeId = initialShape in SHAPE_MODELS ? initialShape : 'rectangle';
  const initialLayers = (params.get('layers')?.split(',').filter(Boolean) as Layer[] | undefined) ?? LAB_TASKS[shape]?.layers ?? ['sides'];

  const [quads, setQuads] = useState<Partial<Record<LabShapeId, Quad>>>({});
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const markLabVisited = useProgress((s) => s.markLabVisited);
  useEffect(() => markLabVisited(shape), [shape, markLabVisited]);

  const quad = quads[shape] ?? SHAPE_MODELS[shape].initial;
  const setQuad = (q: Quad) => setQuads((s) => ({ ...s, [shape]: q }));

  const info = useMemo(() => {
    const props = computeProperties(quad);
    const angles = roundPreservingSum(interiorAngles(quad));
    const [ac, bd] = diagonalLengths(quad);
    return { props, angles, ac, bd, cls: classifyQuadrilateral(quad) };
  }, [quad]);

  const selectShape = (s: LabShapeId) => {
    setSelectedAngle(null);
    setLayers(LAB_TASKS[s]?.layers ?? ['sides']);
    setParams({ shape: s }, { replace: true });
  };
  const toggleLayer = (l: Layer) => setLayers((ls) => (ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l]));
  const { props, angles, ac, bd, cls } = info;
  const has = (l: Layer) => layers.includes(l);
  const partners = selectedAngle !== null ? supplementaryPartners(quad, selectedAngle) : [];

  return (
    <Page title="Lab Segiempat" right={<button type="button" className="btn-ghost text-sm" onClick={() => setQuads((s) => ({ ...s, [shape]: undefined }))}>↺ Ulang</button>}>
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1" role="radiogroup" aria-label="Pilih bangun">
        {SHAPE_CHOICES.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={s === shape} className={`${s === shape ? 'chip-on' : 'chip-off'} shrink-0`} onClick={() => selectShape(s)}>
            {LAB_SHAPE_NAMES[s]}
          </button>
        ))}
      </div>

      <div className="card mb-3 p-1">
        <ShapeFigure
          shape={shape}
          quad={quad}
          onChange={setQuad}
          layers={layers}
          selectedAngle={selectedAngle}
          onSelectAngle={setSelectedAngle}
          ariaLabel={`Simulasi ${LAB_SHAPE_NAMES[shape]}`}
        />
        <p className="px-2 pb-1 text-center text-xs text-slate-500 dark:text-slate-400">Geser titik biru, atau geser bangunnya. Ukuran dalam satuan cm.</p>
      </div>

      <div className="mb-3 flex flex-wrap gap-2" aria-label="Lapisan informasi">
        {LAYERS.map((l) => (
          <button key={l.id} type="button" aria-pressed={has(l.id)} className={has(l.id) ? 'chip-on' : 'chip-off'} onClick={() => toggleLayer(l.id)}>
            {has(l.id) ? '✓ ' : ''}
            {l.label}
          </button>
        ))}
      </div>

      <section className="card mb-3" aria-label="Sifat yang berlaku" aria-live="polite">
        <h2 className="mb-2 font-extrabold">Sifat yang berlaku</h2>
        {shape === 'free' && (
          <p className="mb-2 rounded-lg bg-brand-50 p-2 font-semibold dark:bg-slate-800">
            {cls.types.length === 0
              ? 'Bangun ini: segiempat sembarang'
              : `Bangun ini: ${TYPE_NAMES[cls.types[0]]}${cls.types.length > 1 ? ` (juga ${cls.types.slice(1).map((t) => TYPE_NAMES[t]).join(', ')})` : ''}`}
          </p>
        )}
        {layers.length === 0 && <p className="text-slate-500">Nyalakan salah satu lapisan di atas untuk melihat sifatnya.</p>}
        <ul className="space-y-1.5">
          {has('sides') && (
            <>
              <Check ok={props.allSidesEqual}>Keempat sisi sama panjang</Check>
              <Check ok={props.oppositeSidesEqual}>Sisi berhadapan sama panjang</Check>
              <Check ok={props.bothPairsParallel}>Dua pasang sisi sejajar</Check>
              <Check ok={props.exactlyOnePairParallel}>Tepat sepasang sisi sejajar</Check>
            </>
          )}
          {has('angles') && (
            <>
              <Check ok={props.angleSum360}>Jumlah sudut = {angles.join('° + ')}° = 360°</Check>
              <Check ok={props.allRightAngles}>Semua sudut 90°</Check>
              <Check ok={props.oppositeAnglesEqual}>Sudut berhadapan sama besar</Check>
            </>
          )}
          {has('diagonals') && (
            <>
              <li className="text-sm text-slate-500 dark:text-slate-400">AC = {formatNumber(ac)} · BD = {formatNumber(bd)}</li>
              <Check ok={props.diagonalsEqual}>Diagonal sama panjang</Check>
              <Check ok={props.diagonalsPerpendicular}>Diagonal saling tegak lurus</Check>
              <Check ok={props.diagonalsBisectEachOther}>Kedua diagonal saling membagi dua sama panjang</Check>
              <Check ok={props.oneDiagonalBisected}>Hanya satu diagonal yang terbagi dua</Check>
            </>
          )}
          {has('symmetry') && (
            <>
              <Check ok={props.foldAxisCount > 0}>Simetri lipat: {props.foldAxisCount}</Check>
              <Check ok={props.rotationOrder > 1}>Simetri putar: {props.rotationOrder > 1 ? `tingkat ${props.rotationOrder}` : 'tidak ada'}</Check>
            </>
          )}
        </ul>
        {has('angles') && (
          <div className="mt-3 rounded-lg bg-amber-50 p-2 text-sm dark:bg-amber-950">
            {selectedAngle === null ? (
              <p>Ketuk angka sudut di gambar untuk melihat pasangan sudut yang berjumlah 180°.</p>
            ) : partners.length === 0 ? (
              <p>∠{VERTEX_NAMES[selectedAngle]} tidak punya pasangan sudut berdekatan yang berjumlah 180° (tidak ada sisi sejajar yang mengapitnya).</p>
            ) : (
              partners.map((j) => (
                <p key={j} className="font-semibold">
                  ∠{VERTEX_NAMES[selectedAngle]} + ∠{VERTEX_NAMES[j]} = {angles[selectedAngle]}° + {angles[j]}° = {angles[selectedAngle] + angles[j]}°
                </p>
              ))
            )}
          </div>
        )}
      </section>

      <LabTaskPanel key={shape} shape={shape} />
    </Page>
  );
}
