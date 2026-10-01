import { useCallback, useEffect, useState } from "react";

export type SectionNavItemData = { id: string; label: string };

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
    // The plugin decides anchor-worthiness (>= 2 sections). No-anchors sheets
    // hide copy-link buttons AND this nav - one rule, one owner.
    if (sheet.classList.contains("no-anchors")) return;

    // The anchor id lives on the heading's wrapper span (see Article).
    const headings = [...sheet.querySelectorAll<HTMLElement>("h2")].filter(
      (h): h is HTMLElement & { parentElement: HTMLElement } => !!h.parentElement?.id,
    );

    const found = headings.map((h) => ({ id: h.parentElement.id, label: h.textContent ?? "" }));
    setItems(found);

    // Which sections are on screen: a heading counts as visible while
    // its wrapper sits between the header line and 75% of the viewport.
    // The last non-empty set holds over gaps between section panels.
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
      // Rail/FAB visibility: on the actual text = the sheet's body is
      // roughly filling the viewport (past the hero, above its end).
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
    // Marks animate in ~100ms after load (also covers the native
    // deep-link anchor jump, which is instant before hydration).
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
