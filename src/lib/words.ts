const ALNUM = /[\p{L}\p{N}]/u;
const ALNUM_RUN = /^[\p{L}\p{N}]+/u;

export function parseWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function getAnchorIndex(word: string): number {
  if (word.length === 0) return 0;

  const start = word.search(ALNUM);
  if (start === -1) return 0;

  const coreMatch = word.slice(start).match(ALNUM_RUN);
  const coreLen = coreMatch ? coreMatch[0].length : 1;

  let offset: number;
  if (coreLen <= 2) offset = 0;
  else if (coreLen <= 5) offset = 1;
  else if (coreLen <= 8) offset = 2;
  else offset = 3;

  return start + Math.min(offset, coreLen - 1);
}

export function msPerWord(wpm: number): number {
  return 60000 / wpm;
}
