// Component names the remark plugin injects into MDX output; Article.tsx
// maps them to implementations. The single registry for both sides.
export const MDX_BLOCKS = {
  sectionNav: "SectionNav",
  backToTop: "BackToTop",
  stripSpace: "StripSpace",
  scrollHint: "ScrollHint",
} as const;

// Author-authored flow blocks that live INSIDE a ## section: the
// remark plugin does not end a section on them (see isSectionEnd), so an
// image or an opt-in <Center> group can sit between a heading and its
// prose in the same panel.
export const MDX_SOFT_BLOCKS = new Set(["Img", "Center"]);
