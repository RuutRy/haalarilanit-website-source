type ImgProps = {
  src: string;
  alt: string;
  /** Exact width in rem. */
  w?: number;
  /** Exact height in rem; the other dimension follows the aspect ratio. */
  h?: number;
};

// Authored size in rem (unset dimensions follow the aspect ratio); centering
// and zoom are explicit <Center>/<Lightbox> wraps.
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
