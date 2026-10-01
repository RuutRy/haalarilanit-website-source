import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { event } from "../../lib/data";
import { formatSingleDate } from "../../lib/time";
import { Button } from "../ui/button";

// Locked (muted ghost) until ticket sales open, then live with the shine.
export function TicketButton({ label }: { label: string }) {
  const { t } = useTranslation();
  const [now, setNow] = useState<number | null>(null);

  const open = now !== null && now >= event.ticketSales.getTime();

  // One timer aimed at the sales start; no per-second polling.
  useEffect(() => {
    setNow(Date.now());
    const delay = event.ticketSales.getTime() - Date.now();
    const id = setTimeout(() => setNow(Date.now()), Math.max(0, delay));
    return () => clearTimeout(id);
  }, []);

  if (open) {
    return (
      <Button
        type="submit"
        className="shine-btn h-auto rounded-xl px-12 py-[0.92em] text-[2.4em] text-foreground transition-transform hover:-translate-y-0.5 sm:px-24 sm:py-[0.9em] sm:text-[3em]"
      >
        {label}
      </Button>
    );
  }

  const date = formatSingleDate(event.ticketSales, t("main.time.at_start"));

  return (
    <div className="flex flex-col items-center gap-[0.4em]">
      <Button
        type="submit"
        disabled
        variant="ghost"
        className="h-auto rounded-xl bg-muted px-12 py-[0.9em] text-[1.8em] text-foreground line-through disabled:opacity-100 sm:px-16"
      >
        {label}
      </Button>
      <p className="bg-inline text-[1.6em] text-foreground">{t("main.ticket_opens", { date })}</p>
    </div>
  );
}
