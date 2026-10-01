import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Hint } from "@/components/Hint";

// Lightbox for article images: tap/click the image, it opens enlarged
// over a dimmed backdrop; exit button in the top right corner (plus
// Escape / backdrop click). Works on desktop and mobile. Portaled to
// body so page stacking never clips it.
//
// Language variants: give srcEn (and optionally altEn) to swap the
// image per active language - src is the default (Finnish tree).
export function Lightbox({
  src,
  alt,
  srcEn,
  altEn,
}: {
  src: string;
  alt: string;
  srcEn?: string;
  altEn?: string;
}) {
  const { t, i18n } = useTranslation();
  const english = i18n.language?.startsWith("en") ?? false;
  const shownSrc = english && srcEn ? srcEn : src;
  const shownAlt = english && altEn ? altEn : alt;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escape closes while the lightbox is up; body scroll stays free
  // (same pattern as the sheet, keeps page position).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={t("a11y.zoom_image")}
        className="group/img mx-auto block w-fit max-w-full cursor-zoom-in rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setOpen(true)}
      >
        <img
          src={shownSrc}
          alt={shownAlt}
          loading="lazy"
          className="mx-auto block max-h-[85vh] max-w-full rounded-lg transition-transform group-hover/img:scale-[1.01]"
        />
      </button>
      {mounted &&
        open &&
        createPortal(
          // Backdrop click closes (standard lightbox behavior; Escape +
          // the Close button cover keyboard/AT users).
          // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop dismiss + Escape + Close button
          <div
            role="dialog"
            aria-modal="true"
            aria-label={shownAlt}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg data-open:animate-in data-open:fade-in-0"
            onClick={() => setOpen(false)}
          >
            <Hint label={t("a11y.close")} side="left">
              <button
                type="button"
                aria-label={t("a11y.close")}
                className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2.5 text-foreground shadow-lg transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              >
                <X className="size-6" />
              </button>
            </Hint>
            {/* Click-swallow: backdrop dismissal ignores the image. */}
            {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- click-swallow */}
            <img
              src={shownSrc}
              alt={shownAlt}
              className="max-h-full max-w-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
