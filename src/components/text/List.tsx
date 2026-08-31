import { cn } from "@/lib/utils";

type ListProps = {
  items: readonly string[];
  className?: string;
};

// Disc list on a panel. One look everywhere - pass className only for
// genuinely different cases.
export function List({ items, className }: ListProps) {
  return (
    <ul className={cn("bg-panel list-inside list-disc ps-0 text-justify", className)}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
