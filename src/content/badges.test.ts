import { describe, expect, it } from 'vitest';
import { BADGES, type BadgeContext, unlockedBadges } from './badges';
import { PREP_CARDS, SHAPE_ORDER } from './shapes';

const empty: BadgeContext = { shapes: {}, literacy: {}, labVisited: [], detectiveSolved: 0 };
const ids = (c: BadgeContext) => unlockedBadges(c).map((b) => b.id);

describe('stickers', () => {
  it('have unique ids', () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
  });

  it('nothing is unlocked at the start', () => {
    expect(ids(empty)).toEqual([]);
  });

  it('unlock from learning behaviour', () => {
    const c: BadgeContext = {
      ...empty,
      shapes: { prep: { cardsSeen: PREP_CARDS.map((p) => p.id), bestScore: 0, practiced: false }, rhombus: { cardsSeen: [], bestScore: 80, practiced: true } },
      labVisited: ['square', 'rectangle', 'kite', 'rhombus', 'free'],
      detectiveSolved: 3,
      literacy: { 'ML-1': { best: 6 }, 'ML-2': { best: 6 }, 'ML-3': { best: 6 }, 'ML-4': { best: 2 } },
    };
    expect(ids(c).sort()).toEqual(['ahli-rhombus', 'bintang-literasi', 'detektif-hebat', 'penjelajah-lab', 'siap-berangkat'].sort());
  });

  it('Raja Segiempat needs every expert sticker', () => {
    const shapes = Object.fromEntries(SHAPE_ORDER.map((s) => [s, { cardsSeen: [], bestScore: 100, practiced: true }]));
    expect(ids({ ...empty, shapes })).toContain('raja-segiempat');
    const missingOne = { ...shapes, kite: { cardsSeen: [], bestScore: 70, practiced: true } };
    expect(ids({ ...empty, shapes: missingOne })).not.toContain('raja-segiempat');
  });
});
