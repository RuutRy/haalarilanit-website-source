import { useCallback, useEffect, useRef, useState } from "react";

import { flashHeading } from "@/lib/heading-flash";
import { jumpToSection } from "./jump-to-section";
import { SectionNavRail } from "./SectionNavRail";
import { SectionNavSheet } from "./SectionNavSheet";
import { SectionNavTrigger } from "./SectionNavTrigger";
import { whenScrollSettled } from "./scroll-settle";
import { type SwipeSide, useEdgeSwipe } from "./useEdgeSwipe";
import { type SectionNavItemData, useSectionSpy } from "./useSectionSpy";

// Deep-link glide waits for fonts/layout to settle.
const DEEP_LINK_DELAY_MS = 400;

// Dock-style TOC: rail from 72rem (where main centers and the trigger
// detaches), edge-swipe/trigger sheet below. Sections and
// on-screen marks come from useSectionSpy (measured after mount, rAF on scroll).
export function SectionNav() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<SwipeSide>("left");

  const { items, visible, onText, markVisible } = useSectionSpy();

  // The page-title h1 scrolls to the literal top and clears the hash.
  const jump = useCallback(
    (item: SectionNavItemData) => {
      if (item.isTop) {
        scrollTo({ top: 0, behavior: "smooth" });
        whenScrollSettled(() => {
          history.replaceState(null, "", location.pathname);
          flashHeading(item.id);
        });
      } else {
        jumpToSection(item.id);
      }
      // Optimistic: mark the clicked section instantly; the scrollspy corrects during the glide.
      markVisible(item.id);
    },
    [markVisible],
  );

  const toggleFromTrigger = useCallback(() => {
    setSide("left");
    setOpen((open) => !open);
  }, []);

  // Deep link: jump to the hashed section once the auto-scroll settles.
  useEffect(() => {
    if (items.length === 0) return;
    let initial = "";
    try {
      initial = decodeURIComponent(location.hash.slice(1));
    } catch {
      initial = location.hash.slice(1); // malformed escape: deep link skipped
    }
    const matched = items.find((i) => i.id === initial);
    if (!matched) return;
    const timer = setTimeout(() => {
      jumpToSection(matched.id);
      markVisible(matched.id);
    }, DEEP_LINK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [items, markVisible]);

  // onText changes on every scroll frame; read through a ref so the touch
  // listeners never resubscribe.
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
      <SectionNavTrigger open={open} onText={onText} onToggle={toggleFromTrigger} />
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
