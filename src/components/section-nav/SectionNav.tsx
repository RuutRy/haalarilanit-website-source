import { useCallback, useEffect, useRef, useState } from "react";

import { jumpToSection } from "./jump-to-section";
import { SectionNavRail } from "./SectionNavRail";
import { SectionNavSheet } from "./SectionNavSheet";
import { type SwipeSide, useEdgeSwipe } from "./useEdgeSwipe";
import { useSectionSpy } from "./useSectionSpy";

// Deep-link glide waits for fonts/layout to settle.
const DEEP_LINK_DELAY_MS = 400;

// Dock-style TOC, hung just left of the content sheet (desktop 2xl+).
// On smaller screens there is no visible trigger at all: a horizontal
// swipe starting near either screen edge opens the quick-jump as a
// floating overlay panel (from the swiped side). The mdx content is the
// single source of truth: the nav reads `.content-sheet h2[id]` after
// mount and renders nothing on the server.
//
// Sections on screen are tracked by measuring heading positions (rAF on
// scroll): every visible section's entry is bolded, the rest stay dim -
// so the marks follow scrolling AND programmatic jumps alike. The last
// non-empty set holds over gaps between section panels.
//
// The rail only shows while the article text is on screen - hidden over
// the hero strip and past the sheet's end.
export function SectionNav() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<SwipeSide>("left");

  const { items, visible, onText, markVisible } = useSectionSpy();

  const jump = useCallback(
    (id: string) => {
      jumpToSection(id);
      // Optimistic: the clicked section marks instantly; the scrollspy
      // keeps the rest honest while the glide passes through.
      markVisible(id);
    },
    [markVisible],
  );

  // Deep-link feedback: a URL hash names the section you arrived at -
  // jump to it and flash the heading once the auto-scroll settles.
  useEffect(() => {
    if (items.length === 0) return;
    let initial = "";
    try {
      initial = decodeURIComponent(location.hash.slice(1));
    } catch {
      initial = location.hash.slice(1); // malformed escape: matches no section id, deep-link simply skipped
    }
    if (!initial || !items.some((i) => i.id === initial)) return;
    const timer = setTimeout(() => jump(initial), DEEP_LINK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [items, jump]);

  // The swipe recognizer only arms while the article text is on screen;
  // onText changes on every scroll frame, so it is read through a ref -
  // the touch listeners must not re-subscribe while scrolling.
  const onTextRef = useRef(onText);
  onTextRef.current = onText;
  useEdgeSwipe({
    enabled: items.length > 0,
    armedRef: onTextRef,
    onOpen: (from) => {
      setSide(from);
      setOpen(true);
    },
  });

  if (items.length === 0) return null;

  return (
    <>
      <SectionNavRail items={items} visible={visible} onText={onText} onJump={jump} />
      <SectionNavSheet
        items={items}
        visible={visible}
        side={side}
        open={open}
        onOpenChange={setOpen}
        onJump={jump}
      />
    </>
  );
}
