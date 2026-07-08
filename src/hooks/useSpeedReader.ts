import { useCallback, useEffect, useRef, useState } from "react";
import { msPerWord, parseWords } from "../lib/words";

export interface SpeedReader {
  words: string[];
  index: number;
  isPlaying: boolean;
  currentWord: string;
  hasText: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  restart: () => void;
  next: () => void;
  prev: () => void;
}

export function useSpeedReader(text: string, wpm: number): SpeedReader {
  const [words, setWords] = useState<string[]>(() => parseWords(text));
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wpmRef = useRef(wpm);
  wpmRef.current = wpm;

  useEffect(() => {
    setWords(parseWords(text));
    setIndex(0);
    setIsPlaying(false);
  }, [text]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (index >= words.length - 1) {
      setIsPlaying(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, words.length - 1));
    }, msPerWord(wpmRef.current));

    return clearTimer;
  }, [isPlaying, index, words.length, clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  const hasText = words.length > 0;

  const play = useCallback(() => {
    if (words.length === 0) return;
    setIndex((i) => (i >= words.length - 1 ? 0 : i));
    setIsPlaying(true);
  }, [words.length]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const toggle = useCallback(() => {
    setIsPlaying((p) => {
      if (p) return false;
      if (words.length === 0) return false;
      return true;
    });
    setIndex((i) =>
      !isPlaying && i >= words.length - 1 && words.length > 0 ? 0 : i
    );
  }, [isPlaying, words.length]);

  const restart = useCallback(() => {
    setIndex(0);
    setIsPlaying(false);
  }, []);

  const next = useCallback(() => {
    setIsPlaying(false);
    setIndex((i) => Math.min(i + 1, Math.max(words.length - 1, 0)));
  }, [words.length]);

  const prev = useCallback(() => {
    setIsPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  return {
    words,
    index,
    isPlaying,
    currentWord: words[index] ?? "",
    hasText,
    play,
    pause,
    toggle,
    restart,
    next,
    prev,
  };
}
