/** Jurnal Berpikirku (RMT): reflections + glossary of thinking actions ("Kamus Fungsi Berpikir"). */
import { useState } from 'react';
import { Page } from '../components/ui/Layout';
import { COGNITIVE_FUNCTIONS, type CognitiveFunctionId } from '../content/rmt';
import { functionCounts, useJournal } from '../store/journalStore';

const CONF = ['', '😟 Belum paham', '🤔 Sedikit paham', '🙂 Paham', '😄 Sangat paham'];
const LEVELS: { level: 1 | 2 | 3; title: string }[] = [
  { level: 1, title: 'Tingkat 1 · Berpikir umum' },
  { level: 2, title: 'Tingkat 2 · Berpikir tentang ukuran dan ketelitian' },
  { level: 3, title: 'Tingkat 3 · Berpikir matematis dan logis' },
];

export default function JournalPage() {
  const { entries, clear } = useJournal();
  const [tab, setTab] = useState<'jurnal' | 'kamus'>('jurnal');
  const counts = new Map(functionCounts(entries).map((c) => [c.id, c.count]));

  return (
    <Page title="Jurnal Berpikirku" back="/">
      <div className="mb-4 grid grid-cols-2 gap-2" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'jurnal'} className={tab === 'jurnal' ? 'chip-on' : 'chip-off'} onClick={() => setTab('jurnal')}>
          📓 Jurnal ({entries.length})
        </button>
        <button type="button" role="tab" aria-selected={tab === 'kamus'} className={tab === 'kamus' ? 'chip-on' : 'chip-off'} onClick={() => setTab('kamus')}>
          🧠 Kamus Fungsi Berpikir
        </button>
      </div>

      {tab === 'jurnal' ? (
        entries.length === 0 ? (
          <div className="card text-center text-slate-600 dark:text-slate-300">
            <p className="font-bold">Jurnalmu masih kosong.</p>
            <p className="text-sm">Selesaikan sebuah latihan, lalu isi refleksi di halaman hasil.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...entries].reverse().map((e) => (
              <article key={e.at} className="card space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-bold">{e.activity}</p>
                  <p className="text-xs text-slate-500">{new Date(e.at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <p className="text-sm">
                  {e.score !== null && <>Skor {e.score} · </>}
                  {CONF[e.confidence]}
                </p>
                <div className="flex flex-wrap gap-1">
                  {e.functions.map((f) => (
                    <span key={f} className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-800 dark:bg-slate-800 dark:text-violet-200">
                      {COGNITIVE_FUNCTIONS[f].icon} {COGNITIVE_FUNCTIONS[f].name}
                    </span>
                  ))}
                </div>
                <p className="text-sm">
                  <b>Yang kupelajari:</b> {e.learned}
                </p>
                {e.confusing && (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <b>Masih bingung:</b> {e.confusing}
                  </p>
                )}
              </article>
            ))}
            <button type="button" className="btn-ghost w-full text-rose-700" onClick={() => window.confirm('Hapus semua isi jurnal?') && clear()}>
              Hapus jurnal
            </button>
          </div>
        )
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">Fungsi berpikir adalah tindakan berpikir yang kamu lakukan dengan sadar. Angka di kanan = berapa kali kamu memakainya di jurnal.</p>
          {LEVELS.map((lv) => (
            <section key={lv.level} className="space-y-2">
              <h2 className="font-extrabold">{lv.title}</h2>
              {(Object.keys(COGNITIVE_FUNCTIONS) as CognitiveFunctionId[])
                .filter((id) => COGNITIVE_FUNCTIONS[id].level === lv.level)
                .map((id) => {
                  const f = COGNITIVE_FUNCTIONS[id];
                  return (
                    <div key={id} className="card space-y-1 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold">
                          {f.icon} {f.name}
                        </p>
                        <span className="rounded-full bg-violet-100 px-2 text-xs font-bold text-violet-800 dark:bg-slate-800 dark:text-violet-200">{counts.get(id) ?? 0}×</span>
                      </div>
                      <p className="text-sm">{f.meaning}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Contoh: {f.example}</p>
                    </div>
                  );
                })}
            </section>
          ))}
        </div>
      )}
    </Page>
  );
}
