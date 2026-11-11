/** First screen: the student enters their name and class so the app can greet them by name. */
import { type FormEvent, useState } from 'react';
import { CLASS_MAX, NAME_MAX, cleanName, useProfile } from '../store/profileStore';
import Mascot, { Meadow } from '../components/ui/Mascot';

interface Props {
  /** Called after saving (e.g. to leave the edit screen in Pengaturan). */
  onDone?: () => void;
  /** Editing an existing profile instead of the first visit. */
  editing?: boolean;
}

export default function WelcomePage({ onDone, editing = false }: Props) {
  const saved = useProfile();
  const [name, setName] = useState(saved.name);
  const [className, setClassName] = useState(saved.className);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (cleanName(name).length < 2) {
      setError('Tulis nama lengkapmu dulu, ya.');
      return;
    }
    saved.save(name, className);
    onDone?.();
  };

  const input =
    'min-h-[52px] w-full rounded-2xl border-2 border-green-100 bg-white/80 px-4 text-base text-slate-900 placeholder:text-green-700/40 transition focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-10">
      {/* The three mascot friends on a little meadow, each holding a quadrilateral. */}
      <div aria-hidden className="relative mx-auto mb-6 h-40 w-full max-w-xs">
        <div className="absolute inset-x-0 bottom-0 h-16 overflow-hidden rounded-b-3xl">
          <Meadow className="h-full w-full" />
        </div>
        <div className="absolute bottom-3 left-2 w-20 animate-float [animation-delay:-1.5s]">
          <Mascot kind="bunny" mood="happy" className="w-full drop-shadow" />
        </div>
        <div className="absolute bottom-4 left-1/2 w-28 -translate-x-1/2">
          <div className="animate-float">
            <Mascot kind="bear" mood="happy" className="w-full drop-shadow-md" />
          </div>
        </div>
        <div className="absolute bottom-3 right-2 w-20 animate-float [animation-delay:-3s]">
          <Mascot kind="cat" mood="happy" className="w-full drop-shadow" />
        </div>
      </div>

      <form onSubmit={submit} className="animate-fade-up text-center" noValidate>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-600">{editing ? 'Ubah identitas' : 'Siap untuk belajar?'}</p>
        <h1 className="mt-2 text-4xl font-extrabold text-emerald-950 dark:text-white">{editing ? 'Identitasmu' : 'Selamat Datang!'}</h1>
        <p className="mt-3 leading-relaxed text-slate-500 dark:text-slate-400">
          Kenalan dulu, yuk! Beru, Kelin, dan Kimi siap menemanimu belajar segiempat.
        </p>

        <label className="mt-8 block text-sm font-bold text-emerald-950 dark:text-slate-200" htmlFor="name">
          Nama Lengkap
        </label>
        <input
          id="name"
          className={`${input} mt-2`}
          placeholder="Masukkan nama lengkap"
          autoComplete="name"
          maxLength={NAME_MAX}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'name-error' : undefined}
        />
        {error && (
          <p id="name-error" role="alert" className="mt-2 text-sm font-semibold text-rose-600">
            {error}
          </p>
        )}

        <label className="mt-5 block text-sm font-bold text-emerald-950 dark:text-slate-200" htmlFor="class">
          Kelas
        </label>
        <input id="class" className={`${input} mt-2`} placeholder="Contoh: VII A" maxLength={CLASS_MAX} value={className} onChange={(e) => setClassName(e.target.value)} />

        <button type="submit" className="btn-primary mt-8 min-h-[56px] w-full rounded-2xl text-lg">
          {editing ? 'Simpan' : 'Mulai Belajar →'}
        </button>
        <p className="mt-4 text-xs text-slate-400">Namamu hanya disimpan di perangkat ini.</p>
      </form>
    </div>
  );
}
