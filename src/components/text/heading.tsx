import { Check, Link } from "lucide-react";
import type {
  MouseEvent as ReactMouseEvent,
  ReactNode,
  PointerEvent as ReactPointerEvent,
} from "react";
import { createElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { copyText } from "@/lib/clipboard";
import { flashHeading } from "@/lib/heading-flash";
import { cn } from "@/lib/utils";

// Hold a heading this long to copy its link (pointer quirks in useHoldToCopy).
const HOLD_MS = 1000;

// Arm on pointerdown, fire at HOLD_MS, cancel on release or 10px of
// movement. pointercancel is not a cancel: after the OS long-press menu
// is prevented the browser may still abort the pointer stream.
function useHoldToCopy(id: string) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const start = useRef<{ x: number; y: number; touch: boolean } | null>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const clear = () => {
    clearTimeout(timer.current);
    timer.current = 0;
    start.current = null;
  };

  const copy = () => {
    clear();
    void copyText(`${window.location.origin}${window.location.pathname}#${id}`).then((ok) => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      flashHeading(id);
    });
  };

  return {
    copied,
    copy,
    bind: {
      onPointerDown: (e: ReactPointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        start.current = { x: e.clientX, y: e.clientY, touch: e.pointerType !== "mouse" };
        clearTimeout(timer.current);
        timer.current = window.setTimeout(copy, HOLD_MS);
      },
      onPointerMove: (e: ReactPointerEvent) => {
        const s = start.current;
        if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 10) clear();
      },
      onPointerUp: clear,
      onPointerLeave: clear,
      onContextMenu: (e: ReactMouseEvent) => {
        // The OS long-press menu would race the hold on touch.
        if (start.current?.touch) e.preventDefault();
      },
    },
  };
}

function CopyLinkButton({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      data-copy-link
      aria-label={copied ? t("a11y.copied") : t("a11y.copy_link")}
      title={copied ? t("a11y.copied") : t("a11y.copy_link")}
      className="pointer-events-none absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded-full border bg-(--panel-tint) p-1.5 opacity-0 backdrop-blur-md transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 md:pointer-events-auto"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onCopy}
    >
      <span className="relative block size-3.5" aria-hidden>
        <Link
          className={cn(
            "absolute inset-0 size-full transition-all duration-150",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <Check
          className={cn(
            "absolute inset-0 text-primary size-full transition-all duration-150",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </span>
    </button>
  );
}

function AnchoredChip({
  as,
  id,
  className,
  children,
}: {
  as: "h1" | "h2" | "h3";
  id?: string;
  className: string;
  children?: ReactNode;
}) {
  const hold = useHoldToCopy(id ?? "");
  // The copy button rides INSIDE the chip: the flash animation (chip-bounce)
  // transforms the heading, and a sibling button would stay put behind the
  // moving text - nested, the two move and center as one.
  const chip = createElement(
    as,
    { className: cn("relative", className) },
    children,
    id ? <CopyLinkButton copied={hold.copied} onCopy={hold.copy} /> : null,
  );
  if (!id) return chip;
  return (
    <span
      id={id}
      {...hold.bind}
      className="group relative mx-auto grid w-fit select-none [-webkit-touch-callout:none]"
    >
      {chip}
    </span>
  );
}

export function H1({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <AnchoredChip as="h1" id={id} className="text-h1-fluid">
      {children}
    </AnchoredChip>
  );
}
export function H2({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <AnchoredChip as="h2" id={id} className="text-h2-fluid">
      {children}
    </AnchoredChip>
  );
}
export function H3({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <AnchoredChip as="h3" id={id} className="text-h3-fluid">
      {children}
    </AnchoredChip>
  );
}
