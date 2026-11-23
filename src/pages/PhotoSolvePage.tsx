/**
 * Foto Soal: photograph a segiempat problem → Beru reads it and shows a worked solution.
 * Design (CLAUDE.md §5): Diketahui → Ditanya → steps opened one at a time (worked example,
 * rule 5) with RMT stage labels; the final answer opens only after every step is open
 * (rule 11), then the student checks it and reflects (rule 10). Needs internet and the
 * "Tanya Beru" setting; the photo is sent once and not stored anywhere.
 */
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../components/ui/Layout';
import CognitiveTags from '../components/ui/CognitiveTags';
import SpeakButton from '../components/ui/SpeakButton';
import ReflectionCard from '../components/quiz/ReflectionCard';
import { compressPhoto, solvePhoto } from '../lib/ai';
import { stageName } from '../lib/tutorPedagogy';
import { PHOTO_SHAPES, type PhotoParse, type PhotoSolution } from '../lib/photoSolve';
import ShapeFigure from '../components/geometry/ShapeFigure';
import type { HighlightKey, LabShapeId } from '../types';
import MathText from '../components/ui/MathText';
import { quadFromSize } from '../lib/shapes/fromSize';
import { useSettings } from '../store/settingsStore';

type Status = 'idle' | 'ready' | 'loading' | 'done' | 'error';

const shapeName = (id: LabShapeId) => PHOTO_SHAPES.find((s) => s.id === id)?.name ?? 'segiempat';
const PART_NAMES: Partial<Record<HighlightKey, string>> = { height: 'tinggi', perimeter: 'keliling', area: 'luas', AC: 'diagonal AC', BD: 'diagonal BD' };
const partName = (k: HighlightKey) => PART_NAMES[k] ?? `sisi ${k}`;
/** Grid cells only make sense for shapes whose opposite sides are parallel in both directions. */
const GRID_SHAPES: LabShapeId[] = ['square', 'rectangle', 'parallelogram'];

