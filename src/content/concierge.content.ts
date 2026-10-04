export interface ConciergePrompt {
  id: string;
  category: "Dining" | "Amenities" | "Policy" | "Services";
  prompt: string;
  shortLabel: string;
}

export interface ConciergeContent {
  title: string;
  subtitle: string;
  welcomeMessage: string;
  quickPrompts: ConciergePrompt[];
}

export const conciergeContent: ConciergeContent = {
  title: "Sovereign AI Concierge",
  subtitle: "Your intelligent 24/7 virtual assistant for instant answers and tailored hotel services.",
  welcomeMessage:
    "Welcome to The Grand Sovereign Hotel & Suites. How may I assist with your stay today?",
  quickPrompts: [
    {
      id: "breakfast-hours",
      category: "Dining",
      prompt: "What are the breakfast hours and dining locations?",
      shortLabel: "Breakfast Hours & Dining",
    },
    {
      id: "checkout-policy",
      category: "Policy",
      prompt: "What is the checkout policy and can I request a late checkout?",
      shortLabel: "Checkout Policy & Late Checkout",
    },
    {
      id: "airport-shuttle",
      category: "Services",
      prompt: "Is an airport shuttle or private chauffeur service available?",
      shortLabel: "Airport Shuttle & Chauffeur",
    },
    {
      id: "spa-services",
      category: "Amenities",
      prompt: "What treatment packages are available at the Sovereign Spa & Wellness Center?",
      shortLabel: "Spa Treatments & Wellness",
    },
    {
      id: "wifi-access",
      category: "Services",
      prompt: "How do I connect to high-speed guest Wi-Fi and executive lounge network?",
      shortLabel: "Wi-Fi & Internet Access",
    },
  ],
};
