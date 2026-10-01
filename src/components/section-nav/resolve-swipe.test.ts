import { describe, expect, it } from "vitest";

import { resolveSwipe } from "./useEdgeSwipe";

const START = { x: 0, y: 500, side: "left" as const };
const CONFIG = { slop: 12, dist: 56 };

describe("resolveSwipe", () => {
  it("returns null below the slop threshold", () => {
    expect(resolveSwipe(START, { x: 3, y: 510 }, CONFIG)).toBeNull();
  });

  it("returns vertical when vertical intent wins - hand back to scrolling", () => {
    expect(resolveSwipe(START, { x: 5, y: 520 }, CONFIG)).toBe("vertical");
  });

  it("returns steer for a horizontal drag still under dist", () => {
    expect(resolveSwipe(START, { x: 20, y: 500 }, CONFIG)).toBe("steer");
  });

  it("returns commit past dist", () => {
    expect(resolveSwipe(START, { x: 60, y: 500 }, CONFIG)).toBe("commit");
  });

  it("lets horizontal intent win over vertical drift when dx dominates", () => {
    expect(resolveSwipe(START, { x: 60, y: 520 }, CONFIG)).toBe("commit");
  });
});
