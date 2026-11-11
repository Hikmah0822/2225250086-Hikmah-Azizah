/**
 * Student profile (name + class) used only to greet the student by name.
 * Stored on this device only (localStorage); never sent anywhere (CLAUDE.md §9).
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const NAME_MAX = 40;
export const CLASS_MAX = 12;

interface ProfileState {
  name: string;
  className: string;
  save: (name: string, className: string) => void;
  clear: () => void;
}

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      className: '',
      save: (name, className) => set({ name: cleanName(name), className: className.trim().slice(0, CLASS_MAX) }),
      clear: () => set({ name: '', className: '' }),
    }),
    { name: 'segiempatku-profile', version: 1 },
  ),
);

/** Collapse spaces and limit length. */
export function cleanName(name: string): string {
  return name.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX);
}

/** First word of the name, for a friendly greeting ("Hai, Budi!"). */
export function firstName(name: string): string {
  return cleanName(name).split(' ')[0] ?? '';
}
