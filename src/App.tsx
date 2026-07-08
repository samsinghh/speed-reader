import { useEffect, useState } from "react";
import { WordDisplay } from "./components/WordDisplay";
import { useSpeedReader } from "./hooks/useSpeedReader";

const MIN_WPM = 100;
const MAX_WPM = 1000;
const DEFAULT_WPM = 300;

function clampWpm(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_WPM;
  return Math.min(MAX_WPM, Math.max(MIN_WPM, Math.round(value)));
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

type Screen = "setup" | "reading";

export default function App() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(DEFAULT_WPM);
  const [wpmText, setWpmText] = useState(String(DEFAULT_WPM));
  const [screen, setScreen] = useState<Screen>("setup");

  function setSpeed(next: number) {
    setWpm(next);
    setWpmText(String(next));
  }

  const reader = useSpeedReader(text, wpm);
  const { hasText, play, pause, toggle, restart, next, prev } = reader;

  const wordCount = reader.words.length;
  const estSeconds = wordCount ? Math.round((wordCount * 60) / wpm) : 0;

  function startReading() {
    if (hasText) setScreen("reading");
  }

  useEffect(() => {
    if (screen === "reading") play();
  }, [screen, play]);

  useEffect(() => {
    if (screen !== "reading") return;

    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
        case "ArrowRight":
          e.preventDefault();
          next();
          break;
        case "r":
        case "R":
          e.preventDefault();
          restart();
          break;
        case "Escape":
          e.preventDefault();
          pause();
          setScreen("setup");
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [screen, toggle, prev, next, restart, pause]);

  if (screen === "reading") {
    return (
      <main className="stage" aria-label="Reader">
        <div className="reticle">
          <span className="reticle__rail reticle__rail--top" />
          <span className="reticle__tick reticle__tick--top" />
          <WordDisplay word={reader.currentWord} />
          <span className="reticle__tick reticle__tick--bottom" />
          <span className="reticle__rail reticle__rail--bottom" />
        </div>
      </main>
    );
  }

  return (
    <main className="setup">
      <div className="sheet">
        <section className="block">
          <div className="rowhead">
            <span className="brand">Speed Reader</span>
            <span className="rowhead__count">({wordCount})</span>
          </div>
          <textarea
            className="field"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                startReading();
              }
            }}
            placeholder="paste or type the text you want to speed-read…"
            rows={7}
            autoFocus
          />
        </section>

        <section className="block">
          <div className="rowhead">
            <span>Speed</span>
            <span className="wpm-field">
              <input
                className="wpm-input"
                type="number"
                min={MIN_WPM}
                max={MAX_WPM}
                value={wpmText}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") {
                    setWpmText("");
                    return;
                  }
                  const n = Number(raw);
                  if (Number.isNaN(n)) return;
                  const bounded = Math.min(MAX_WPM, Math.max(0, Math.round(n)));
                  setSpeed(bounded);
                }}
                onBlur={() => setSpeed(clampWpm(Number(wpmText)))}
                aria-label="Words per minute"
              />
              wpm
            </span>
          </div>
          <input
            className="slider"
            type="range"
            min={MIN_WPM}
            max={MAX_WPM}
            step={1}
            value={wpm}
            onChange={(e) => setSpeed(clampWpm(Number(e.target.value)))}
            aria-label="Words per minute"
          />
        </section>

        <div className="actions">
          <button
            type="button"
            className="pill"
            onClick={startReading}
            disabled={!hasText}
          >
            Start Reading ▸
          </button>
          <span className="est">
            {hasText ? (
              <>
                {wordCount} words · {formatDuration(estSeconds)} · ⌘{" "}
                <span className="est__enter">↵</span>
              </>
            ) : (
              "paste text to begin"
            )}
          </span>
        </div>

        <p className="hint">
          space play/pause · ← → step · r restart · esc back
        </p>
      </div>
    </main>
  );
}
