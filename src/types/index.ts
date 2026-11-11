import type { Quad } from '../lib/geometry/vector';

/** The six quadrilaterals taught in the app. */
export type ShapeId = 'square' | 'rectangle' | 'parallelogram' | 'rhombus' | 'kite' | 'trapezoid';

export const SHAPE_IDS: ShapeId[] = ['rectangle', 'square', 'parallelogram', 'rhombus', 'kite', 'trapezoid'];

/** Shapes available in the Lab (trapezoid variants + free mode). */
export type LabShapeId = ShapeId | 'trapezoid-isosceles' | 'trapezoid-right' | 'free';

/** Information layers drawn on a figure. */
export type Layer = 'sides' | 'angles' | 'diagonals' | 'symmetry';

/** Parts of a figure that can be emphasised (signaling). */
export type HighlightKey =
  | 'AB'
  | 'BC'
  | 'CD'
  | 'DA'
  | 'AC'
  | 'BD'
  | 'height'
  | 'perimeter'
  | 'area';

/** Text placed directly on a figure (avoids split attention). */
export interface Annotation {
  at: 'AB' | 'BC' | 'CD' | 'DA' | 'AC' | 'BD' | 'height' | 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface FigureSpec {
  shape: LabShapeId;
  quad?: Quad;
  layers?: Layer[];
  highlight?: HighlightKey[];
  annotations?: Annotation[];
  /** Vertex index whose angle (and its supplementary partners) is emphasised. */
  selectedAngle?: number;
  /** Hide the A, B, C, D labels. */
  hideLabels?: boolean;
}

/** A token of a formula; variables can be tapped to highlight part of the figure. */
export interface FormulaToken {
  text: string;
  highlight?: HighlightKey;
}

export interface Formula {
  label: string;
  tokens: FormulaToken[];
}

export interface LessonCard {
  id: string;
  title: string;
  /** At most 40 words (see CLAUDE.md). */
  body: string;
  figure: FigureSpec;
  formulas?: Formula[];
  lab?: { shape: LabShapeId; layers: Layer[] };
}

export type MisconceptionId = 'M01' | 'M02' | 'M03' | 'M04' | 'M05' | 'M06' | 'M07' | 'M08' | 'M09';

export type Concept =
  | 'sides'
  | 'angles'
  | 'diagonals'
  | 'symmetry'
  | 'perimeter'
  | 'area'
  | 'classify'
  | 'word-problem';

/** Fading: worked example → completion problem → independent problem. */
export type Level = 'example' | 'completion' | 'independent';

export interface ChoiceOption {
  id: string;
  text: string;
  feedback: string;
  misconception?: MisconceptionId;
}

export interface WrongAnswer {
  value: number;
  feedback: string;
  misconception?: MisconceptionId;
}

interface QuestionBase {
  id: string;
  shape: ShapeId | 'mixed';
  concept: Concept;
  objective: 'TP1' | 'TP2' | 'TP3' | 'TP4' | 'TP5' | 'TP6';
  level: Level;
  difficulty: 1 | 2 | 3;
  stem: string;
  figure?: FigureSpec;
  story?: {
    known: string[];
    asked: string;
    /** Information from the story for the "pilah informasi" step; `needed: false` = distractor. */
    facts?: { text: string; needed: boolean; why?: string }[];
    /** Wrong options for "Apa yang ditanya?". */
    askedChoices?: string[];
  };
  hints: [string, string, string];
  solutionSteps: string[];
}

export interface ChoiceQuestion extends QuestionBase {
  type: 'multiple-choice';
  options: ChoiceOption[];
  answer: string;
}

export interface MultiSelectQuestion extends QuestionBase {
  type: 'multi-select';
  options: ChoiceOption[];
  answer: string[];
}

export interface NumericQuestion extends QuestionBase {
  type: 'numeric';
  answer: number;
  unit?: 'cm' | 'cm²' | 'm' | 'm²' | '°';
  tolerance?: number;
  wrongAnswers?: WrongAnswer[];
}

export type Question = ChoiceQuestion | MultiSelectQuestion | NumericQuestion;

// ───────────── Mathematical Literacy (staged problems with rubric scoring) ─────────────

export type LiteracyIndicator = 'reasoning' | 'formulating' | 'employing' | 'interpreting';

export interface NumericField {
  kind: 'numeric';
  id: string;
  label: string;
  answer: number;
  unit?: string;
  prefix?: 'Rp';
  tolerance?: number;
  wrongAnswers?: WrongAnswer[];
}

export interface ChoiceField {
  kind: 'choice';
  id: string;
  label: string;
  options: ChoiceOption[];
  answer: string;
}

export type StageField = NumericField | ChoiceField;

/** One "Tahap" of the answer key (kisi-kisi), scored with the rubric's points. */
export interface LiteracyStage {
  tahap: number;
  /** Rubric points for this stage. */
  score: number;
  title: string;
  fields: StageField[];
  hint: string;
  /** Answer-key text shown after the stage is finished. */
  explanation: string[];
}

export interface LiteracyTask {
  id: string;
  no: number;
  indicator: LiteracyIndicator;
  title: string;
  story: string;
  question: string;
  figure?: FigureSpec;
  stages: LiteracyStage[];
  conclusion: string;
}

/** A cell of the shape-property table: true/false or a short text (e.g. a count). */
export type PropertyCell = boolean | string;

export interface PropertyRow {
  id: string;
  aspect: 'sisi' | 'sudut' | 'diagonal' | 'simetri';
  label: string;
  values: Record<ShapeId, PropertyCell>;
}
