/** Formula whose variables can be tapped to highlight the matching part of the figure (F05, IL03). */
import type { Formula, HighlightKey } from '../../types';

const COLOR: Partial<Record<HighlightKey, string>> = {
  perimeter: 'text-orange-600 dark:text-orange-400',
  area: 'text-blue-600 dark:text-blue-400',
  height: 'text-emerald-600 dark:text-emerald-400',
  AC: 'text-violet-600 dark:text-violet-400',
  BD: 'text-violet-600 dark:text-violet-400',
};

interface Props {
  formula: Formula;
  active: HighlightKey | null;
  onSelect: (key: HighlightKey | null) => void;
}

export default function InteractiveFormula({ formula, active, onSelect }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-sm font-semibold text-slate-500 dark:text-slate-400">{formula.label}</span>
      <p className="whitespace-nowrap text-xl font-bold" aria-label={`Rumus ${formula.label}`}>
        {formula.tokens.map((t, i) =>
          t.highlight ? (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(active === t.highlight ? null : t.highlight!)}
              className={`min-h-[36px] min-w-[32px] rounded-md px-1 underline decoration-dotted underline-offset-4 ${
                active === t.highlight ? 'bg-amber-200 dark:bg-amber-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              } ${COLOR[t.highlight!] ?? 'text-orange-600 dark:text-orange-400'}`}
              aria-pressed={active === t.highlight}
            >
              {t.text}
            </button>
          ) : (
            <span key={i}>{t.text}</span>
          ),
        )}
      </p>
    </div>
  );
}
