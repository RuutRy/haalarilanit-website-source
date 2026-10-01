import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { event, links, ticketSalesStart } from "../lib/data";
import { useActiveLang } from "../lib/lang";
import { formatEventTime, formatSingleDate } from "../lib/time";
import { Blur } from "./Blur";
import { FlipClock } from "./FlipClock";
import { Logo } from "./media/Logo";
import { Button } from "./ui/button";

// Re-render at the next phase boundary; resyncs on visibility change.
function usePhaseNow() {
  const [now, setNow] = useState(() => Date.now());
  const refresh = useCallback(() => setNow(Date.now()), []);

  useEffect(() => {
    const target =
      now < event.start.getTime() ? event.start : now < event.end.getTime() ? event.end : null;
    if (!target) return;

    const MAX_TIMEOUT = 2_147_483_647; // browser max, ~24.8 days
    const delay = Math.max(0, Math.min(target.getTime() - now + 100, MAX_TIMEOUT));
    const id = setTimeout(refresh, delay);

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [now, refresh]);

  return { now, refresh };
}

// The hero owns the phase clock. Its re-renders only happen at phase
// boundaries, so the rest of the page never re-renders
// because of the clock.
export function Hero() {
  const { t } = useTranslation();
  const lang = useActiveLang();
  const { now, refresh } = usePhaseNow();

  const labels = [t("main.time.d"), t("main.time.h"), t("main.time.m"), t("main.time.s")] as [
    string,
    string,
    string,
    string,
  ];

  const concluded = now >= event.end.getTime();

  return (
    <>
      <Blur className="self-center">
        <Logo data-hero-logo />
      </Blur>

      <Blur className="flex w-full max-w-xl flex-col items-center gap-2">
        {/* Time line is data-driven: weekday + dates + times come from
            event data, the words around them from translations */}
        <h3 className="text-h3-fluid">
          {formatEventTime(lang, t("main.time.at_start"), t("main.time.at_end"))}
        </h3>
        <h3 className="text-h3-fluid">{t("main.time.where")}</h3>
        {concluded ? (
          <div key="concluded" className="motion-safe:animate-pop-in">
            <p className="py-6 text-h2-fluid">{t("event_end.message")}</p>
          </div>
        ) : now >= event.start.getTime() ? (
          <div
            key="running"
            className="motion-safe:animate-pop-in flex flex-col items-center gap-2"
          >
            {/* Event running: started message, amber-toned countdown to
                LAN OFF, with the ends-in label below the clock */}
            <h3 className="text-h3-fluid text-primary">{t("main.time.started")}</h3>
            <FlipClock
              target={event.end}
              startedLabel={t("event_end.message")}
              labels={labels}
              onComplete={refresh}
              tone="end"
            />
            <h3 className="text-h3-fluid text-primary">{t("main.time.endsin")}</h3>
          </div>
        ) : (
          <div key="before" className="motion-safe:animate-pop-in flex flex-col items-center gap-2">
            <FlipClock
              target={event.start}
              startedLabel={t("main.time.started")}
              labels={labels}
              onComplete={refresh}
            />
          </div>
        )}
      </Blur>

      {/* If event link doesn't exist, show a message instead */}
      {!links.ticket && (
        <p className="text-h3-fluid text-primary">{t("main.ticket_not_yet_available")}</p>
      )}

      {/* Before the shop opens the button is a muted ghost with the sales-start date below. */}
      {!concluded && links.ticket && (
        <form action={links.ticket}>
          <TicketButton label={t("main.purchase_button")} />
        </form>
      )}
    </>
  );
}

// Locked (muted ghost) until ticketSalesStart, then live with the shine.
function TicketButton({ label }: { label: string }) {
  const { t } = useTranslation();
  const [now, setNow] = useState<number | null>(null);

  const open = now !== null && now >= ticketSalesStart.getTime();

  useEffect(() => {
    setNow(Date.now());
    if (open) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [open]);

  if (open) {
    return (
      <Button
        type="submit"
        className="shine-btn h-auto rounded-xl px-12 py-11 text-5xl text-foreground transition-transform hover:-translate-y-0.5 sm:px-24 sm:py-13.5 sm:text-6xl"
      >
        {label}
      </Button>
    );
  }

  const date = formatSingleDate(ticketSalesStart, t("main.time.at_start"));

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        type="submit"
        disabled
        variant="ghost"
        className="h-auto rounded-xl bg-muted px-12 py-10 text-4xl text-foreground line-through disabled:opacity-100 sm:px-16"
      >
        {label}
      </Button>
      <p className="bg-inline text-h3-fluid text-foreground">{t("main.ticket_opens", { date })}</p>
    </div>
  );
}
