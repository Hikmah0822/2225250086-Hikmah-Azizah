import { Link } from 'react-router-dom';
import { Page, ProgressBar, SectionTitle, SettingsLink } from '../components/ui/Layout';
import ShapeFigure from '../components/geometry/ShapeFigure';
import { PREP_CARDS, SHAPES, SHAPE_ORDER, SHAPE_THEME } from '../content/shapes';
import { shapePercent, shapeStatus, useProgress } from '../store/progressStore';
import { firstName, useProfile } from '../store/profileStore';
import Mascot, { Meadow } from '../components/ui/Mascot';

const STATUS_BADGE = {
  'not-started': '',
  'in-progress': '◐',
  done: '✓',
} as const;

/** Entrance stagger for lists. */
const stagger = (i: number) => ({ animationDelay: `${80 + i * 60}ms` });

function Hero() {
  const first = useProfile((s) => firstName(s.name));
  const className = useProfile((s) => s.className);
  return (
    // A small sunny meadow with Beru the bear (decoration on the home page only).
    <div className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-lime-100 px-5 pb-12 pt-5 shadow-lg shadow-green-700/15 ring-1 ring-sky-200 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 dark:ring-slate-700">
      <span aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-200 opacity-80 blur-[2px] dark:opacity-30" />
      <span aria-hidden className="absolute right-3 top-3 h-12 w-12 rounded-full bg-yellow-300 shadow-[0_0_30px_8px_rgba(253,224,71,0.7)] dark:opacity-40" />
      <div className="relative max-w-[62%] text-emerald-950 dark:text-white">
        <p className="text-2xl font-extrabold">Hai, {first}! 👋</p>
        {className && <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">Kelas {className}</p>}
        <p className="mt-1 text-emerald-900/80 dark:text-slate-300">Yuk, belajar segiempat bareng Beru!</p>
      </div>
      <Meadow className="absolute inset-x-0 bottom-0 h-12 w-full" />
      {/* Beru stands in front of the grass so the rhombus he holds stays visible. */}
      <div className="absolute bottom-2 right-4 w-28 animate-float [animation-duration:5s]">
        <Mascot kind="bear" mood="happy" className="w-full drop-shadow-md" title="Beru si beruang" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const progress = useProgress((s) => s.shapes);
  const prepSeen = progress.prep?.cardsSeen.length ?? 0;
  const prepDone = prepSeen >= PREP_CARDS.length;
  const continueShape = SHAPE_ORDER.find((id) => shapeStatus(progress[id], SHAPES[id].cards.length) === 'in-progress');

  return (
    <Page title="SegiempatKu" right={<SettingsLink />}>
      <Hero />

      {continueShape && (
        <Link to={`/bangun/${continueShape}`} className="card-link mb-4 flex animate-fade-up items-center gap-4 ring-2 ring-brand-200" style={stagger(0)}>
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${SHAPE_THEME[continueShape].tint}`}>
            <ShapeFigure shape={SHAPES[continueShape].labShape} compact accent={SHAPE_THEME[continueShape].hex} className="h-10 !w-auto" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs font-bold uppercase text-brand-600 dark:text-brand-100">Lanjutkan</p>
            <p className="font-bold">{SHAPES[continueShape].name}</p>
            <ProgressBar value={shapePercent(progress[continueShape], SHAPES[continueShape].cards.length)} label="Kemajuan" />
          </div>
        </Link>
      )}

      <Link to="/belajar/persiapan" className="card-link mb-5 flex animate-fade-up items-center justify-between gap-3 bg-gradient-to-r from-rose-50 to-white dark:from-slate-900" style={stagger(1)}>
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-2xl dark:bg-rose-950">🧰</span>
          <div>
            <p className="font-bold">Persiapan</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sejajar, tegak lurus, diagonal, tinggi, sudut 180°</p>
          </div>
        </div>
        <span className="text-sm font-bold text-brand-600 dark:text-brand-100">{prepDone ? '✓' : `${prepSeen}/${PREP_CARDS.length}`}</span>
      </Link>

      <SectionTitle color="#ec4899">Bangun Segiempat</SectionTitle>
      <ul className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SHAPE_ORDER.map((id, i) => {
          const info = SHAPES[id];
          const theme = SHAPE_THEME[id];
          const status = shapeStatus(progress[id], info.cards.length);
          return (
            <li key={id} className="animate-fade-up" style={stagger(i + 2)}>
              <Link to={`/bangun/${id}`} className="card-link group flex h-full flex-col gap-2 p-3">
                <div className={`flex h-20 items-center justify-center rounded-xl ${theme.tint}`}>
                  <ShapeFigure
                    shape={info.labShape}
                    compact
                    accent={theme.hex}
                    ariaLabel={info.name}
                    className="draw-in h-14 !w-auto max-w-[85%] transition-transform duration-300 group-hover:animate-wiggle"
                  />
                </div>
                <div className="flex items-start justify-between gap-1">
                  <p className={`font-bold leading-tight ${theme.text}`}>{info.name}</p>
                  <span aria-label={status} className="font-bold text-emerald-600">{STATUS_BADGE[status]}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{info.tagline}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        to="/literasi"
        className="card-link mb-6 flex animate-fade-up items-center gap-4 bg-gradient-to-r from-amber-50 to-rose-50 ring-amber-200 dark:from-slate-900 dark:to-slate-900"
        style={stagger(8)}
      >
        <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-200 text-2xl dark:bg-amber-900">📐</span>
        <div className="flex-1">
          <p className="font-bold">Literasi Matematika</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">4 soal cerita bertahap: keramik, taman, kolam, parkir</p>
        </div>
        <span aria-hidden className="text-xl text-amber-600">→</span>
      </Link>

      <SectionTitle color="#f59e0b">Tantangan</SectionTitle>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { to: '/bandingkan', icon: '🔍', bg: 'bg-sky-100 dark:bg-sky-950', title: 'Bandingkan', desc: 'Belah ketupat vs layang-layang, dan lainnya' },
          { to: '/detektif', icon: '🕵️', bg: 'bg-violet-100 dark:bg-violet-950', title: 'Detektif', desc: 'Tebak bangun dari diagonalnya' },
          { to: '/latihan/campuran', icon: '🎯', bg: 'bg-emerald-100 dark:bg-emerald-950', title: 'Latihan Campuran', desc: 'Soal gabungan semua bangun' },
          { to: '/stiker', icon: '🏅', bg: 'bg-amber-100 dark:bg-amber-950', title: 'Koleksi Stiker', desc: 'Kumpulkan stiker Beru, Kelin, dan Kimi' },
        ].map((c, i) => (
          <Link key={c.to} to={c.to} className="card-link flex animate-fade-up items-center gap-3" style={stagger(9 + i)}>
            <span aria-hidden className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl ${c.bg}`}>{c.icon}</span>
            <div>
              <p className="font-bold">{c.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </Page>
  );
}
