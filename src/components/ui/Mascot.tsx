/**
 * Original mascots for SegiempatKu: Beru (bear), Kelin (bunny), and Kimi (cat).
 * Each one holds a quadrilateral so the shape theme stays visible.
 * Used only on the welcome/home screens and for feedback, never on lesson or question figures (CLAUDE.md §5.8).
 */
export type MascotKind = 'bear' | 'bunny' | 'cat';
export type MascotMood = 'normal' | 'happy' | 'think';

interface Props {
  kind: MascotKind;
  mood?: MascotMood;
  className?: string;
  title?: string;
}

const INK = '#3f2d20';
const BLUSH = '#f9a8a8';

const PALETTE: Record<MascotKind, { body: string; inner: string; line: string }> = {
  bear: { body: '#d6a26c', inner: '#f3d9b8', line: '#a8743f' },
  bunny: { body: '#fffaf3', inner: '#fbcfe8', line: '#e7d6c2' },
  cat: { body: '#fdba74', inner: '#fecdd3', line: '#ea8c3c' },
};

/** Eyes and mouth for each mood (shared by all three faces). */
function Face({ mood, mouthY, snout }: { mood: MascotMood; mouthY: number; snout?: boolean }) {
  const eyes =
    mood === 'happy' ? (
      <g stroke={INK} strokeWidth={3.2} strokeLinecap="round" fill="none">
        <path d="M39 63 Q44 56 49 63" />
        <path d="M71 63 Q76 56 81 63" />
      </g>
    ) : (
      <g fill={INK}>
        <circle cx={mood === 'think' ? 46 : 44} cy={mood === 'think' ? 59 : 62} r={4.6} />
        <circle cx={mood === 'think' ? 78 : 76} cy={mood === 'think' ? 59 : 62} r={4.6} />
        <circle cx={mood === 'think' ? 47.5 : 45.5} cy={mood === 'think' ? 57.5 : 60.5} r={1.5} fill="#fff" />
        <circle cx={mood === 'think' ? 79.5 : 77.5} cy={mood === 'think' ? 57.5 : 60.5} r={1.5} fill="#fff" />
      </g>
    );
  const mouth =
    mood === 'happy' ? (
      <path d={`M53 ${mouthY} Q60 ${mouthY + 10} 67 ${mouthY} Z`} fill="#e76f6f" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
    ) : mood === 'think' ? (
      <circle cx={63} cy={mouthY + 2} r={2.6} fill="none" stroke={INK} strokeWidth={2} />
    ) : (
      <path d={`M55 ${mouthY} Q60 ${mouthY + 5} 65 ${mouthY}`} fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
    );
  return (
    <>
      <ellipse cx={34} cy={75} rx={7} ry={4} fill={BLUSH} opacity={0.75} />
      <ellipse cx={86} cy={75} rx={7} ry={4} fill={BLUSH} opacity={0.75} />
      {snout && <ellipse cx={60} cy={75} rx={14} ry={10.5} fill="#f6e7d4" />}
      {eyes}
      {mouth}
    </>
  );
}

function Bear({ mood }: { mood: MascotMood }) {
  const c = PALETTE.bear;
  return (
    <>
      <circle cx={30} cy={32} r={15} fill={c.body} stroke={c.line} strokeWidth={2} />
      <circle cx={30} cy={32} r={8} fill={c.inner} />
      <circle cx={90} cy={32} r={15} fill={c.body} stroke={c.line} strokeWidth={2} />
      <circle cx={90} cy={32} r={8} fill={c.inner} />
      <ellipse cx={60} cy={64} rx={42} ry={37} fill={c.body} stroke={c.line} strokeWidth={2} />
      <Face mood={mood} mouthY={78} snout />
      <ellipse cx={60} cy={70.5} rx={5.5} ry={4} fill={INK} />
      {/* Holds a rhombus (belah ketupat) */}
      <polygon points="60,98 85,117 60,136 35,117" fill="#fbcfe8" stroke="#ec4899" strokeWidth={2.5} strokeLinejoin="round" />
      <line x1={60} y1={98} x2={60} y2={136} stroke="#ec4899" strokeWidth={1.5} strokeDasharray="3 3" />
      <line x1={35} y1={117} x2={85} y2={117} stroke="#ec4899" strokeWidth={1.5} strokeDasharray="3 3" />
      <circle cx={38} cy={108} r={8} fill={c.body} stroke={c.line} strokeWidth={2} />
      <circle cx={82} cy={108} r={8} fill={c.body} stroke={c.line} strokeWidth={2} />
    </>
  );
}

