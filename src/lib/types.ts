export type Contact = {
  name: string;
  rolesFi: string[];
  rolesEn: string[];
  email: string;
  telegram: string;
};

// Chip the sponsor wall can put behind a logo: "light" rescues dark-ink
// logos designed for white backgrounds, "black" frames logos tuned for pure
// black; omit (or "none") to render the logo as-is.
export type SponsorBackground = "none" | "light" | "black";

export type Sponsor = {
  name: string;
  logo: string;
  url: string;
  background?: SponsorBackground;
};

export type Organizer = {
  name: string;
  // Shown on hover
  logo: string;
  // Shown at rest, tinted via the mono mask
  logoWhite: string;
  url: string;
};

export type PhotoEntry = {
  label: string;
  url: string;
};

// widgetGuildId: set for a Discord server with its widget enabled to embed the official widget iframe.
export type Social = {
  name: string;
  url: string;
  widgetGuildId?: string;
};
