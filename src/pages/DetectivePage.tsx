/** Detektif Segiempat (F06; IL04, GL05): reason from diagonal properties to the shape. */
import { useEffect, useState } from 'react';
import { useProgress } from '../store/progressStore';
import { Page } from '../components/ui/Layout';
import ShapeFigure from '../components/geometry/ShapeFigure';
import { DETECTIVE_NODES, DETECTIVE_ROOT, type DetectiveNode } from '../content/detective';
import { SHAPE_MODELS, transformQuad } from '../lib/shapes';
import { diagonalLengths } from '../lib/geometry/measure';
import { formatNumber } from '../lib/format';
import type { LabShapeId } from '../types';
import type { Quad } from '../lib/geometry/vector';

const TARGETS: { shape: LabShapeId; result: string }[] = [
  { shape: 'square', result: 'r-square' },
  { shape: 'rectangle', result: 'r-rectangle' },
  { shape: 'parallelogram', result: 'r-parallelogram' },
  { shape: 'rhombus', result: 'r-rhombus' },
  { shape: 'kite', result: 'r-kite' },
  { shape: 'trapezoid-isosceles', result: 'r-trapezoid-iso' },
  { shape: 'trapezoid', result: 'r-trapezoid' },
];
const ANGLES = [0, 15, 30, 45, 60, 90, 120, -20, -35];

interface Target {
  shape: LabShapeId;
  result: string;
  quad: Quad;
}

function randomTarget(previous?: LabShapeId): Target {
  const pool = TARGETS.filter((t) => t.shape !== previous);
  const t = pool[Math.floor(Math.random() * pool.length)];
  const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
  // Varied orientation (variability principle) so students don't rely on "upright" pictures.
  return { ...t, quad: transformQuad(SHAPE_MODELS[t.shape].initial, angle, 0.8) };
}

export default function DetectivePage() {
  const [target, setTarget] = useState<Target>(() => randomTarget());
  const [path, setPath] = useState<{ node: string; answer: boolean }[]>([]);
  const current = path.length === 0 ? DETECTIVE_ROOT : (() => {
    const last = path[path.length - 1];
    const node = DETECTIVE_NODES[last.node] as Extract<DetectiveNode, { kind: 'question' }>;
    return last.answer ? node.yes : node.no;
  })();
  const node = DETECTIVE_NODES[current];
  const [ac, bd] = diagonalLengths(target.quad);

  const answer = (yes: boolean) => setPath((p) => [...p, { node: current, answer: yes }]);
  const restart = () => {
    setPath([]);
    setTarget((t) => randomTarget(t.shape));
  };

  const correct = node.kind === 'result' && node.id === target.result;
  const addDetectiveSolved = useProgress((s) => s.addDetectiveSolved);
  const [counted, setCounted] = useState<Target | null>(null);
  // Count each solved case once (for the "Detektif Hebat" sticker).
  useEffect(() => {
    if (correct && counted !== target) {
      setCounted(target);
      addDetectiveSolved();
    }
  }, [correct, counted, target, addDetectiveSolved]);

  return (
    <Page title="Detektif Segiempat" back="/">
      <p className="mb-3 text-slate-600 dark:text-slate-300">Amati diagonal bangun misteri ini, lalu jawab pertanyaannya satu per satu.</p>
      <div className="card mb-3 p-1">
        <ShapeFigure
          shape={target.shape}
          quad={target.quad}
          layers={['diagonals']}
          annotations={[
            { at: 'AC', text: formatNumber(ac) },
            { at: 'BD', text: formatNumber(bd) },
          ]}
          ariaLabel="Bangun misteri"
        />
        <p className="px-2 pb-1 text-center text-xs text-slate-500 dark:text-slate-400">Garis kecil = bagian sama panjang · kotak kecil = tegak lurus</p>
      </div>

      {path.length > 0 && (
        <ol className="mb-3 space-y-1 text-sm">
          {path.map((p, i) => {
            const n = DETECTIVE_NODES[p.node] as Extract<DetectiveNode, { kind: 'question' }>;
            return (
              <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-300">
                <span className="font-bold">{p.answer ? 'Ya' : 'Tidak'}</span>
                <span>— {n.text}</span>
              </li>
            );
          })}
        </ol>
      )}

      {node.kind === 'question' ? (
        <div className="card space-y-3">
          <p className="text-sm font-bold text-slate-500">Pertanyaan {path.length + 1}</p>
          <p className="text-lg font-bold">{node.text}</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn-primary" onClick={() => answer(true)}>Ya</button>
            <button type="button" className="btn-secondary" onClick={() => answer(false)}>Tidak</button>
          </div>
          {path.length > 0 && (
            <button type="button" className="btn-ghost w-full" onClick={() => setPath((p) => p.slice(0, -1))}>↶ Ubah jawaban sebelumnya</button>
          )}
        </div>
      ) : (
        <div className={`card space-y-2 ${correct ? 'ring-2 ring-emerald-500' : 'ring-2 ring-amber-500'}`}>
          <p className="text-sm font-bold text-slate-500">Kesimpulanmu</p>
          <p className="text-2xl font-extrabold">{node.label}</p>
          <p>{node.explanation}</p>
          <p role="status" className={`rounded-xl p-3 font-semibold ${correct ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100'}`}>
            {correct
              ? '✓ Tepat! Kamu berhasil memecahkan kasus ini.'
              : `Belum tepat. Bangun ini adalah ${DETECTIVE_NODES[target.result].kind === 'result' ? (DETECTIVE_NODES[target.result] as Extract<DetectiveNode, { kind: 'result' }>).label : ''}. Lihat lagi tanda pada diagonalnya.`}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button type="button" className="btn-secondary" onClick={() => setPath([])}>↺ Ulangi</button>
            <button type="button" className="btn-primary" onClick={restart}>Kasus baru →</button>
          </div>
        </div>
      )}
    </Page>
  );
}
