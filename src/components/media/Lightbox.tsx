import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Hint } from "@/components/Hint";

// Non-modal radix Dialog: the page behind stays scrollable, so the backdrop
// button is the guaranteed click-to-close. Backdrop classes live on Content
// (a non-modal Overlay renders null). aria-describedby={undefined}: the alt
// text is the label.
export function Lightbox({ src, alt }: { src: string; alt: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t("a11y.zoom_image")}
          className="group/img block w-fit max-w-full cursor-zoom-in rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="mx-auto block max-h-[85vh] max-w-full rounded-lg transition-transform group-hover/img:scale-101"
          />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
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
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2.5 text-foreground shadow-lg transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X className="size-6" />
              </button>
            </Dialog.Close>
          </Hint>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
