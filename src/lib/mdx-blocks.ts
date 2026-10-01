// Component names the remark plugin injects into MDX output; Article.tsx
// maps them to implementations. The single registry for both sides.
export const MDX_BLOCKS = {
  sectionNav: "SectionNav",
  backToTop: "BackToTop",
  stripSpace: "StripSpace",
  scrollHint: "ScrollHint",
} as const;
