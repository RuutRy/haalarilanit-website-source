import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

type FlipClockProps = {
  target: Date;
  startedLabel: string;
  labels: [string, string, string, string];
  onComplete?: () => void;
  // "end" tones the separators amber so a countdown to LAN OFF reads
  // differently from the countdown to the event start
  tone?: "start" | "end";
};

// Themed wrapper around the flip clock library. Once the target passes,
// the clock swaps to the startedLabel text and notifies the caller so
// the page can move to the next phase.
export function FlipClock({
  target,
  startedLabel,
  labels,
  onComplete,
  tone = "start",
}: FlipClockProps) {
  if (target.getTime() <= Date.now()) {
    return <p className="py-6 text-center text-h3-fluid text-accent">{startedLabel}</p>;
  }

  return (
    <div className="haala-flip-clock flex justify-center py-6">
      <FlipClockCountdown
        to={target}
        labels={labels}
        showSeparators
        onComplete={onComplete}
        labelStyle={{
          color: "var(--color-milk)",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
        digitBlockStyle={{
          background: "var(--color-milk)",
          color: "var(--color-ink)",
          // Monospace digits: every glyph is exactly the same width,
          // so no digit can shift the halves horizontally.
          fontFamily:
            'ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", Menlo, Consolas, monospace',
          // Pin grayscale AA so the settled block renders like the
          // rotating one (transforms force grayscale).
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
        separatorStyle={{
          color: tone === "end" ? "var(--color-end)" : "var(--color-accent)",
        }}
        dividerStyle={{
          color: "color-mix(in srgb, var(--color-ink) 22%, transparent)",
        }}
      />
    </div>
  );
}
