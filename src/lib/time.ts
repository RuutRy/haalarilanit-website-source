import { event } from "./data";

// Builds the event time line from the event data:
//   to 19.11. klo 15:00 - su 22.11.2026 klo 12:00
// Weekdays come from Intl (localized), the words around the times are
// translations (at_start / at_end), everything else is data-driven.
export function formatEventTime(lang: string, atStart: string, atEnd: string): string {
  const two = (n: number) => String(n).padStart(2, "0");

  const date = (d: Date, withYear: boolean) =>
    `${two(d.getDate())}.${two(d.getMonth() + 1)}${withYear ? `.${d.getFullYear()}` : "."}`;

  const time = (d: Date) => `${two(d.getHours())}:${two(d.getMinutes())}`;

  const weekday = (d: Date) => new Intl.DateTimeFormat(lang, { weekday: "short" }).format(d);

  const { start, end } = event;

  return `${weekday(start)} ${date(start, false)} ${atStart} ${time(start)} - ${weekday(end)} ${date(end, true)} ${atEnd} ${time(end)}`;
}
