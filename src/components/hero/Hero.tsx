import { useTranslation } from "react-i18next";

import { event, links } from "../../lib/data";
import { useActiveLang } from "../../lib/lang";
import { formatEventTime } from "../../lib/time";
import { Frost } from "../Frost";
import { Logo } from "../media/Logo";
import { FlipClock } from "./FlipClock";
import { TicketButton } from "./TicketButton";
import { usePhaseNow } from "./usePhaseNow";

// The hero owns the phase clock; it re-renders only at phase boundaries.
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
    // The wrapper font-size is the hero's scale knob (rem clamp capped by
    // 3.4vw and 2.1cqh); everything inside is sized in em, so the hero fits
    // the first viewport on any device with CSS alone.
    <div className="mt-auto flex w-full flex-col items-center gap-[0.75em] text-center text-[min(clamp(0.875rem,1.25vw+0.625rem,1.25rem),3.4vw,2.1cqh)]">
      <Frost className="self-center">
        <Logo data-hero-logo />
      </Frost>

      <Frost className="flex w-full max-w-2xl flex-col items-center gap-[0.4em]">
        {/* The page's one h1 */}
        <h1 className="text-[1.6em]">
          {formatEventTime(lang, t("main.time.at_start"), t("main.time.at_end"))}
        </h1>
        <h3 className="text-[1.6em]">{t("main.time.where")}</h3>
        {concluded ? (
          <div key="concluded" className="motion-safe:animate-pop-in">
            <p className="py-[0.55em] text-[2.2em]">{t("event_end.message")}</p>
          </div>
        ) : now >= event.start.getTime() ? (
          <div
            key="running"
            className="motion-safe:animate-pop-in flex flex-col items-center gap-[0.4em]"
          >
            {/* Running: countdown to LAN OFF */}
            <h3 className="text-[1.6em] text-primary">{t("main.time.started")}</h3>
            <FlipClock
              target={event.end}
              startedLabel={t("event_end.message")}
              labels={labels}
              onComplete={refresh}
              tone="end"
            />
            <h3 className="text-[1.6em] text-primary">{t("main.time.endsin")}</h3>
          </div>
        ) : (
          <div
            key="before"
            className="motion-safe:animate-pop-in flex flex-col items-center gap-[0.4em]"
          >
            <FlipClock
              target={event.start}
              startedLabel={t("main.time.started")}
              labels={labels}
              onComplete={refresh}
            />
          </div>
        )}
      </Frost>

      {!links.ticket && (
        <p className="text-[1.6em] text-primary">{t("main.ticket_not_yet_available")}</p>
      )}

      {!concluded && links.ticket && (
        <form action={links.ticket}>
          <TicketButton label={t("main.purchase_button")} />
        </form>
      )}
    </div>
  );
}
