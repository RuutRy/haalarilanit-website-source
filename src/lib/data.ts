import type { ContactGroup, Organizer, PhotoEntry, Social, Sponsor } from "./types.ts";

// Canonical origin: og:url, canonical links.
export const SITE_URL = "https://haalarilan.it";

export const event = {
  name: "Haalarilanit",
  start: new Date(2026, 10, 19, 15),
  end: new Date(2026, 10, 22, 12),
  ticketSales: new Date(2026, 9, 3, 12),
};

export const eventYear = event.start.getFullYear();

// Contact sections in display order. A new section is one entry here: the
// label and every person carry both languages inline. Sections without
// people stay hidden until someone is listed.
export const contactGroups: ContactGroup[] = [
  {
    key: "main-organizers",
    label: { fi: "Pääjärjestäjät", en: "Main organizers" },
    people: [
      {
        name: "Noora Parkko",
        roles: { fi: ["Infra", "Logistiikka"], en: ["Infra", "Logistics"] },
        email: "noora.parkko@ruut.me",
        telegram: "LauriSorsa",
      },
      {
        name: "Jesse Mäkelä",
        roles: {
          fi: ["Markkinointi", "Live", "Turnaukset"],
          en: ["Marketing", "Live", "Tournaments"],
        },
        email: "jesse.makela@ruut.me",
        telegram: "MakelaJ",
      },
      {
        name: "Lauri Sorsa",
        roles: { fi: ["Kioski", "Turvallisuus"], en: ["Kiosk", "Safety"] },
        email: "lauri.sorsa@cluster.fi",
        telegram: "Marathonmonday",
      },
    ],
  },
  {
    key: "harassment-contacts",
    label: { fi: "Häirintäyhdyshenkilöt", en: "Harassment contact persons" },
    people: [],
  },
];

// Logo files go in public/assets/sponsors/.
export const sponsors: Sponsor[] = [
  { name: "LOAS", logo: "/assets/sponsors/LOAS.jpg", url: "https://loas.fi" },
  { name: "TEK", logo: "/assets/sponsors/TEK.png", url: "https://tek.fi" },
  { name: "MULTITRONIC", logo: "/assets/sponsors/MULTITRONIC.jpg", url: "https://multitronic.fi" },
  { name: "SKINSAUNA", logo: "/assets/sponsors/SKINSAUNA.png", url: "https://skinsauna.gg" },
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
  // Add an entry and the footer picks it up automatically.
  organizers: [
    {
      name: "Ruut ry",
      logo: "/assets/logos/ruut.svg",
      logoWhite: "/assets/logos/ruut-white.svg",
      url: "https://ruut.me",
    },
    {
      name: "Cluster ry",
      logo: "/assets/logos/cluster.svg",
      logoWhite: "/assets/logos/cluster-white.svg",
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
      url: "https://discord.com/invite/VXSbcP9qUz",
      // embeds the official Discord widget iframe (DiscordWidget.tsx).
      widgetGuildId: "1240709326134312960",
    },
  ] satisfies Social[],
};
