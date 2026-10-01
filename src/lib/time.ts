import { event } from "./data";

const pad = (n: number) => n.toString().padStart(2, "0");

// Builds the event time line from the event data:
//   to 19.11. klo 15:00 - su 22.11.2026 klo 12:00
// Weekdays come from Intl (localized), the words around the times are
// translations (atStart / atEnd). The start year shows only when it
// differs from the end year.
export function formatEventTime(lang: string, atStart: string, atEnd: string): string {
  const { start, end } = event;

  const formatSingle = (date: Date, showYear: boolean, atWord: string): string => {
    const weekday = new Intl.DateTimeFormat(lang, { weekday: "short" }).format(date);
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const dateStr = showYear ? `${day}.${month}.${year}` : `${day}.${month}.`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${weekday} ${dateStr} ${atWord} ${timeStr}`;
  };

  const showStartYear = start.getFullYear() !== end.getFullYear();

  const startStr = formatSingle(start, showStartYear, atStart);
  const endStr = formatSingle(end, true, atEnd);

  return `${startStr} - ${endStr}`;
}

// One-off date in the site's format: 03.10.2026 klo 12 (lang is
// reserved for future localized variants; the numeric format is
// language-neutral).
export function formatSingleDate(date: Date, atWord: string): string {
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return `${day}.${month}.${year} ${atWord} ${timeStr}`;
}
