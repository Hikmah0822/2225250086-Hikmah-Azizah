/**
 * "Bacakan soal" (EL05): read text aloud in Indonesian.
 * - Android app: native text-to-speech via @capacitor-community/text-to-speech.
 * - Browser: the Web Speech API.
 * Math symbols are turned into words first so they are read correctly.
 */
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

/** Turn math notation into spoken Indonesian. Pure function (unit-tested). */
export function toSpeech(text: string): string {
  return (
    text
      // Money: Rp1.350.000 → 1.350.000 rupiah (read as a number, not "R P")
      .replace(/Rp\s?(\d[\d.,]*)/g, (_m, n: string) => `${n.replace(/\./g, '')} rupiah`)
      .replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2')
      .replace(/cm²/g, ' sentimeter persegi')
      .replace(/m²/g, ' meter persegi')
      .replace(/(\d)\s?cm\b/g, '$1 sentimeter')
      .replace(/(\d)\s?m\b/g, '$1 meter')
      .replace(/(\d)\s?kg\b/g, '$1 kilogram')
      .replace(/∠\s?([A-Z]{1,3})/g, 'sudut $1 ')
      .replace(/(\d)\s?°/g, '$1 derajat')
      .replace(/°/g, ' derajat')
      .replace(/½/g, ' setengah ')
      .replace(/×/g, ' kali ')
      .replace(/(\d)\s?:\s?(\d)/g, '$1 dibagi $2')
      .replace(/(\s)−(\s)|(\s)-(\s)/g, ' dikurangi ')
      .replace(/\+/g, ' tambah ')
      .replace(/=/g, ' sama dengan ')
      .replace(/≈/g, ' kira-kira ')
      .replace(/≥/g, ' paling sedikit ')
      .replace(/∥/g, ' sejajar ')
      .replace(/⊥/g, ' tegak lurus ')
      .replace(/d₁/g, 'd satu')
      .replace(/d₂/g, 'd dua')
      .replace(/…/g, ' titik-titik ')
      .replace(/(\d),(\d)/g, '$1 koma $2')
      // Segment names like AB, AC, BD: spell them out (A B)
      .replace(/\b([A-D])([A-D])\b/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

let utterance: SpeechSynthesisUtterance | null = null;

export const speechSupported = (): boolean =>
  Capacitor.isNativePlatform() || (typeof window !== 'undefined' && 'speechSynthesis' in window);

export async function speak(text: string, onEnd?: () => void): Promise<void> {
  const spoken = toSpeech(text);
  if (Capacitor.isNativePlatform()) {
    try {
      await TextToSpeech.stop();
      await TextToSpeech.speak({ text: spoken, lang: 'id-ID', rate: 0.95, category: 'playback' });
    } finally {
      onEnd?.();
    }
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  utterance = new SpeechSynthesisUtterance(spoken);
  utterance.lang = 'id-ID';
  utterance.rate = 0.95;
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('id'));
  if (voice) utterance.voice = voice;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  synth.speak(utterance);
}

export async function stopSpeaking(): Promise<void> {
  if (Capacitor.isNativePlatform()) await TextToSpeech.stop();
  else window.speechSynthesis?.cancel();
}
