import { Link, Navigate, useParams } from 'react-router-dom';
import { Page, ProgressBar } from '../components/ui/Layout';
import ShapeFigure from '../components/geometry/ShapeFigure';
import { SHAPES } from '../content/shapes';
import { questionsFor } from '../content/questions';
import { shapePercent, useProgress } from '../store/progressStore';
import type { ShapeId } from '../types';

export default function ShapePage() {
  const { id } = useParams();
  const progress = useProgress((s) => s.shapes);
  if (!id || !(id in SHAPES)) return <Navigate to="/" replace />;
  const info = SHAPES[id as ShapeId];
  const p = progress[info.id];

  const items = [
    { to: `/belajar/${info.id}`, icon: '📖', title: 'Materi', desc: `${info.cards.length} kartu singkat`, done: (p?.cardsSeen.length ?? 0) >= info.cards.length },
    { to: `/lab?shape=${info.labShape}`, icon: '🧪', title: 'Lab', desc: 'Geser titik dan amati sifatnya', done: false },
    { to: `/latihan/${info.id}`, icon: '✍️', title: 'Latihan', desc: `${questionsFor(info.id).length} soal + pembahasan`, done: Boolean(p?.practiced) },
    { to: `/catatan?bangun=${info.id}`, icon: '📒', title: 'Catatanku', desc: 'Ringkasan sifat dan rumus', done: false },
  ];

  return (
    <Page title={info.name} back="/">
      <div className="card mb-4 p-2">
        <ShapeFigure shape={info.labShape} ariaLabel={info.name} />
      </div>
      <div className="mb-4">
        <ProgressBar value={shapePercent(p, info.cards.length)} label="Kemajuan" />
      </div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.title}>
            <Link to={it.to} className="card-link flex items-center gap-4">
              <span aria-hidden className="text-3xl">{it.icon}</span>
              <div className="flex-1">
                <p className="font-bold">{it.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{it.desc}</p>
              </div>
              {it.done && <span className="font-bold text-emerald-600" aria-label="selesai">✓</span>}
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
