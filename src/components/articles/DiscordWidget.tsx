import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { links } from "../../lib/data";
import { cn } from "../../lib/utils";

// Official Discord widget embed, collapsed to a 70px bar. The iframe swallows
// all pointer events, so an overlay button carries the interaction and steps
// aside when open; document-level pointermove/pointerdown outside the box
// close it again. data-discord-widget: BackToTop yields to this box.
export function DiscordWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const inside = (x: number, y: number) => {
      const r = ref.current?.getBoundingClientRect();
      return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !inside(e.clientX, e.clientY)) setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!inside(e.clientX, e.clientY)) setOpen(false);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const onCarrierEnter = (e: React.PointerEvent) => {
    // Hover-open is mouse-only; taps open via onClick.
    if (e.pointerType === "mouse") setOpen(true);
  };

  const discord = links.socials.find((s) => s.widgetGuildId);
  if (!discord) return null;

  return (
    <div ref={ref} data-discord-widget className="relative w-full max-w-[350px]">
      <iframe
        src={`https://discord.com/widget?id=${discord.widgetGuildId}&theme=dark`}
        width="350"
        height="500"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        title={discord.name}
        className={cn(
          "block max-w-full rounded-lg transition-[height] duration-500 ease-out",
          open ? "h-[500px]" : "h-[70px]",
        )}
      />
      {/* Overlay carrier; inert while open so the iframe owns the pointer. */}
      <button
        type="button"
        aria-expanded={open}
        aria-label={t("a11y.expand_widget")}
        onPointerEnter={onCarrierEnter}
        onClick={() => setOpen(true)}
        className={cn(
          "absolute inset-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          open && "pointer-events-none",
        )}
      />
    </div>
  );
}
