/** Research data (pretes, postes, angket). Stored on this device only until the student exports it. */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SurveyResult, TestResult } from '../lib/research';

interface ResearchState {
  pre?: TestResult;
  post?: TestResult;
  survey?: SurveyResult;
  savePre: (r: TestResult) => void;
  savePost: (r: TestResult) => void;
  saveSurvey: (r: SurveyResult) => void;
  reset: () => void;
}

export const useResearch = create<ResearchState>()(
  persist(
    (set) => ({
      savePre: (pre) => set({ pre }),
      savePost: (post) => set({ post }),
      saveSurvey: (survey) => set({ survey }),
      reset: () => set({ pre: undefined, post: undefined, survey: undefined }),
    }),
    { name: 'segiempatku-research', version: 1 },
  ),
);
