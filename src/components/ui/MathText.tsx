/** Text with fractions shown stacked (numerator over denominator), as written in math books. */
import { splitMath } from '../../lib/mathText';

export default function MathText({ text }: { text: string }) {
  return (
    <>
      {splitMath(text).map((p, i) =>
        p.kind === 'text' ? (
          <span key={i}>{p.text}</span>
        ) : (
          <span key={i} className="mx-0.5 inline-flex flex-col items-center align-middle text-[0.9em] leading-tight" aria-label={`${p.num} per ${p.den}`} role="math">
            <span aria-hidden className="px-0.5">{p.num}</span>
            <span aria-hidden className="w-full border-t-[1.5px] border-current px-0.5 text-center">{p.den}</span>
          </span>
        ),
      )}
    </>
  );
}
