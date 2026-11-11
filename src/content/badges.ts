/**
 * Collectible stickers (lencana). Each one rewards a learning behaviour, not just a score,
 * so they encourage finishing materials, exploring the Lab, and reasoning (Detektif).
 */
import type { LabShapeId, ShapeId } from '../types';
import type { MascotKind } from '../components/ui/Mascot';
import { PREP_CARDS, SHAPES, SHAPE_ORDER, SHAPE_THEME } from './shapes';
import { LITERACY_TASKS } from './literacy';

export interface BadgeContext {
  shapes: Partial<Record<ShapeId | 'prep' | 'mixed', { cardsSeen: string[]; bestScore: number; practiced: boolean }>>;
  literacy: Record<string, { best: number }>;
  labVisited: string[];
  detectiveSolved: number;
}

export interface Badge {
  id: string;
  title: string;
  /** How to get it (shown while locked). */
  how: string;
  color: string;
  /** Shape drawn on the sticker, or a mascot. */
  shape?: LabShapeId;
  mascot?: MascotKind;
  check: (c: BadgeContext) => boolean;
}

export const EXPERT_SCORE = 80;

const expertBadges: Badge[] = SHAPE_ORDER.map((id) => ({
  id: `ahli-${id}`,
  title: `Ahli ${SHAPES[id].name}`,
  how: `Dapatkan skor ≥ ${EXPERT_SCORE} di Latihan ${SHAPES[id].name}.`,
  color: SHAPE_THEME[id].hex,
  shape: SHAPES[id].labShape,
  check: (c) => (c.shapes[id]?.bestScore ?? 0) >= EXPERT_SCORE,
}));

export const BADGES: Badge[] = [
  {
    id: 'siap-berangkat',
    title: 'Siap Berangkat',
    how: 'Baca semua kartu Persiapan.',
    color: '#f43f5e',
    mascot: 'bear',
    check: (c) => (c.shapes.prep?.cardsSeen.length ?? 0) >= PREP_CARDS.length,
  },
  ...expertBadges,
  {
    id: 'penjelajah-lab',
    title: 'Penjelajah Lab',
    how: 'Buka Lab untuk 5 bangun yang berbeda.',
    color: '#0ea5e9',
    mascot: 'bunny',
    check: (c) => c.labVisited.length >= 5,
  },
  {
    id: 'detektif-hebat',
    title: 'Detektif Hebat',
    how: 'Pecahkan 3 kasus Detektif dengan benar.',
    color: '#8b5cf6',
    mascot: 'cat',
    check: (c) => c.detectiveSolved >= 3,
  },
  {
    id: 'juara-campuran',
    title: 'Juara Campuran',
    how: `Dapatkan skor ≥ ${EXPERT_SCORE} di Latihan Campuran.`,
    color: '#f59e0b',
    shape: 'free',
    check: (c) => (c.shapes.mixed?.bestScore ?? 0) >= EXPERT_SCORE,
  },
  {
    id: 'bintang-literasi',
    title: 'Bintang Literasi',
    how: 'Kumpulkan skor Literasi Matematika minimal 20 dari 24.',
    color: '#eab308',
    mascot: 'bear',
    check: (c) => LITERACY_TASKS.reduce((s, t) => s + (c.literacy[t.id]?.best ?? 0), 0) >= 20,
  },
  {
    id: 'raja-segiempat',
    title: 'Raja Segiempat',
    how: 'Kumpulkan keenam stiker Ahli bangun.',
    color: '#15803d',
    shape: 'square',
    check: (c) => expertBadges.every((b) => b.check(c)),
  },
];

export const unlockedBadges = (c: BadgeContext): Badge[] => BADGES.filter((b) => b.check(c));
