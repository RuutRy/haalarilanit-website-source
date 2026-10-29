import { cn } from "@/lib/utils";

type MonoImageProps = {
  src: string;
  alt: string;
  // Intrinsic size - gives the box its aspect ratio (a masked element doesn't size like <img>).
  width?: number;
  height?: number;
  className?: string;
};

// A mono asset (logo, floor plan) tinted through CSS: the image masks the box,
// the color is its background. The drawing stretches, so the set size wins over the natural ratio.
export function MonoImage({ src, alt, width, height, className }: MonoImageProps) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={cn("mono-image", className)}
      style={
        {
          "--mono-img": `url(${src})`,
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
        } as React.CSSProperties
      }
    />
  );
}
