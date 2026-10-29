import { event } from "./data";

const pad = (n: number) => n.toString().padStart(2, "0");

// Weekdays come from Intl (varies with runtime ICU); at-words are translations.
// The start year shows only when it differs from the end year.
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

export function formatSingleDate(date: Date, atWord: string): string {
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return `${day}.${month}.${year} ${atWord} ${timeStr}`;
}
