import { links } from "../lib/data";

// Official Discord widget embed (Server Settings → Widget), Discord's recommended
// markup: 350×500, transparent background, sandboxed like the vendor snippet.
export function DiscordWidget() {
  const discord = links.socials.find((s) => s.widgetGuildId);
  if (!discord) return null;

  return (
    <iframe
      src={`https://discord.com/widget?id=${discord.widgetGuildId}&theme=dark`}
      width="350"
      height="500"
      frameBorder={0}
      // vendor-recommended embed config (Discord's own widget snippet)
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      title={discord.name}
      className="max-w-full rounded-lg"
    />
  );
}