function Solution({ solution }: { solution: PhotoSolution }) {
  const [opened, setOpened] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);
  const allOpen = opened >= solution.steps.length;
  const fig = solution.figure;
  // Draw the shape in the problem's own proportions when its sizes are known.
  const quad = useMemo(() => (fig ? quadFromSize(fig.shape, fig.size) ?? undefined : undefined), [fig]);
  const figureName = fig ? fig.label || shapeName(fig.shape) : '';

  return (
    <div className="space-y-4">
      <section className="card space-y-2">
        <h2 className="font-bold">📄 Soal yang terbaca</h2>
        <p className="whitespace-pre-line text-sm">
          <MathText text={solution.question} />
        </p>
        {fig && (
          <figure className="rounded-2xl bg-white p-2 dark:bg-slate-900">
            <ShapeFigure shape={fig.shape} quad={quad} annotations={fig.annotations} areaLabel={fig.label} ariaLabel={`Gambar ${figureName} berbentuk ${shapeName(fig.shape)}`} className="mx-auto max-w-sm" />
            <figcaption className="text-center text-xs text-slate-500 dark:text-slate-400">
              {figureName} berbentuk {shapeName(fig.shape)} {quad ? '(perbandingan ukuran mendekati soal)' : '(tidak sesuai skala)'}
            </figcaption>
          </figure>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">Cek dulu: apakah soalnya terbaca dengan benar? Kalau ada angka yang salah, foto ulang.</p>
      </section>

      {(solution.known.length > 0 || solution.asked) && (
        <section className="card space-y-2">
          {solution.known.length > 0 && (
            <div>
              <h3 className="text-sm font-bold">Diketahui</h3>
              <ul className="list-disc pl-5 text-sm">
                {solution.known.map((k, i) => (
                  <li key={i}>
                    <MathText text={k} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {solution.asked && (
            <div>
              <h3 className="text-sm font-bold">Ditanya</h3>
              <p className="text-sm">{solution.asked}</p>
            </div>
          )}
          <CognitiveTags ids={['define', 'search']} />
        </section>
      )}

      <section className="card space-y-3">
        <h2 className="font-bold">🪜 Langkah penyelesaian</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Sebelum membuka langkah berikutnya, coba tebak dulu apa yang harus dilakukan.</p>
        <ol className="space-y-3">
          {solution.steps.slice(0, opened).map((s, i) => (
            <li key={i} className="animate-fade-up rounded-2xl bg-brand-50 p-3 dark:bg-slate-800">
              <p className="text-xs font-bold text-brand-700 dark:text-brand-100">
                Langkah {i + 1} · 🧭 {stageName(s.stage)}
              </p>
              <p className="mt-1 text-sm leading-relaxed">
                <MathText text={s.text} />
              </p>
              {fig && (s.highlight.length > 0 || (s.grid && GRID_SHAPES.includes(fig.shape))) && (
                <ShapeFigure
                  shape={fig.shape}
                  quad={quad}
                  annotations={fig.annotations}
                  highlight={s.highlight}
                  areaLabel={s.grid ? undefined : fig.label}
                  grid={s.grid && GRID_SHAPES.includes(fig.shape) ? s.grid : undefined}
                  ariaLabel={`Gambar langkah ${i + 1}${s.highlight.length ? `: bagian yang disorot ${s.highlight.map(partName).join(', ')}` : ''}${s.grid ? `, dibagi ${s.grid.cols} × ${s.grid.rows} petak` : ''}`}
                  className="mx-auto mt-2 max-w-[280px]"
                />
              )}
              {fig && s.grid && GRID_SHAPES.includes(fig.shape) && (
                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                  {s.grid.cols} × {s.grid.rows} = {s.grid.cols * s.grid.rows} petak
                </p>
              )}
            </li>
          ))}
        </ol>
        {!allOpen ? (
          <button type="button" className="btn-secondary w-full" onClick={() => setOpened((n) => n + 1)}>
            Buka langkah berikutnya ({opened}/{solution.steps.length})
          </button>
        ) : !showAnswer ? (
          <button type="button" className="btn-primary w-full" onClick={() => setShowAnswer(true)}>
            Lihat jawaban akhir
          </button>
        ) : null}
      </section>

      {showAnswer && (
        <section className="card animate-fade-up space-y-2 ring-2 ring-brand-200">
          <h2 className="font-bold">✅ Jawaban akhir</h2>
          <p className="text-lg font-bold">
            <MathText text={solution.finalAnswer} />
          </p>
          {solution.check && (
            <p className="text-sm">
              <span className="font-bold">Cek kewajaran: </span>
              <MathText text={solution.check} />
            </p>
          )}
          <SpeakButton text={`Jawaban akhir: ${solution.finalAnswer}. ${solution.check}`} />
          <p className="rounded-xl bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            ⚠️ Pembahasan ini dibuat AI dan bisa keliru. Periksa lagi setiap langkahnya. Kalau ada yang janggal, tanyakan ke gurumu.
          </p>
        </section>
      )}

      {showAnswer && <ReflectionCard activity="Foto Soal" score={null} suggested={['evidence', 'analyze', 'precise']} />}
    </div>
  );
}

export default function PhotoSolvePage() {
  const aiEnabled = useSettings((s) => s.aiTutor);
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<PhotoParse | null>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setResult(null);
    try {
      setImage(await compressPhoto(file));
      setStatus('ready');
    } catch {
      setStatus('error');
      setMessage('Foto tidak bisa dibuka. Coba ambil foto lagi.');
    }
  };

  const send = async () => {
    if (!image) return;
    setStatus('loading');
    const r = await solvePhoto(image);
    if (r.ok) {
      setResult(r.result);
      setStatus('done');
    } else {
      setMessage(r.message);
      setStatus('error');
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setStatus('idle');
    if (camera.current) camera.current.value = '';
    if (gallery.current) gallery.current.value = '';
  };

  if (!aiEnabled) {
    return (
      <Page title="Foto Soal" back>
        <div className="card space-y-2">
          <p>Foto Soal memakai AI Beru, yang sedang dimatikan di Pengaturan.</p>
          <Link to="/pengaturan" className="btn-primary inline-flex">
            Buka Pengaturan
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Foto Soal" back>
      <div className="space-y-4">
        {status !== 'done' && (
          <section className="card space-y-3">
            <p className="font-bold">📸 Foto soal segiempat, Beru bantu menguraikan langkahnya.</p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
              <li>Foto satu soal saja, lurus dan terang.</li>
              <li>Jangan ikut memotret nama, wajah, atau data pribadi.</li>
            </ul>
            <input ref={camera} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <input ref={gallery} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="btn-primary" onClick={() => camera.current?.click()} disabled={status === 'loading'}>
                📷 Ambil foto
              </button>
              <button type="button" className="btn-secondary" onClick={() => gallery.current?.click()} disabled={status === 'loading'}>
                🖼️ Dari galeri
              </button>
            </div>
          </section>
        )}

        {image && status !== 'done' && (
          <section className="card space-y-3">
            <img src={image} alt="Foto soal yang dipilih" className="max-h-72 w-full rounded-2xl object-contain" />
            <button type="button" className="btn-primary w-full" onClick={send} disabled={status === 'loading'}>
              {status === 'loading' ? 'Beru sedang membaca soal…' : 'Kirim ke Beru'}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">Foto dikirim sekali ke AI untuk dibaca dan tidak disimpan.</p>
          </section>
        )}

        {status === 'error' && (
          <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950 dark:text-rose-200">
            {message}
          </p>
        )}

        {status === 'done' && result?.kind === 'unreadable' && (
          <p role="alert" className="card text-sm">Beru belum bisa membaca soalnya. Coba foto ulang lebih dekat, lurus, dan terang.</p>
        )}
        {status === 'done' && result?.kind === 'off-topic' && (
          <div className="card space-y-1 text-sm">
            <p className="font-bold">Soal ini bukan tentang segiempat.</p>
            <p>Beru hanya membahas persegi, persegi panjang, jajargenjang, belah ketupat, layang-layang, dan trapesium.</p>
          </div>
        )}
        {status === 'done' && result?.kind === 'solution' && <Solution solution={result.solution} />}

        {status === 'done' && (
          <button type="button" className="btn-ghost w-full" onClick={reset}>
            📷 Foto soal lain
          </button>
        )}
      </div>
    </Page>
  );
}
