import { links } from "../../lib/data";
import { TextLink } from "../text";

// Gallery links from data.ts, extracted from the front page shell.
export function PhotoGalleries() {
  return (
    <div className="flex justify-center gap-4">
      {links.photos.map((photo) => (
        <TextLink key={photo.label} href={photo.url} text={photo.label} />
      ))}
    </div>
  );
}
