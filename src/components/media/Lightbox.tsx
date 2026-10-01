import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Hint } from "@/components/Hint";

// Lightbox for article images: tap/click the image, it opens enlarged
// over a dimmed backdrop; exit button in the top right corner (plus
// Escape / backdrop click).
// Portal to body so page stacking never clips the dialog; Escape and the backdrop button close it.
export function Lightbox({ src, alt }: { src: string; alt: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
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
          src={src}
          alt={alt}
          loading="lazy"
          className="mx-auto block max-h-[85vh] max-w-full rounded-lg transition-transform group-hover/img:scale-101"
        />
      </button>
      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg data-open:animate-in data-open:fade-in-0"
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label={t("a11y.close")}
              className="absolute inset-0 cursor-zoom-out"
              onClick={() => setOpen(false)}
            />
            <img
              src={src}
              alt={alt}
              className="pointer-events-none relative max-h-full max-w-full rounded-lg shadow-2xl"
            />
            <Hint label={t("a11y.close")} side="left">
              <button
                ref={closeRef}
                type="button"
                aria-label={t("a11y.close")}
                className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2.5 text-foreground shadow-lg transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setOpen(false)}
              >
                <X className="size-6" />
              </button>
            </Hint>
          </div>,
          document.body,
        )}
    </>
  );
}
