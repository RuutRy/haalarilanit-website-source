import { links } from "../../lib/data";
import { TextLink } from "../text";

export function PhotoGalleries() {
  return (
    <div className="flex w-full justify-center gap-4">
      {links.photos.map((photo) => (
        <TextLink key={photo.label} href={photo.url} text={photo.label} />
      ))}
    </div>
  );
}