function Bunny({ mood }: { mood: MascotMood }) {
  const c = PALETTE.bunny;
  return (
    <>
      <g stroke={c.line} strokeWidth={2}>
        <ellipse cx={44} cy={22} rx={10} ry={25} fill={c.body} transform="rotate(-12 44 22)" />
        <ellipse cx={76} cy={22} rx={10} ry={25} fill={c.body} transform="rotate(12 76 22)" />
      </g>
      <ellipse cx={44} cy={24} rx={4.5} ry={17} fill={c.inner} transform="rotate(-12 44 24)" />
      <ellipse cx={76} cy={24} rx={4.5} ry={17} fill={c.inner} transform="rotate(12 76 24)" />
      <ellipse cx={60} cy={66} rx={39} ry={35} fill={c.body} stroke={c.line} strokeWidth={2} />
      <Face mood={mood} mouthY={77} />
      <ellipse cx={60} cy={71} rx={3.8} ry={2.8} fill="#f472b6" />
      {/* Holds a square (persegi) */}
      <rect x={38} y={96} width={44} height={40} rx={3} fill="#ddd6fe" stroke="#8b5cf6" strokeWidth={2.5} />
      <path d="M38 104 h6 v-8" fill="none" stroke="#8b5cf6" strokeWidth={1.5} />
      <circle cx={40} cy={106} r={8} fill={c.body} stroke={c.line} strokeWidth={2} />
      <circle cx={80} cy={106} r={8} fill={c.body} stroke={c.line} strokeWidth={2} />
    </>
  );
}

function Cat({ mood }: { mood: MascotMood }) {
  const c = PALETTE.cat;
  return (
    <>
      <g stroke={c.line} strokeWidth={2} strokeLinejoin="round">
        <polygon points="24,50 32,12 54,34" fill={c.body} />
        <polygon points="96,50 88,12 66,34" fill={c.body} />
      </g>
      <polygon points="30,42 34,22 46,34" fill={c.inner} />
      <polygon points="90,42 86,22 74,34" fill={c.inner} />
      <ellipse cx={60} cy={65} rx={41} ry={36} fill={c.body} stroke={c.line} strokeWidth={2} />
      <g stroke={c.line} strokeWidth={3} strokeLinecap="round">
        <path d="M52 34 l2 8" />
        <path d="M60 32 v9" />
        <path d="M68 34 l-2 8" />
      </g>
      <Face mood={mood} mouthY={78} />
      <polygon points="56,70 64,70 60,75" fill="#f472b6" stroke={INK} strokeWidth={1} strokeLinejoin="round" />
      <g stroke={INK} strokeWidth={1.4} strokeLinecap="round" opacity={0.6}>
        <path d="M22 70 h12" />
        <path d="M23 77 l11 -2" />
        <path d="M98 70 h-12" />
        <path d="M97 77 l-11 -2" />
      </g>
      {/* Holds a trapezoid (trapesium) */}
      <polygon points="45,98 75,98 88,134 32,134" fill="#fed7aa" stroke="#f97316" strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={44} cy={106} r={8} fill={c.body} stroke={c.line} strokeWidth={2} />
      <circle cx={76} cy={106} r={8} fill={c.body} stroke={c.line} strokeWidth={2} />
    </>
  );
}

export const MASCOT_NAMES: Record<MascotKind, string> = { bear: 'Beru', bunny: 'Kelin', cat: 'Kimi' };

export default function Mascot({ kind, mood = 'normal', className = '', title }: Props) {
  return (
    <svg viewBox="0 0 120 140" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {kind === 'bear' && <Bear mood={mood} />}
      {kind === 'bunny' && <Bunny mood={mood} />}
      {kind === 'cat' && <Cat mood={mood} />}
    </svg>
  );
}

/** Grass hills with small flowers, used at the bottom of the home and welcome banners. */
export function Meadow({ className = '' }: { className?: string }) {
  const flowers: [number, number, string][] = [
    [30, 52, '#ffffff'],
    [78, 60, '#fde68a'],
    [130, 50, '#fbcfe8'],
    [190, 58, '#ffffff'],
    [248, 48, '#c4b5fd'],
    [300, 58, '#fde68a'],
    [356, 50, '#ffffff'],
  ];
  return (
    <svg aria-hidden viewBox="0 0 400 80" preserveAspectRatio="none" className={className}>
      <path d="M0 40 Q60 18 130 34 T260 30 T400 26 V80 H0 Z" fill="#86efac" />
      <path d="M0 56 Q80 36 170 52 T330 46 T400 50 V80 H0 Z" fill="#4ade80" />
      {flowers.map(([x, y, color], i) => (
        <g key={i}>
          <circle cx={x - 3} cy={y} r={2.6} fill={color} />
          <circle cx={x + 3} cy={y} r={2.6} fill={color} />
          <circle cx={x} cy={y - 3} r={2.6} fill={color} />
          <circle cx={x} cy={y + 3} r={2.6} fill={color} />
          <circle cx={x} cy={y} r={1.8} fill="#f59e0b" />
        </g>
      ))}
    </svg>
  );
}
