/**
 * RMT: name the thinking action ("fungsi kognitif") the student is using.
 * Tap a tag to see its meaning and an example.
 */
import { useState } from 'react';
import { COGNITIVE_FUNCTIONS, type CognitiveFunctionId } from '../../content/rmt';

export default function CognitiveTags({ ids, label = 'Fungsi berpikir' }: { ids: CognitiveFunctionId[]; label?: string }) {
  const [open, setOpen] = useState<CognitiveFunctionId | null>(null);
  if (ids.length === 0) return null;
  const f = open ? COGNITIVE_FUNCTIONS[open] : null;
  return (
    <div className="space-y-1.5" aria-label={label}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">🧠 {label}:</span>
        {ids.map((id) => (
          <button
            key={id}
            type="button"
            aria-expanded={open === id}
            onClick={() => setOpen(open === id ? null : id)}
            className={`min-h-[32px] rounded-full px-2.5 text-xs font-semibold ring-1 transition ${
              open === id ? 'bg-violet-600 text-white ring-violet-600' : 'bg-violet-50 text-violet-800 ring-violet-200 dark:bg-slate-800 dark:text-violet-200 dark:ring-slate-700'
            }`}
          >
            {COGNITIVE_FUNCTIONS[id].icon} {COGNITIVE_FUNCTIONS[id].name}
          </button>
        ))}
      </div>
      {f && (
        <p role="note" className="animate-fade-up rounded-lg bg-violet-50 p-2 text-sm text-violet-950 dark:bg-slate-800 dark:text-violet-100">
          <b>{f.name}:</b> {f.meaning}
          <br />
          <span className="text-xs text-violet-700 dark:text-violet-300">Contoh: {f.example}</span>
        </p>
      )}
    </div>
  );
}
