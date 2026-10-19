import { useState, useEffect, useRef, useCallback } from 'react';
import { NewsLanguage } from '../types/news.ts';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      // Cancel any ongoing speech on mount/unmount
      window.speechSynthesis.cancel();
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text: string, language: NewsLanguage = 'hi') => {
      if (!supported || typeof window === 'undefined') return;

      window.speechSynthesis.cancel();

      // Clean text of non-printable items
      const cleanText = text
        .replace(/[#*`_~[\]()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;
      utterance.pitch = 1.0;

      // Select best voice for language
      const voices = window.speechSynthesis.getVoices();
      if (language === 'hi') {
        const hindiVoice = voices.find(
          (v) => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi')
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
          utterance.lang = hindiVoice.lang;
        } else {
          utterance.lang = 'hi-IN';
        }
      } else {
        const englishVoice =
          voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
          voices.find((v) => v.lang.toLowerCase().startsWith('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
          utterance.lang = englishVoice.lang;
        } else {
          utterance.lang = 'en-US';
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported, rate]
  );

  const pause = useCallback(() => {
    if (supported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [supported]);

  const resume = useCallback(() => {
    if (supported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [supported]);

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [supported]);

  const changeRate = useCallback(
    (newRate: number) => {
      setRate(newRate);
      if (isSpeaking && utteranceRef.current) {
        // restart with new rate if currently speaking
        // stop and notify
      }
    },
    [isSpeaking]
  );

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    rate,
    changeRate,
    supported,
  };
}
