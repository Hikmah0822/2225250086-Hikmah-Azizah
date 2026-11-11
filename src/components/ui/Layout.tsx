import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

interface PageProps {
  title: string;
  /** Show a back button; a string sets an explicit target. */
  back?: boolean | string;
  right?: ReactNode;
  children: ReactNode;
}

export function Page({ title, back = false, right, children }: PageProps) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[100dvh] flex-col pb-24">
      {/* Full-width bar; the content inside stays aligned with the page column. */}
      <header className="sticky top-0 z-10 border-b border-green-100/80 bg-white/75 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-3 py-2">
          {back && (
            <button
              type="button"
              className="btn-ghost -ml-1 px-2"
              aria-label="Kembali"
              onClick={() => (typeof back === 'string' ? navigate(back) : navigate(-1))}
            >
              <span aria-hidden className="text-xl">←</span>
            </button>
          )}
          <h1 className="flex min-w-0 flex-1 items-center gap-2 truncate text-lg font-extrabold text-emerald-950 dark:text-white">
            <LogoMark />
            <span className="truncate">{title}</span>
          </h1>
          {right}
        </div>
      </header>
      {/* Each page fades in when opened. */}
      <main className="mx-auto w-full max-w-2xl flex-1 animate-fade-up px-4 pt-4">{children}</main>
    </div>
  );
}

/** Small app mark (rhombus with diagonals) shown next to every page title. */
function LogoMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 shrink-0">
      <rect width="24" height="24" rx="7" fill="#15803d" />
      <polygon points="12,20 18,12 12,4 6,12" fill="#fff" />
      <path d="M12 4v16M6 12h12" stroke="#facc15" strokeWidth="1.4" />
    </svg>
  );
}

/** Section heading with a small coloured quadrilateral bullet. */
export function SectionTitle({ children, color = '#ec4899' }: { children: ReactNode; color?: string }) {
  return (
    <h2 className="mb-2 flex items-center gap-2 font-extrabold text-emerald-950 dark:text-white">
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
        <polygon points="8,1 15,8 8,15 1,8" fill={color} />
      </svg>
      {children}
    </h2>
  );
}

const NAV = [
  { to: '/', label: 'Beranda', icon: '🏠', end: true },
  { to: '/lab', label: 'Lab', icon: '🧪', end: false },
  { to: '/catatan', label: 'Catatanku', icon: '📒', end: false },
  { to: '/progres', label: 'Progres', icon: '📊', end: false },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95"
    >
      <ul className="mx-auto grid max-w-2xl grid-cols-4">
        {NAV.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `group flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-xs font-semibold transition-colors ${
                  isActive ? 'text-brand-600 dark:text-brand-100' : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden
                    className={`rounded-full px-4 py-0.5 text-xl leading-none transition duration-200 ${
                      isActive ? 'scale-110 bg-brand-100 dark:bg-slate-800' : 'group-active:scale-90'
                    }`}
                  >
                    {n.icon}
                  </span>
                  {n.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SettingsLink() {
  return (
    <Link to="/pengaturan" className="btn-ghost px-2" aria-label="Pengaturan">
      <span aria-hidden className="text-xl">⚙️</span>
    </Link>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-lime-400 transition-all duration-700 ease-out" style={{ width: `${value}%` }} />
    </div>
  );
}
