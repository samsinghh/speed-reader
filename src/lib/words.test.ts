import { describe, expect, it } from "vitest";
import { getAnchorIndex, msPerWord, parseWords } from "./words";

describe("parseWords", () => {
  it("splits on whitespace", () => {
    expect(parseWords("the quick brown fox")).toEqual([
      "the",
      "quick",
      "brown",
      "fox",
    ]);
  });

  it("ignores extra whitespace, tabs, and newlines", () => {
    expect(parseWords("  hello   world \n\t foo  ")).toEqual([
      "hello",
      "world",
      "foo",
    ]);
  });

  it("preserves punctuation attached to words", () => {
    expect(parseWords("Hello, world! It's me.")).toEqual([
      "Hello,",
      "world!",
      "It's",
      "me.",
    ]);
  });

  it("returns an empty array for empty or whitespace-only text", () => {
    expect(parseWords("")).toEqual([]);
    expect(parseWords("   \n  ")).toEqual([]);
  });
});

describe("getAnchorIndex", () => {
  it("highlights the first letter for length 1-2", () => {
    expect(getAnchorIndex("a")).toBe(0);
    expect(getAnchorIndex("to")).toBe(0);
  });

  it("highlights the second letter for length 3-5", () => {
    expect(getAnchorIndex("cat")).toBe(1);
    expect(getAnchorIndex("brown")).toBe(1);
  });

  it("highlights the third letter for length 6-8", () => {
    expect(getAnchorIndex("purple")).toBe(2);
    expect(getAnchorIndex("elephant")).toBe(2);
  });

  it("highlights the fourth letter for length 9+", () => {
    expect(getAnchorIndex("wonderful")).toBe(3);
    expect(getAnchorIndex("extraordinary")).toBe(3);
  });

  it("does not let leading punctuation break the highlight", () => {
    expect(getAnchorIndex('"quick')).toBe(2);
    expect(getAnchorIndex("(hello)")).toBe(2);
  });

  it("ignores trailing punctuation when sizing the word", () => {
    expect(getAnchorIndex("world!")).toBe(1);
  });

  it("returns 0 for words with no letters or numbers", () => {
    expect(getAnchorIndex("...")).toBe(0);
    expect(getAnchorIndex("")).toBe(0);
  });
});

describe("msPerWord", () => {
  it("computes 60000 / wpm", () => {
    expect(msPerWord(300)).toBe(200);
    expect(msPerWord(100)).toBe(600);
    expect(msPerWord(1000)).toBe(60);
  });
});
