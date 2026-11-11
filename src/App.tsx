import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BottomNav } from './components/ui/Layout';
import { useSettings } from './store/settingsStore';
import HomePage from './pages/HomePage';
import WelcomePage from './pages/WelcomePage';
import SceneBackground from './components/ui/SceneBackground';
import BadgeToast from './components/ui/BadgeToast';
import { useProfile } from './store/profileStore';

// Lazy-load everything except the home page to keep the first load small (NFR03/NFR04).
const ShapePage = lazy(() => import('./pages/ShapePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const LabPage = lazy(() => import('./pages/LabPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const DetectivePage = lazy(() => import('./pages/DetectivePage'));
const SummaryPage = lazy(() => import('./pages/SummaryPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LiteracyListPage = lazy(() => import('./pages/LiteracyListPage'));
const LiteracyTaskPage = lazy(() => import('./pages/LiteracyTaskPage'));
const StickersPage = lazy(() => import('./pages/StickersPage'));
const ResearchPage = lazy(() => import('./pages/ResearchPage'));
const ResearchTestPage = lazy(() => import('./pages/ResearchTestPage'));
const SurveyPage = lazy(() => import('./pages/SurveyPage'));

function useApplySettings() {
  const { theme, fontScale, reduceMotion } = useSettings();
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => root.classList.toggle('dark', theme === 'dark' || (theme === 'system' && media.matches));
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  }, [fontScale]);
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.toggle('reduce-motion', reduceMotion || prefersReduced);
  }, [reduceMotion]);
}

export default function App() {
  useApplySettings();
  const hasName = useProfile((s) => s.name.length > 0);
  // First visit: ask for the student's name and class before anything else.
  if (!hasName)
    return (
      <>
        <SceneBackground />
        <WelcomePage />
      </>
    );
  return (
    <HashRouter>
      <SceneBackground />
      <Suspense fallback={<p className="p-8 text-center text-slate-500">Memuat…</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bangun/:id" element={<ShapePage />} />
          <Route path="/belajar/:id" element={<LessonPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/bandingkan" element={<ComparePage />} />
          <Route path="/latihan/:id" element={<PracticePage />} />
          <Route path="/detektif" element={<DetectivePage />} />
          <Route path="/literasi" element={<LiteracyListPage />} />
          <Route path="/literasi/:id" element={<LiteracyTaskPage />} />
          <Route path="/stiker" element={<StickersPage />} />
          <Route path="/penelitian" element={<ResearchPage />} />
          <Route path="/penelitian/angket" element={<SurveyPage />} />
          <Route path="/penelitian/:kind" element={<ResearchTestPage />} />
          <Route path="/catatan" element={<SummaryPage />} />
          <Route path="/progres" element={<ProgressPage />} />
          <Route path="/pengaturan" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <BottomNav />
      <BadgeToast />
    </HashRouter>
  );
}
