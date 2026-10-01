type ImgProps = {
  src: string;
  alt: string;
  /** Exact width in rem. */
  w?: number;
  /** Exact height in rem; the other dimension follows the aspect ratio. */
  h?: number;
};

// Plain article image with an explicitly authored size (no min/max logic -
// the mdx sets the size it wants; unset dimensions follow the aspect
// ratio, and max-w-full guards overflow). No centering: wrap in <Center>
// per article. No lightbox: wrap in <Lightbox> when click-to-zoom is wanted.
export function Img({ src, alt, w, h }: ImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="block max-w-full rounded-lg"
      style={{ width: w ? `${w}rem` : undefined, height: h ? `${h}rem` : undefined }}
    />
  );
}
