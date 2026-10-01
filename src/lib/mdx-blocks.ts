// Component names the remark plugin injects into MDX output; Article.tsx
// maps them to implementations. The single registry for both sides.
export const MDX_BLOCKS = {
  sectionNav: "SectionNav",
  backToTop: "BackToTop",
  scrollHint: "ScrollHint",
} as const;

// Authorable blocks that don't end a section (see isSectionEnd in the remark plugin).
export const MDX_SOFT_BLOCKS = new Set(["Img", "Center"]);
