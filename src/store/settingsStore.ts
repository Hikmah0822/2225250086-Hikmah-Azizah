import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
  fontScale: 1 | 1.25;
  theme: 'light' | 'dark' | 'system';
  reduceMotion: boolean;
}

interface SettingsState extends Settings {
  update: (patch: Partial<Settings>) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      fontScale: 1,
      // Bright theme by default; dark mode stays available in Pengaturan.
      theme: 'light',
      reduceMotion: false,
      update: (patch) => set(patch),
    }),
    {
      name: 'segiempatku-settings',
      version: 2,
      // v1 defaulted to "system", which showed the dark theme on phones in dark mode.
      migrate: (persisted, version) => {
        const s = (persisted ?? {}) as Partial<Settings>;
        if (version < 2 && s.theme === 'system') s.theme = 'light';
        return s as SettingsState;
      },
    },
  ),
);
