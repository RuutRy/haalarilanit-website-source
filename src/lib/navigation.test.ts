import { describe, expect, it } from "vitest";

import { isActiveLink, resolveLangTarget } from "./navigation";

describe("isActiveLink", () => {
  it("matches the bare lang tree on the root link only", () => {
    expect(isActiveLink("/fi", "/$lang")).toBe(true);
    expect(isActiveLink("/fi/", "/$lang")).toBe(true);
    expect(isActiveLink("/fi/rules", "/$lang")).toBe(false);
  });

  it("matches section links by subtree prefix", () => {
    expect(isActiveLink("/fi/rules", "/$lang/rules")).toBe(true);
    expect(isActiveLink("/fi/rules/", "/$lang/rules")).toBe(true);
    expect(isActiveLink("/fi/guide", "/$lang/rules")).toBe(false);
  });
});

describe("resolveLangTarget", () => {
  it("keeps tails that exist in both trees", () => {
    expect(resolveLangTarget("/fi/rules")).toBe("/rules");
    expect(resolveLangTarget("/en/guide")).toBe("/guide");
  });

  it("normalizes trailing slashes from directory-style hosts", () => {
    expect(resolveLangTarget("/fi/rules/")).toBe("/rules");
    expect(resolveLangTarget("/fi/")).toBe("");
  });

  it("falls back to the tree root for unknown tails", () => {
    expect(resolveLangTarget("/fi/not-found")).toBe("");
    expect(resolveLangTarget("/fi")).toBe("");
  });
});
