import { useCallback, useEffect, useState } from "react";

export type SectionNavItemData = {
  id: string;
  label: string;
  /** Tree depth: 0 = shallowest heading on the page (leftmost in the nav). */
  depth: number;
  /** The page-title h1: a nav click scrolls to the literal page top. */
  isTop: boolean;
};

export function useSectionSpy(): {
  items: SectionNavItemData[];
  visible: Set<string>;
  onText: boolean;
  markVisible: (id: string) => void;
} {
  const [items, setItems] = useState<SectionNavItemData[]>([]);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [onText, setOnText] = useState(false);

  const markVisible = useCallback((id: string) => {
    setVisible((prev) => new Set(prev).add(id));
  }, []);

  useEffect(() => {
    const sheet = document.querySelector(".content-sheet");
    if (!sheet) return;
    // no-anchors sheets (fewer than two sections) hide the copy-link buttons
    // and this nav too.
    if (sheet.classList.contains("no-anchors")) return;

    // The anchor id lives on the heading's wrapper span (see Article).
    const headings = [...sheet.querySelectorAll<HTMLElement>("h1, h2, h3")].filter(
      (h): h is HTMLElement & { parentElement: HTMLElement } => !!h.parentElement?.id,
    );

    // Depth relative to the shallowest heading, so h1-less pages still indent from the left.
    const minLevel = headings.length ? Math.min(...headings.map((h) => Number(h.tagName[1]))) : 1;
    const found = headings.map((h) => ({
      id: h.parentElement.id,
      label: h.textContent ?? "",
      depth: Number(h.tagName[1]) - minLevel,
      isTop: h.tagName === "H1",
    }));
    setItems(found);

    // A heading is visible while its wrapper is between the header and 75% of the viewport.
    let lastNonEmpty = new Set<string>();
    let raf = 0;
    const measure = () => {
      raf = 0;
      const next = new Set<string>();
      for (const h of headings) {
        const rect = h.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 96) {
          next.add(h.parentElement.id);
        }
      }
      if (next.size > 0) lastNonEmpty = next;
      setVisible(new Set(lastNonEmpty));
      // On-text: the sheet roughly fills the viewport (past the hero, above its end).
      const sheetRect = sheet.getBoundingClientRect();
      setOnText(
        sheetRect.top < window.innerHeight * 0.4 && sheetRect.bottom > window.innerHeight * 0.6,
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    // Covers the native deep-link anchor jump, which lands before hydration.
    const initialMeasure = setTimeout(measure, 100);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      clearTimeout(initialMeasure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { items, visible, onText, markVisible };
}
