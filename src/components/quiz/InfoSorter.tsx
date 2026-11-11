/**
 * "Pilah informasi" for story problems (EL05; Formulating):
 * 1. Tap the information that is NEEDED (distractors are mixed in).
 * 2. Choose what is ASKED.
 * Then the Diketahui/Ditanya summary appears and the student can answer.
 */
import { useMemo, useState } from 'react';
import type { Question } from '../../types';
import { rng } from '../../lib/quiz/twins';

type Story = NonNullable<Question['story']>;

function shuffled<T>(xs: T[], seed: number): T[] {
  const r = rng(seed);
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const seedOf = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export default function InfoSorter({ id, story, onDone }: { id: string; story: Story; onDone: () => void }) {
  const facts = useMemo(() => shuffled(story.facts ?? [], seedOf(id)), [id, story.facts]);
  const askedOptions = useMemo(() => shuffled([story.asked, ...(story.askedChoices ?? [])], seedOf(id) + 1), [id, story]);
  const [picked, setPicked] = useState<string[]>([]);
  const [factTries, setFactTries] = useState(0);
  const [factsOk, setFactsOk] = useState(false);
  const [factFeedback, setFactFeedback] = useState<string[]>([]);
  const [asked, setAsked] = useState<string | null>(null);
  const [askedFeedback, setAskedFeedback] = useState<string | null>(null);
  const [askedOk, setAskedOk] = useState(false);

  const checkFacts = () => {
    const wrong = facts.filter((f) => !f.needed && picked.includes(f.text));
    const missing = facts.filter((f) => f.needed && !picked.includes(f.text));
    if (wrong.length === 0 && missing.length === 0) {
      setFactsOk(true);
      setFactFeedback([]);
      return;
    }
    const tries = factTries + 1;
    setFactTries(tries);
    const msgs = wrong.map((f) => `“${f.text}” tidak dipakai untuk menghitung${f.why ? `: ${f.why}` : '.'}`);
    if (missing.length) msgs.push(`Masih ada ${missing.length} informasi penting yang belum dipilih.`);
    if (tries >= 2) {
      // After two tries, show the answer and move on.
      setPicked(facts.filter((f) => f.needed).map((f) => f.text));
      setFactsOk(true);
      msgs.push('Lihat informasi yang sekarang ditandai: itulah yang diperlukan.');
    }
    setFactFeedback(msgs);
  };

  const checkAsked = (choice: string) => {
    setAsked(choice);
    if (choice === story.asked) {
      setAskedOk(true);
      setAskedFeedback(null);
      onDone();
    } else setAskedFeedback('Baca lagi kalimat pertanyaannya. Apa yang diminta untuk dihitung?');
  };

  return (
    <section className="space-y-3 rounded-2xl bg-gradient-to-br from-sky-50 to-amber-50 p-3 ring-1 ring-sky-100 dark:from-slate-900 dark:to-slate-900 dark:ring-slate-700" aria-label="Pilah informasi soal cerita">
      <p className="text-sm font-extrabold text-sky-900 dark:text-sky-200">🧩 Langkah 1: Pilih informasi yang DIPERLUKAN</p>
      <div className="flex flex-wrap gap-2">
        {facts.map((f) => {
          const on = picked.includes(f.text);
          const reveal = factsOk;
          return (
            <button
              key={f.text}
              type="button"
              disabled={factsOk}
              aria-pressed={on}
              onClick={() => setPicked((p) => (on ? p.filter((x) => x !== f.text) : [...p, f.text]))}
              className={`min-h-[40px] rounded-full px-3 text-left text-sm font-semibold ring-1 transition active:scale-95 ${
                reveal
                  ? f.needed
                    ? 'bg-emerald-500 text-white ring-emerald-500'
                    : 'bg-slate-100 text-slate-400 line-through ring-slate-200 dark:bg-slate-800'
                  : on
                    ? 'bg-sky-500 text-white ring-sky-500'
                    : 'bg-white text-slate-700 ring-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700'
              }`}
            >
              {reveal && f.needed ? '✓ ' : on ? '● ' : ''}
              {f.text}
            </button>
          );
        })}
      </div>
      {factFeedback.length > 0 && (
        <div role="status" className="space-y-1 rounded-lg bg-amber-50 p-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {factFeedback.map((m) => (
            <p key={m}>{m}</p>
          ))}
        </div>
      )}
      {!factsOk && (
        <button type="button" className="btn-primary w-full" disabled={picked.length === 0} onClick={checkFacts}>
          Periksa informasi
        </button>
      )}

      {factsOk && (
        <div className="animate-fade-up space-y-2">
          <p className="text-sm font-extrabold text-amber-900 dark:text-amber-200">❓ Langkah 2: Apa yang DITANYA?</p>
          <div className="grid gap-2">
            {askedOptions.map((o) => (
              <button
                key={o}
                type="button"
                disabled={askedOk}
                onClick={() => checkAsked(o)}
                className={`min-h-[44px] rounded-xl px-3 text-left text-sm font-semibold ring-1 transition active:scale-[0.98] ${
                  askedOk && o === story.asked
                    ? 'bg-emerald-500 text-white ring-emerald-500'
                    : asked === o
                      ? 'bg-amber-100 ring-amber-400 dark:bg-amber-900'
                      : 'bg-white ring-slate-300 dark:bg-slate-900 dark:ring-slate-700'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          {askedFeedback && <p role="status" className="rounded-lg bg-amber-50 p-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">{askedFeedback}</p>}
        </div>
      )}
    </section>
  );
}
