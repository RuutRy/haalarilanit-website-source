import { expect, test } from "vitest";

import { formatEventTime, formatSingleDate } from "./time";

test("formatSingleDate is language-neutral numeric: 03.10.2026 klo 12:00", () => {
  expect(formatSingleDate(new Date(2026, 9, 3, 12), "klo")).toBe("03.10.2026 klo 12:00");
});

test("formatEventTime elides the start year in the same year, keeps the end year", () => {
  // Weekday tokens come from Intl and vary with the runtime ICU; the
  // numeric date, year elision, at-words and times are deterministic.
  expect(formatEventTime("fi", "klo", "klo")).toMatch(
    /^.{2,3} 19\.11\. klo 15:00 - .{2,3} 22\.11\.2026 klo 12:00$/,
  );
});
