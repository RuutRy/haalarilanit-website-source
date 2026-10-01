import type { Contact, Organizer, PhotoEntry, Social, Sponsor } from "./types";

// Canonical origin: og:url, canonical links.
export const SITE_URL = "https://haalarilan.it";

export const event = {
  start: new Date(2026, 10, 19, 15),
  end: new Date(2026, 10, 22, 12),
};

// Ticket shop opens at this moment (see Hero's TicketButton).
export const ticketSalesStart = new Date(2026, 9, 3, 12);

export const contacts: Contact[] = [
  {
    name: "Noora Parkko",
    rolesFi: ["Infra", "Logistiikka"],
    rolesEn: ["Infra", "Logistics"],
    email: "noora.parkko@ruut.me",
    telegram: "saaranooraniilo",
  },
  {
    name: "Jesse Mäkelä",
    rolesFi: ["Markkinointi", "Live", "Turnaukset"],
    rolesEn: ["Marketing", "Live", "Tournaments"],
    email: "jesse.makela@ruut.me",
    telegram: "MakelaJ",
  },
  {
    name: "Lauri Sorsa",
    rolesFi: ["Kioski", "Turvallisuus"],
    rolesEn: ["Kiosk", "Safety"],
    email: "lauri.sorsa@cluster.fi",
    telegram: "LauriSorsa",
  },
];

// Logo files go in public/sponsors/.
export const sponsors: Sponsor[] = [
  // { name: "Ruut ry", logo: "/assets/ruut.svg", url: "https://ruut.me" },
  // { name: "Cluster ry", logo: "/assets/cluster.svg", url: "https://cluster.fi" },
];

// Every link and configurable URI lives here
export const links = {
  ticket: "https://kauppa.haalarilan.it/product/807d143f-c490-45a0-8923-d22a1ba9d215",
  // Safer space policy, one PDF per language tree
  saferSpace: {
    fi: "https://ltky.fi/wp-content/uploads/2026/08/LTKY-turvallisemman-tilan-periaatteet.pdf",
    en: "https://ltky.fi/wp-content/uploads/2024/03/LTKYs-Safer-Space-policy.pdf",
  },
  photos: [
    {
      label: "2024",
      url: "https://cluster.kuvat.fi/kuvat/2024_014+-+Haalarilanit",
    },
    {
      label: "2025",
      url: "https://cluster.kuvat.fi/kuvat/2025_023+-+Haalarilanit",
    },
  ] satisfies PhotoEntry[],
  // Rendered dynamically in the footer - add an entry and a logo shows
  // up automatically.
  organizers: [
    {
      name: "Ruut ry",
      logo: "/assets/ruut.svg",
      logoWhite: "/assets/ruut-white.svg",
      url: "https://ruut.me",
    },
    {
      name: "Cluster ry",
      logo: "/assets/cluster.svg",
      logoWhite: "/assets/cluster-white.svg",
      url: "https://cluster.fi",
    },
  ] satisfies Organizer[],
  socials: [
    {
      name: "Instagram",
      url: "https://www.instagram.com/haalarilanit/",
    },
    {
      name: "Discord",
      url: "https://discord.com/invite/KmzPVjnAWE",
      widgetGuildId: "1240709326134312960",
    },
  ] satisfies Social[],
};
