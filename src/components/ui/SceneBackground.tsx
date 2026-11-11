/**
 * Garden scene behind the whole app. It fills the empty space left and right of the page
 * column on wide screens (laptop, tablet). On phones only the soft hills show.
 * Purely decorative: fixed, behind the content, never interactive, and the only motion
 * is a slow kite sway that "Kurangi animasi" switches off.
 */
import Mascot from './Mascot';

function Cloud({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 160 70" className={className}>
      <g fill="#ffffff" opacity="0.9">
        <ellipse cx="50" cy="45" rx="40" ry="22" />
        <ellipse cx="85" cy="32" rx="34" ry="28" />
        <ellipse cx="118" cy="46" rx="32" ry="20" />
        <rect x="20" y="44" width="125" height="22" rx="11" />
      </g>
    </svg>
  );
}

/** A flying kite (layang-layang!) with a wavy tail. */
function Kite({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 220" className={className}>
      <path d="M60 104 C 40 130, 80 150, 58 176 S 70 210, 50 218" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
      {[
        [52, 132, '#f472b6'],
        [66, 158, '#facc15'],
        [56, 190, '#60a5fa'],
      ].map(([x, y, c], i) => (
        <path key={i} d={`M${x} ${y} l-7 -5 v10 z M${x} ${y} l7 -5 v10 z`} fill={c as string} />
      ))}
      <polygon points="60,6 92,40 60,104 28,40" fill="#fdba74" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="60,6 92,40 60,40" fill="#fcd34d" opacity="0.9" />
      <polygon points="60,40 28,40 60,104" fill="#fca5a5" opacity="0.8" />
      <path d="M60 6 V104 M28 40 H92" stroke="#c2410c" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

/** A small pastel quadrilateral "confetti" piece. */
function Shape({ kind, color, className }: { kind: 'rhombus' | 'square' | 'trapezoid' | 'parallelogram'; color: string; className: string }) {
  const points = {
    rhombus: '20,2 36,20 20,38 4,20',
    square: '6,6 34,6 34,34 6,34',
    trapezoid: '12,8 28,8 36,32 4,32',
    parallelogram: '12,8 38,8 28,32 2,32',
  }[kind];
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={className}>
      <polygon points={points} fill={color} fillOpacity="0.55" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Hills() {
  const flowers: [number, number, string][] = [
    [60, 70, '#ffffff'], [150, 84, '#fde68a'], [260, 66, '#fbcfe8'], [380, 88, '#ffffff'], [520, 74, '#c4b5fd'],
    [660, 86, '#fde68a'], [800, 70, '#ffffff'], [930, 84, '#fbcfe8'], [1080, 72, '#ffffff'], [1210, 86, '#fde68a'],
    [1330, 70, '#c4b5fd'], [1450, 84, '#ffffff'],
  ];
  return (
    <svg aria-hidden viewBox="0 0 1500 140" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-32 w-full lg:h-40">
      <path d="M0 60 Q180 10 420 46 T860 40 T1260 30 T1500 44 V140 H0 Z" fill="#bbf7d0" />
      <path d="M0 84 Q240 44 520 74 T1060 66 T1500 70 V140 H0 Z" fill="#86efac" />
      <path d="M0 108 Q300 80 700 100 T1500 96 V140 H0 Z" fill="#4ade80" />
      {flowers.map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x - 4} cy={y} r="3.4" fill={c} />
          <circle cx={x + 4} cy={y} r="3.4" fill={c} />
          <circle cx={x} cy={y - 4} r="3.4" fill={c} />
          <circle cx={x} cy={y + 4} r="3.4" fill={c} />
          <circle cx={x} cy={y} r="2.3" fill="#f59e0b" />
        </g>
      ))}
    </svg>
  );
}

export default function SceneBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden dark:opacity-25">
      {/* Sun glow, top right */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-yellow-200/70 blur-2xl" />

      {/* Clouds */}
      <Cloud className="absolute left-[3%] top-24 hidden w-44 md:block" />
      <Cloud className="absolute right-[5%] top-[38%] hidden w-36 opacity-90 lg:block" />
      <Cloud className="absolute left-[8%] top-[58%] hidden w-28 opacity-80 xl:block" />

      {/* Kite on the left, gently swaying */}
      <div className="absolute left-[7%] top-[22%] hidden w-24 origin-bottom animate-sway lg:block xl:left-[10%] xl:w-28">
        <Kite className="w-full" />
      </div>

      {/* Pastel quadrilaterals scattered on both sides */}
      <Shape kind="rhombus" color="#ec4899" className="absolute right-[12%] top-[16%] hidden w-10 rotate-12 lg:block" />
      <Shape kind="square" color="#8b5cf6" className="absolute right-[20%] top-[26%] hidden w-7 -rotate-12 xl:block" />
      <Shape kind="trapezoid" color="#f97316" className="absolute left-[16%] top-[64%] hidden w-9 rotate-6 xl:block" />
      <Shape kind="parallelogram" color="#10b981" className="absolute right-[10%] top-[56%] hidden w-11 -rotate-6 lg:block" />
      <Shape kind="square" color="#0ea5e9" className="absolute left-[4%] top-[48%] hidden w-7 rotate-[20deg] lg:block" />
      <Shape kind="rhombus" color="#f59e0b" className="absolute right-[4%] top-[74%] hidden w-8 xl:block" />

      <Hills />

      {/* Kelin and Kimi sitting on the hills (wide screens only) */}
      <Mascot kind="bunny" mood="happy" className="absolute bottom-20 left-[5%] hidden w-24 lg:block xl:w-28" />
      <Mascot kind="cat" mood="happy" className="absolute bottom-20 right-[5%] hidden w-24 lg:block xl:w-28" />
    </div>
  );
}
