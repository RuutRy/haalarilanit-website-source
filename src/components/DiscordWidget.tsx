import { links } from "../lib/data";

// Live Discord server widget (official embed): online member count and
// the channel list. Configured per server in data.ts - a social entry
// with widgetGuildId (the server must have its widget enabled).
// Sandbox follows Discord's recommended embed config.
export function DiscordWidget() {
  const discord = links.socials.find((s) => s.widgetGuildId);
  if (!discord) return null;

  return (
    <iframe
      src={`https://discord.com/widget?id=${discord.widgetGuildId}&theme=dark`}
      width="350"
      height="420"
      frameBorder="0"
      // oxlint-disable-next-line react/iframe-missing-sandbox -- vendor-recommended embed config
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      title={discord.name}
      className="max-w-full rounded-lg"
    />
  );
}
