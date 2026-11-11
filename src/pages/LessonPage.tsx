/** Short lesson cards, one concept per card (F01). */
import { type TouchEvent, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Page } from '../components/ui/Layout';
import ShapeFigure from '../components/geometry/ShapeFigure';
import InteractiveFormula from '../components/formula/InteractiveFormula';
import PerimeterAreaDemo from '../components/geometry/PerimeterAreaDemo';
import SymmetryDemo from '../components/geometry/SymmetryDemo';
import SpeakButton from '../components/ui/SpeakButton';
import { PREP_CARDS, SHAPES } from '../content/shapes';
import { useProgress } from '../store/progressStore';
import type { HighlightKey, ShapeId } from '../types';

/** Remount per lesson so moving to another lesson starts at its first card. */
export default function LessonRoute() {
  const { id = '' } = useParams();
  return <LessonPage key={id} id={id} />;
}

function LessonPage({ id }: { id: string }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<HighlightKey | null>(null);
  const markCardSeen = useProgress((s) => s.markCardSeen);
  const touchStart = useRef<number | null>(null);

  const isPrep = id === 'persiapan';
  const info = isPrep ? null : SHAPES[id as ShapeId];
  const cards = isPrep ? PREP_CARDS : info?.cards ?? [];
  const card = cards[index];
  const progressKey = isPrep ? 'prep' : (id as ShapeId);

  useEffect(() => {
    if (card) markCardSeen(progressKey, card.id);
    setActive(null);
  }, [card, progressKey, markCardSeen]);

  if (!card) return <Navigate to="/" replace />;

  const isLast = index === cards.length - 1;
  const go = (d: number) => setIndex((i) => Math.min(cards.length - 1, Math.max(0, i + d)));
  const showFormulas = info && card.id.endsWith('-formula');
  const highlight = [...(card.figure.highlight ?? []), ...(active ? [active] : [])];

  const onTouchStart = (e: TouchEvent) => (touchStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
    touchStart.current = null;
  };

  return (
    <Page
      title={isPrep ? 'Persiapan' : info!.name}
      back={isPrep ? '/' : `/bangun/${id}`}
      right={<span className="text-sm font-bold text-slate-500">{index + 1} / {cards.length}</span>}
    >
      <div className="mb-3 flex gap-1.5" aria-hidden>
        {cards.map((c, i) => (
          <span key={c.id} className={`h-1.5 flex-1 rounded-full ${i <= index ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
        ))}
      </div>

      {/* key → the card slides in each time the student moves to another card */}
      <article key={card.id} className="card animate-slide-in space-y-4" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} aria-live="polite">
        <ShapeFigure {...card.figure} highlight={highlight} ariaLabel={card.title} />
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold">{card.title}</h2>
            <SpeakButton text={`${card.title}. ${card.body}`} />
          </div>
          <p className="text-lg leading-relaxed">{card.body}</p>
        </div>

        {showFormulas && (
          <div className="space-y-2 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
            <InteractiveFormula formula={info!.perimeter} active={active} onSelect={setActive} />
            <InteractiveFormula formula={info!.area} active={active} onSelect={setActive} />
          </div>
        )}

        {/* Animated demos: keliling vs luas on formula cards, lipat/putar on symmetry cards. */}
        {(showFormulas || card.id === 'prep-k-l') && <PerimeterAreaDemo shape={isPrep ? 'rectangle' : (id as ShapeId)} />}
        {(card.id.endsWith('-sym') || card.id === 'trap-diag') && <SymmetryDemo shape={card.figure.shape} />}

        {card.lab && (
          <Link to={`/lab?shape=${card.lab.shape}&layers=${card.lab.layers.join(',')}`} className="btn-secondary w-full">
            🧪 Coba geser di Lab
          </Link>
        )}
      </article>

      <div className="mt-4 flex gap-3">
        <button type="button" className="btn-secondary flex-1" disabled={index === 0} onClick={() => go(-1)}>
          ← Kembali
        </button>
        {isLast ? (
          <button type="button" className="btn-primary flex-1" onClick={() => navigate(isPrep ? '/' : `/latihan/${id}`)}>
            {isPrep ? 'Selesai ✓' : 'Ke Latihan →'}
          </button>
        ) : (
          <button type="button" className="btn-primary flex-1" onClick={() => go(1)}>
            Lanjut →
          </button>
        )}
      </div>
    </Page>
  );
}
