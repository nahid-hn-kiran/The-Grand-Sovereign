export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    conciergeEmail: string;
  };
  nav: {
    main: NavItem[];
    footer: NavItem[];
  };
}

export const siteConfig: SiteConfig = {
  name: "The Grand Sovereign Hotel & Suites",
  tagline: "Unrivaled Elegance & Timeless Luxury",
  description:
    "Experience world-class hospitality, opulent suites, exquisite fine dining, and bespoke concierge services at The Grand Sovereign.",
  address: {
    street: "742 Royal Palm Boulevard",
    city: "Beverly Hills",
    state: "CA",
    zip: "90210",
    country: "United States",
  },
  coordinates: {
    lat: 34.0736,
    lng: -118.4004,
  },
  contact: {
    phone: "+1 (800) 555-SOVEREIGN",
    email: "reservations@grandsovereign.com",
    conciergeEmail: "concierge@grandsovereign.com",
  },
  nav: {
    main: [
      { title: "Suites & Rooms", href: "/rooms", description: "Explore our collection of luxury accommodations." },
      { title: "Amenities", href: "/amenities", description: "Spa, infinity pool, fitness center, and private valet." },
      { title: "Dining", href: "/dining", description: "Michelin-starred dining and rooftop cocktail lounge." },
      { title: "Concierge AI", href: "/concierge", description: "24/7 Virtual AI Guest Assistant." },
    ],
    footer: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Careers", href: "/careers" },
      { title: "Contact Us", href: "/contact" },
    ],
  },
};
