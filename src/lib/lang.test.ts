import { expect, test } from "vitest";

import {
  DEFAULT_LANG,
  isLang,
  langFromPath,
  preferredLang,
  storedLang,
  storeLang,
  stripLang,
} from "./lang";

test("isLang narrows known codes only", () => {
  expect(isLang("fi")).toBe(true);
  expect(isLang("en")).toBe(true);
  expect(isLang("de")).toBe(false);
  expect(isLang("")).toBe(false);
  expect(isLang(undefined)).toBe(false);
});

test("stripLang removes the language segment", () => {
  expect(stripLang("/fi/guide")).toBe("/guide");
  expect(stripLang("/en")).toBe("");
  expect(stripLang("/guide")).toBe("/guide");
});

test("langFromPath defaults unknown paths to the default tree", () => {
  expect(langFromPath("/fi/rules")).toBe("fi");
  expect(langFromPath("/en")).toBe("en");
  expect(langFromPath("/")).toBe(DEFAULT_LANG);
  expect(langFromPath("/rules")).toBe(DEFAULT_LANG);
});

// Swap in a Map-backed localStorage; node has none of its own.
function withStorage(run: () => void, seed?: [string, string]): void {
  const map = new Map<string, string>(seed ? [seed] : []);
  const original = (globalThis as Record<string, unknown>).localStorage;
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
  };
  try {
    run();
  } finally {
    (globalThis as Record<string, unknown>).localStorage = original;
  }
}

test("storeLang persists the choice and storedLang reads it back", () => {
  withStorage(() => {
    expect(storedLang()).toBeNull();
    storeLang("en");
    expect(storedLang()).toBe("en");
    storeLang("fi");
    expect(storedLang()).toBe("fi");
  });
});

test("storedLang ignores values that are not a language", () => {
  withStorage(() => {
    expect(storedLang()).toBeNull();
  }, ["lang", "enk"]);
});

test("storage helpers survive a missing localStorage", () => {
  delete (globalThis as Record<string, unknown>).localStorage;
  expect(() => storeLang("en")).not.toThrow();
  expect(storedLang()).toBeNull();
});

test("preferredLang lets tree paths win over the remembered language", () => {
  withStorage(() => {
    expect(preferredLang("/fi/rules")).toBe("fi");
    expect(preferredLang("/en/broken")).toBe("en");
  }, ["lang", "fi"]);
});

test("preferredLang renders language-less paths in the remembered language", () => {
  withStorage(() => {
    expect(preferredLang("/nothere")).toBe("en");
    expect(preferredLang("/")).toBe("en");
  }, ["lang", "en"]);
});

test("preferredLang falls back to the default tree without a stored choice", () => {
  withStorage(() => {
    expect(preferredLang("/nothere")).toBe(DEFAULT_LANG);
    expect(preferredLang("/")).toBe(DEFAULT_LANG);
  });
  withStorage(() => {
    expect(preferredLang("/nothere")).toBe(DEFAULT_LANG);
  }, ["lang", "enk"]);
});

test("preferredLang is purely URL-derived without localStorage (server)", () => {
  delete (globalThis as Record<string, unknown>).localStorage;
  expect(preferredLang("/nothere")).toBe(DEFAULT_LANG);
  expect(preferredLang("/en/broken")).toBe("en");
});
