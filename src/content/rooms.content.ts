import { RoomType } from "@/types/room.types";

export interface AmenityDefinition {
  id: string;
  label: string;
  iconName: string;
  category: "comfort" | "media" | "view" | "wellness";
}

export const AMENITY_DEFINITIONS: AmenityDefinition[] = [
  { id: "king-bed", label: "King Plush Pillowtop Bed", iconName: "BedDouble", category: "comfort" },
  { id: "marble-bath", label: "Italian Marble Soaking Tub", iconName: "Bath", category: "comfort" },
  { id: "ocean-view", label: "Panoramic Ocean / Skyline View", iconName: "Eye", category: "view" },
  { id: "private-balcony", label: "Private Teak Balcony", iconName: "Sun", category: "view" },
  { id: "high-speed-wifi", label: "Gigabit Wi-Fi 6", iconName: "Wifi", category: "media" },
  { id: "smart-tv", label: "65-inch 4K OLED Smart TV", iconName: "Tv", category: "media" },
  { id: "spa-bathrobe", label: "Plush Egyptian Cotton Robes", iconName: "Sparkles", category: "wellness" },
  { id: "espresso-bar", label: "Nespresso & Gourmet Tea Bar", iconName: "Coffee", category: "comfort" },
  { id: "climate-control", label: "Smart Touch Climate Control", iconName: "Thermometer", category: "comfort" },
  { id: "butler-service", label: "24/7 Dedicated Chauffeur & Butler", iconName: "ConciergeBell", category: "wellness" },
];

export const FALLBACK_ROOM_TYPES: RoomType[] = [
  {
    id: "rt-deluxe-king",
    name: "Deluxe Sovereign King Suite",
    slug: "deluxe-king",
    description:
      "An exquisite 650 sq. ft. sanctuary featuring custom Italian linens, an artisanal marble bath, floor-to-ceiling city skyline views, and bespoke concierge integration.",
    basePrice: 450,
    capacity: 2,
    amenities: ["king-bed", "marble-bath", "high-speed-wifi", "smart-tv", "spa-bathrobe", "espresso-bar", "climate-control"],
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    ],
    _count: { rooms: 8 },
  },
  {
    id: "rt-ocean-double",
    name: "Oceanfront Double Queen Suite",
    slug: "ocean-double",
    description:
      "Expansive 850 sq. ft. coastal retreat with dual plush queen beds, private glass-railing oceanfront balcony, dual-sink vanity, and direct spa access.",
    basePrice: 620,
    capacity: 4,
    amenities: ["marble-bath", "ocean-view", "private-balcony", "high-speed-wifi", "smart-tv", "spa-bathrobe", "espresso-bar"],
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    ],
    _count: { rooms: 5 },
  },
  {
    id: "rt-exec-president",
    name: "Presidential Sky Villa & Penthouse",
    slug: "exec-president",
    description:
      "The pinnacle of luxury. A magnificent 2,200 sq. ft. penthouse suite offering 360-degree panoramic ocean and skyline views, private infinity plunge pool, dedicated 24/7 butler service, and private helicopter landing privileges.",
    basePrice: 1850,
    capacity: 6,
    amenities: [
      "king-bed",
      "marble-bath",
      "ocean-view",
      "private-balcony",
      "high-speed-wifi",
      "smart-tv",
      "spa-bathrobe",
      "espresso-bar",
      "climate-control",
      "butler-service",
    ],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    ],
    _count: { rooms: 2 },
  },
];
