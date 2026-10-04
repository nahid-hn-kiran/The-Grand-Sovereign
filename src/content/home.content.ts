export interface HeroContent {
  badge: string;
  headline: string;
  headlineHighlight: string;
  subtitle: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
  highlights: {
    iconName: string;
    title: string;
    description: string;
  }[];
  promoBanner: {
    enabled: boolean;
    tag: string;
    headline: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
}

export const homeContent: HeroContent = {
  badge: "Voted #1 Luxury Sanctuary 2026",
  headline: "Experience The Pinnacle Of",
  headlineHighlight: "Opulent Comfort",
  subtitle:
    "Immerse yourself in understated luxury, tailored concierge experiences, and serene suite sanctuaries designed for the discerning traveler.",
  ctaPrimary: {
    label: "Book Your Stay",
    href: "/rooms",
  },
  ctaSecondary: {
    label: "Explore Suites",
    href: "/rooms",
  },
  highlights: [
    {
      iconName: "Crown",
      title: "Royal Suite Sanctuaries",
      description: "Custom Italian linens, marble soaking tubs, and panoramic skyline vistas.",
    },
    {
      iconName: "Sparkles",
      title: "24/7 AI & Personal Concierge",
      description: "Seamless dining reservations, private transfers, and personalized requests.",
    },
    {
      iconName: "Utensils",
      title: "Michelin-Star Gastronomy",
      description: "Award-winning culinary excellence served in private dining rooms and rooftop garden.",
    },
    {
      iconName: "ShieldCheck",
      title: "Private & Secure Retreat",
      description: "Discreet VIP security, private elevator access, and soundproof sanctuary suites.",
    },
  ],
  promoBanner: {
    enabled: true,
    tag: "Exclusive Autumn Offer",
    headline: "Complimentary Spa Credit & Late Checkout",
    description:
      "Reserve any Executive Suite for 3+ nights and receive a $200 Spa & Wellness credit plus guaranteed 4:00 PM late checkout.",
    ctaLabel: "Claim Exclusive Offer",
    ctaHref: "/offers/autumn-luxury",
  },
};
