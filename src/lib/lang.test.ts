import { expect, test } from "vitest";

import { DEFAULT_LANG, isLang, langFromPath, stripLang } from "./lang";

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
