import { describe, expect, it } from 'vitest';
import { QUESTIONS } from '../content/questions';
import { LITERACY_TASKS } from '../content/literacy';
import { DIFFICULTIES, RMT_STAGES, guidedReply, hintLevel, mayExplain } from './tutorPedagogy';
import { buildSystemPrompt, parseReply, validateTutorRequest, type TutorContext } from './tutorPrompt';
import { formatNumber } from './format';

const fromQuestion = (q: (typeof QUESTIONS)[number], attempts = 0, solutionShown = false): TutorContext => ({
  topic: q.shape,
  question: q.stem,
  correctAnswer: q.type === 'numeric' ? String(q.answer) : 'x',
  solutionSteps: q.solutionSteps,
  hints: q.hints,
  attempts,
  solutionShown,
  known: q.story?.known,
  asked: q.story?.asked,
});

describe('hint ladder', () => {
  it('rises one rung per request and after a wrong try', () => {
    const ctx = { attempts: 0, solutionShown: false };
    expect([0, 1, 2, 3].map((n) => hintLevel(ctx, n))).toEqual([1, 2, 3, 3]);
    expect(hintLevel({ attempts: 1, solutionShown: false }, 0)).toBe(2);
  });
  it('gives worked steps (level 4) only after two tries or the solution', () => {
    expect(hintLevel({ attempts: 0, solutionShown: false }, 9)).toBe(3);
    expect(hintLevel({ attempts: 2, solutionShown: false }, 9)).toBe(4);
    expect(hintLevel({ attempts: 0, solutionShown: true }, 9)).toBe(4);
    expect(mayExplain({ attempts: 1, solutionShown: false })).toBe(false);
  });
});

describe('guided mode (offline)', () => {
  it('maps each difficulty to an RMT stage', () => {
    expect(DIFFICULTIES.map((d) => d.stage)).toEqual(RMT_STAGES.map((s) => s.id));
  });

  it('never reveals the final numeric answer before real effort, for every question and difficulty', () => {
    for (const q of QUESTIONS) {
      if (q.type !== 'numeric') continue;
      const ctx = fromQuestion(q);
      const final = [`= ${formatNumber(q.answer, 2)}`, `= ${q.answer}`];
      for (const d of DIFFICULTIES) {
        for (const level of [1, 2, 3] as const) {
          const { text } = guidedReply(ctx, d.id, level);
          for (const f of final) expect(text, `${q.id} ${d.id} L${level}`).not.toContain(f);
        }
      }
    }
  });

  it('keeps replies short (extraneous load)', () => {
    for (const q of QUESTIONS) {
      for (const d of DIFFICULTIES) {
        for (const level of [1, 2, 3] as const) {
          expect(guidedReply(fromQuestion(q), d.id, level).text.split(/\s+/).length, `${q.id} ${d.id}`).toBeLessThanOrEqual(60);
        }
      }
    }
  });

  it('explains official steps at level 4 once allowed', () => {
    const q = QUESTIONS.find((x) => x.id === 'JG-1')!;
    expect(guidedReply(fromQuestion(q, 2), 'konsep', 4).text).toContain(q.solutionSteps[0]);
  });

  it('guides each literacy stage with its own hint', () => {
    for (const task of LITERACY_TASKS) {
      for (const st of task.stages) {
        const ctx: TutorContext = { topic: task.title, question: task.question, correctAnswer: '-', solutionSteps: st.explanation, hints: [st.hint], attempts: 0, solutionShown: false };
        expect(guidedReply(ctx, 'mulai', 2).text).toContain(st.hint);
      }
    }
  });
});

describe('AI prompt follows the same pedagogy', () => {
  const ctx = fromQuestion(QUESTIONS.find((x) => x.id === 'JG-3')!);
  it('includes RMT stages, cognitive load rules, and the current hint level', () => {
    const p = buildSystemPrompt(ctx, { difficulty: 'konsep', level: 4 });
    for (const s of RMT_STAGES) expect(p).toContain(s.name);
    expect(p).toContain('Beban intrinsik (IL)');
    expect(p).toContain('Beban ekstrinsik (EL)');
    expect(p).toContain('Beban germane (GL)');
    // Level is capped at 3 before the student has really tried.
    expect(p).toContain('Tingkat bantuan SEKARANG: 3');
    expect(p).toContain('Aku bingung rumus atau konsepnya');
  });
  it('rejects unknown difficulties', () => {
    const r = validateTutorRequest({ context: ctx, messages: [{ role: 'user', content: 'x' }], guidance: { difficulty: 'hack', level: 4 } });
    expect(r.ok && r.value.guidance).toBeUndefined();
  });
  it('reads the stage line from the reply', () => {
    expect(parseReply('TAHAP: Merencanakan dengan alat berpikir\nRumus apa yang cocok?')).toEqual({ stage: 'rencana', reply: 'Rumus apa yang cocok?' });
    expect(parseReply('Tanpa tahap.')).toEqual({ stage: null, reply: 'Tanpa tahap.' });
  });
});
