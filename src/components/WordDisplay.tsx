import { useMemo } from "react";
import { getAnchorIndex } from "../lib/words";

interface WordDisplayProps {
  word: string;
}

export function WordDisplay({ word }: WordDisplayProps) {
  const parts = useMemo(() => {
    const anchor = getAnchorIndex(word);
    return {
      before: word.slice(0, anchor),
      anchor: word.slice(anchor, anchor + 1),
      after: word.slice(anchor + 1),
    };
  }, [word]);

  return (
    <div className="pivot" aria-live="polite" aria-label={word}>
      <span className="pivot__side pivot__side--before">{parts.before}</span>
      <span className="pivot__anchor">{parts.anchor}</span>
      <span className="pivot__side pivot__side--after">{parts.after}</span>
    </div>
  );
}
