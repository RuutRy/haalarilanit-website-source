import { cn } from "@/lib/utils";

// Heading look per level. Add a level here when a page needs a new depth.
const LEVEL_CLS = {
  1: "bg-inline text-h1-fluid",
  2: "bg-inline text-h2-fluid",
} as const;

type HeadingProps = {
  level: keyof typeof LEVEL_CLS;
  text: string;
  className?: string;
};

export function Heading({ level, text, className }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={cn(LEVEL_CLS[level], className)}>{text}</Tag>;
}
