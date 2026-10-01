import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
// side-effect import: clock styles
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

type FlipClockProps = {
  target: Date;
  startedLabel: string;
  labels: [string, string, string, string];
  onComplete?: () => void;
  // "end" scopes the --countdown-* tokens to the LAN-OFF countdown (index.css).
  tone?: "start" | "end";
};

// Themed wrapper; past the target it swaps to startedLabel and calls onComplete.
export function FlipClock({
  target,
  startedLabel,
  labels,
  onComplete,
  tone = "start",
}: FlipClockProps) {
  if (target.getTime() <= Date.now()) {
    return <p className="py-6 text-center text-h3-fluid text-primary">{startedLabel}</p>;
  }

  return (
    <div
      className={`haala-flip-clock flex justify-center py-[0.6em] ${tone === "end" ? "concluded" : ""}`}
    >
      <FlipClockCountdown
        to={target}
        labels={labels}
        showSeparators
        onComplete={onComplete}
        // SSR-rendered: without it hydration would insert the full-height
        // clock and shift the page.
        renderOnServer
        labelStyle={{
          color: "var(--foreground)",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
        digitBlockStyle={{
          background: "var(--countdown-card-bg)",
          color: "var(--countdown-card-text)",
          // Monospace digits so no glyph shifts the halves.
          fontFamily:
            'ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", Menlo, Consolas, monospace',
          // Match the settled block's AA to the rotating one (transforms force grayscale).
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
        separatorStyle={{
          color: "var(--countdown-separator)",
        }}
        dividerStyle={{
          color: "color-mix(in srgb, var(--background) 22%, transparent)",
        }}
      />
    </div>
  );
}
