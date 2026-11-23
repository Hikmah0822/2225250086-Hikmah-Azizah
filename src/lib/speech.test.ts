import { describe, expect, it } from 'vitest';
import { toSpeech } from './speech';

describe('toSpeech', () => {
  it('reads angles and degrees', () => {
    expect(toSpeech('Pada jajargenjang ABCD, ∠A = 65°.')).toBe('Pada jajargenjang ABCD, sudut A sama dengan 65 derajat.');
  });
  it('reads units and multiplication', () => {
    expect(toSpeech('12 cm × 5 cm')).toBe('12 sentimeter kali 5 sentimeter');
    expect(toSpeech('96 cm²')).toBe('96 sentimeter persegi');
    expect(toSpeech('Kebun 12 m × 8 m')).toBe('Kebun 12 meter kali 8 meter');
  });
  it('reads fractions written with a slash', () => {
    expect(toSpeech('240/7')).toBe('240 per 7');
    expect(toSpeech('1/2 × 8')).toBe('1 per 2 kali 8');
  });
  it('reads rupiah and thousands', () => {
    expect(toSpeech('Rp13.500 per buah')).toBe('13500 rupiah per buah');
    expect(toSpeech('240.000 cm²')).toBe('240000 sentimeter persegi');
  });
  it('reads fractions, decimals and diagonals', () => {
    expect(toSpeech('L = ½ × d₁ × d₂')).toBe('L sama dengan setengah kali d satu kali d dua');
    expect(toSpeech('6,5 cm')).toBe('6 koma 5 sentimeter');
  });
  it('reads division but keeps ordinary colons', () => {
    expect(toSpeech('l = 72 : 9')).toBe('l sama dengan 72 dibagi 9');
    expect(toSpeech('Diketahui: p = 9 cm')).toBe('Diketahui: p sama dengan 9 sentimeter');
  });
  it('spells out segment names', () => {
    expect(toSpeech('AB ∥ DC')).toBe('A B sejajar D C');
  });
});

import { afterEach, beforeEach, vi } from 'vitest';
import { MSG_NO_ID_VOICE, MSG_SILENT, chromeIntentUrl, isSamsungInternet, pickVoice, speakWeb, splitForSpeech } from './speech';

/** Fake Web Speech API that behaves like Chrome on Android. */
class FakeUtterance {
  text: string;
  lang = '';
  voice: SpeechSynthesisVoice | null = null;
  rate = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  constructor(t: string) {
    this.text = t;
  }
}
type Mode = 'ok' | 'no-id-language' | 'silent';
function fakeSynth(mode: Mode) {
  const spoken: FakeUtterance[] = [];
  let justCancelled = false;
  const synth = {
    speaking: false,
    pending: false,
    resume: vi.fn(),
    getVoices: () => [],
    cancel: vi.fn(() => {
      justCancelled = true;
      synth.speaking = false;
      setTimeout(() => (justCancelled = false), 0);
    }),
    speak: vi.fn((u: FakeUtterance) => {
      // Chrome Android bug: an utterance queued in the same tick as cancel() is dropped.
      if (justCancelled) return;
      if (mode === 'silent') return;
      if (mode === 'no-id-language' && u.lang === 'id-ID' && !u.voice) {
        queueMicrotask(() => u.onerror?.({ error: 'language-unavailable' }));
        return;
      }
      spoken.push(u);
      queueMicrotask(() => {
        u.onstart?.();
        u.onend?.();
      });
    }),
  };
  return { synth: synth as unknown as SpeechSynthesis, spoken };
}
const voice = (lang: string, name = 'v', localService = true) => ({ lang, name, localService }) as SpeechSynthesisVoice;
const U = FakeUtterance as unknown as typeof SpeechSynthesisUtterance;

describe('speech helpers', () => {
  it('splits long texts into short pieces without losing words', () => {
    const text = 'Kalimat satu. Kalimat dua? ' + 'kata '.repeat(80);
    const parts = splitForSpeech(text, 60);
    expect(parts.every((p) => p.length <= 60)).toBe(true);
    expect(parts.join(' ').replace(/\s+/g, ' ')).toBe(text.trim().replace(/\s+/g, ' '));
  });
  it('finds Indonesian voices in Android formats (id-ID, id_ID, in-ID)', () => {
    expect(pickVoice([voice('en-US'), voice('id_ID', 'a')])?.name).toBe('a');
    expect(pickVoice([voice('in-ID', 'b')])?.name).toBe('b');
    expect(pickVoice([voice('en-US'), voice('id-ID', 'net', false), voice('id-ID', 'local')])?.name).toBe('local');
    expect(pickVoice([voice('en-US')])).toBeNull();
  });
});

describe('speakWeb on Chrome Android', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('reads every piece with the Indonesian voice', async () => {
    const { synth, spoken } = fakeSynth('ok');
    const onEnd = vi.fn();
    speakWeb(synth, [voice('id_ID', 'id')], 'Kalimat satu. Kalimat dua.', { onEnd }, U, 0);
    await vi.runAllTimersAsync();
    expect(spoken.map((u) => u.text)).toEqual(['Kalimat satu.', 'Kalimat dua.']);
    expect(spoken[0].lang).toBe('id-ID');
    expect(onEnd).toHaveBeenCalled();
  });

  it('does not lose the utterance when something was still speaking (cancel bug)', async () => {
    const { synth, spoken } = fakeSynth('ok');
    (synth as { speaking: boolean }).speaking = true;
    speakWeb(synth, [voice('id-ID')], 'Halo.', {}, U, 0);
    await vi.advanceTimersByTimeAsync(300);
    expect(spoken).toHaveLength(1);
  });

  it('falls back to the default voice when the phone has no Indonesian voice', async () => {
    const { synth, spoken } = fakeSynth('no-id-language');
    const onInfo = vi.fn();
    const onEnd = vi.fn();
    speakWeb(synth, [], 'Halo.', { onInfo, onEnd }, U, 0);
    await vi.runAllTimersAsync();
    expect(onInfo).toHaveBeenCalledWith(MSG_NO_ID_VOICE);
    expect(spoken).toHaveLength(1);
    expect(onEnd).toHaveBeenCalled();
  });

  it('tells the student what to check when no sound starts', async () => {
    const { synth } = fakeSynth('silent');
    const onError = vi.fn();
    speakWeb(synth, [voice('id-ID')], 'Halo.', { onError }, U, 3500);
    await vi.advanceTimersByTimeAsync(4000);
    expect(onError).toHaveBeenCalledWith(MSG_SILENT);
  });
});

describe('Samsung Internet', () => {
  it('is detected from its user agent', () => {
    expect(isSamsungInternet('Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36')).toBe(true);
    expect(isSamsungInternet('Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36')).toBe(false);
  });
  it('builds an Android intent that opens the site in Chrome', () => {
    const u = chromeIntentUrl('https://segiempatku.netlify.app/#/belajar/prep');
    expect(u.startsWith('intent://segiempatku.netlify.app/#Intent;scheme=https;package=com.android.chrome;')).toBe(true);
    expect(u).toContain('S.browser_fallback_url=https%3A%2F%2Fsegiempatku.netlify.app%2F%23%2Fbelajar%2Fprep');
    expect(u.endsWith(';end')).toBe(true);
  });
});
