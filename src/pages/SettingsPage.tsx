import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../components/ui/Layout';
import { useSettings } from '../store/settingsStore';
import { useProfile } from '../store/profileStore';
import WelcomePage from './WelcomePage';

export default function SettingsPage() {
  const { fontScale, theme, reduceMotion, update } = useSettings();
  const { name, className, clear } = useProfile();
  const [editing, setEditing] = useState(false);

  if (editing) return <WelcomePage editing onDone={() => setEditing(false)} />;

  return (
    <Page title="Pengaturan" back>
      <div className="space-y-4">
        <section className="card space-y-3">
          <h2 className="font-bold">Identitas</h2>
          <div className="flex items-center gap-3">
            <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-sky-400 text-xl font-extrabold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-bold">{name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{className ? `Kelas ${className}` : 'Kelas belum diisi'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => setEditing(true)}>
              ✏️ Ubah nama/kelas
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => window.confirm('Ganti pengguna? Nama akan dihapus dan layar Selamat Datang akan muncul lagi. Progres belajar tidak dihapus.') && clear()}
            >
              Ganti pengguna
            </button>
          </div>
        </section>
        <Link to="/penelitian" className="card-link flex items-center gap-3">
          <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-2xl dark:bg-sky-950">🔬</span>
          <div className="flex-1">
            <p className="font-bold">Mode Penelitian</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pretes, postes, dan angket (jika diminta guru)</p>
          </div>
          <span aria-hidden>→</span>
        </Link>
        <section className="card space-y-2">
          <h2 className="font-bold">Ukuran teks</h2>
          <div className="flex gap-2">
            <button type="button" className={fontScale === 1 ? 'chip-on' : 'chip-off'} onClick={() => update({ fontScale: 1 })}>Normal</button>
            <button type="button" className={fontScale === 1.25 ? 'chip-on' : 'chip-off'} onClick={() => update({ fontScale: 1.25 })}>Besar</button>
          </div>
        </section>
        <section className="card space-y-2">
          <h2 className="font-bold">Tema</h2>
          <div className="flex flex-wrap gap-2">
            {([['light', 'Terang'], ['dark', 'Gelap'], ['system', 'Ikuti perangkat']] as const).map(([v, l]) => (
              <button key={v} type="button" className={theme === v ? 'chip-on' : 'chip-off'} onClick={() => update({ theme: v })}>{l}</button>
            ))}
          </div>
        </section>
        <section className="card">
          <label className="flex min-h-[44px] items-center justify-between gap-3">
            <span className="font-bold">Kurangi animasi</span>
            <input type="checkbox" className="h-6 w-6 accent-brand-600" checked={reduceMotion} onChange={(e) => update({ reduceMotion: e.target.checked })} />
          </label>
        </section>
        <section className="card space-y-1 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Tentang</h2>
          <p>SegiempatKu membantu kamu belajar sifat, keliling, dan luas segiempat dengan gambar yang bisa digeser.</p>
          <p>Nama, kelas, dan progresmu hanya disimpan di perangkat ini dan tidak dikirim ke mana pun.</p>
          <p className="text-xs text-slate-500">Versi 0.1.0</p>
        </section>
      </div>
    </Page>
  );
}
