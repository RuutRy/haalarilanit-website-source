export type Contact = {
  name: string;
  rolesFi: string[];
  rolesEn: string[];
  email: string;
  telegram: string;
};

export type Sponsor = {
  name: string;
  logo: string;
  url: string;
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
