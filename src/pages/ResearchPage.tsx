/** Mode Penelitian: pretes → belajar → postes → angket → kirim hasil (F11). */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Page } from '../components/ui/Layout';
import { useResearch } from '../store/researchStore';
import { useProfile } from '../store/profileStore';
import { POSTTEST, PRETEST } from '../content/assessment';
import { type ExportInput, loadMeans, nGain, nGainCategory, toCsv, toSummaryText } from '../lib/research';
import { formatNumber } from '../lib/format';

function Step({ n, title, desc, done, to, enabled, cta }: { n: number; title: string; desc: string; done: boolean; to: string; enabled: boolean; cta: string }) {
  return (
    <li className={`card flex items-center gap-3 ${enabled || done ? '' : 'opacity-60'}`}>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-extrabold text-white ${done ? 'bg-emerald-500' : 'bg-brand-600'}`}>{done ? '✓' : n}</span>
      <div className="min-w-0 flex-1">
        <p className="font-bold">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      {done ? (
        <span className="text-sm font-bold text-emerald-600">Selesai</span>
      ) : enabled ? (
        <Link to={to} className="btn-primary min-h-[40px] px-3 text-sm">
          {cta}
        </Link>
      ) : (
        <span className="text-xs text-slate-400">Terkunci</span>
      )}
    </li>
  );
}

export default function ResearchPage() {
  const { pre, post, survey, reset } = useResearch();
  const { name, className } = useProfile();
  const [message, setMessage] = useState<string | null>(null);

  const data: ExportInput = { name, className, pre, post, survey, pretestItems: PRETEST, posttestItems: POSTTEST };
  const g = pre && post ? nGain(pre.score, post.score) : null;
  const means = survey ? loadMeans(survey) : null;
  const anything = Boolean(pre || post || survey);
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;
  const canDownload = !Capacitor.isNativePlatform();

  const copy = async () => {
    const text = toSummaryText(data);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older WebViews
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setMessage('Hasil sudah disalin. Tempel (paste) di WhatsApp atau tempat yang diminta gurumu.');
  };

  const share = async () => {
    try {
      await navigator.share({ title: 'Hasil SegiempatKu', text: toSummaryText(data) });
    } catch {
      /* cancelled */
    }
  };

  const download = () => {
    const blob = new Blob(['﻿' + toCsv(data)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `segiempatku-${name.replace(/\s+/g, '_') || 'siswa'}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Page title="Mode Penelitian" back>
      <p className="mb-4 text-slate-600 dark:text-slate-300">Ikuti langkah ini jika gurumu memintanya. Kerjakan sendiri dan jujur, ya. Jawaban tes tidak bisa diubah setelah dikirim.</p>

      <ol className="mb-5 space-y-3">
        <Step n={1} title="Pretes" desc="10 soal sebelum belajar (±15 menit)" done={Boolean(pre)} enabled to="/penelitian/pretes" cta="Mulai" />
        <Step n={2} title="Belajar" desc="Pelajari materi, Lab, dan latihan di aplikasi" done={Boolean(post)} enabled={Boolean(pre)} to="/" cta="Belajar" />
        <Step n={3} title="Postes" desc="10 soal setelah belajar" done={Boolean(post)} enabled={Boolean(pre)} to="/penelitian/postes" cta="Mulai" />
        <Step n={4} title="Angket" desc="Pendapatmu tentang belajar dengan aplikasi ini" done={Boolean(survey)} enabled={Boolean(post)} to="/penelitian/angket" cta="Isi" />
      </ol>

      {anything && (
        <section className="card mb-4 space-y-3">
          <h2 className="font-extrabold">Hasil</h2>
          <dl className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-sky-50 p-2 dark:bg-slate-800">
              <dt className="text-xs text-slate-500">Pretes</dt>
              <dd className="text-2xl font-extrabold">{pre?.score ?? '–'}</dd>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2 dark:bg-slate-800">
              <dt className="text-xs text-slate-500">Postes</dt>
              <dd className="text-2xl font-extrabold">{post?.score ?? '–'}</dd>
            </div>
            <div className="rounded-xl bg-amber-50 p-2 dark:bg-slate-800">
              <dt className="text-xs text-slate-500">N-gain</dt>
              <dd className="text-2xl font-extrabold">{g === null ? '–' : formatNumber(g, 2)}</dd>
              <dd className="text-xs">{nGainCategory(g)}</dd>
            </div>
          </dl>
          {means && survey && (
            <p className="text-sm">
              Beban kognitif (0–10): <b>IL {formatNumber(means.IL, 1)}</b> · <b>EL {formatNumber(means.EL, 1)}</b> · <b>GL {formatNumber(means.GL, 1)}</b> · usaha mental {survey.paas}/9
            </p>
          )}

          <div className="grid gap-2 pt-1">
            <p className="text-sm font-bold">Kirim hasil ke gurumu:</p>
            <button type="button" className="btn-primary" onClick={copy}>
              📋 Salin hasil
            </button>
            {canShare && (
              <button type="button" className="btn-secondary" onClick={share}>
                📤 Bagikan (WhatsApp, dll.)
              </button>
            )}
            {canDownload && (
              <button type="button" className="btn-secondary" onClick={download}>
                ⬇️ Unduh file CSV (untuk Excel)
              </button>
            )}
            {message && <p role="status" className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">{message}</p>}
          </div>
        </section>
      )}

      <p className="mb-3 text-xs text-slate-500">Data penelitian hanya disimpan di perangkat ini sampai kamu mengirimnya sendiri.</p>
      {anything && (
        <button
          type="button"
          className="btn-ghost w-full text-sm text-red-600"
          onClick={() => window.confirm('Hapus semua data penelitian (pretes, postes, angket) di perangkat ini? Lakukan hanya jika diminta guru.') && reset()}
        >
          Hapus data penelitian (khusus guru)
        </button>
      )}
    </Page>
  );
}
