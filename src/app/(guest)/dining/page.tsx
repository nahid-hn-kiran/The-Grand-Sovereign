import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  ChefHat,
  Clock,
  GlassWater,
  Star,
  Utensils,
  Wine,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Fine Dining & Artisanal Mixology",
  description:
    "Discover Michelin-starred gastronomy, farm-to-table cuisine, rooftop cocktail lounges, and 24/7 in-suite dining at The Grand Sovereign.",
};

const DINING_VENUES = [
  {
    title: "L'Étoile Royale — Fine Dining",
    subtitle: "Michelin-Starred Gastronomy",
    description:
      "Multi-course seasonal tasting menus orchestrated by Master Chefs, paired with exceptional vintages from our subterranean reserve cellar.",
    hours: "6:00 PM – 11:00 PM",
    icon: ChefHat,
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Artisanal Tasting Menus",
      "Sommelier Cellar",
      "Dress Code: Elegant",
    ],
  },
  {
    title: "The Crown Rooftop Mixology Lounge",
    subtitle: "Panoramic Sunset Views & Craft Cocktails",
    description:
      "Perched high above the skyline featuring rare aged spirits, botanical infusions, fresh seafood raw bar, and live jazz performances.",
    hours: "5:00 PM – 2:00 AM",
    icon: Wine,
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Bespoke Cocktails", "Ocean Panorama", "Seafood & Tapas"],
  },
  {
    title: "Le Jardin Bistro & Garden Terrace",
    subtitle: "Al-Fresco Farm-to-Table Dining",
    description:
      "Relaxed all-day dining featuring organic farm-to-table breakfast, fresh cold-pressed juices, and artisanal French pastries.",
    hours: "7:00 AM – 4:00 PM",
    icon: Utensils,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Farm-to-Table Organic",
      "Al-Fresco Terrace",
      "Gourmet Breakfast",
    ],
  },
  {
    title: "24/7 In-Suite Gourmet Dining",
    subtitle: "Bespoke Culinary Service",
    description:
      "Delivered directly to your suite by white-glove service staff. From late-night caviar to sunrise champagne breakfasts.",
    hours: "Available 24 Hours",
    icon: GlassWater,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    highlights: ["White-Glove Delivery", "24/7 Availability", "Custom Menus"],
  },
];

export default function DiningPage() {
  return (
    <div className="flex flex-col gap-12 pb-20 pt-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-12 md:py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge
            variant="outline"
            className="mb-4 gap-2 py-1 px-4 text-xs font-semibold uppercase tracking-wider border-primary/30 bg-primary/5 text-primary rounded-full"
          >
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            Culinary Excellence
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Fine Dining & Artisanal Mixology
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Indulge in extraordinary culinary journeys created by world-renowned
            chefs, paired with vintage wines and handcrafted cocktails.
          </p>
        </div>
      </section>

      {/* Dining Venues Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DINING_VENUES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                </div>
                <CardHeader className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="font-serif text-xl font-bold">
                          {item.title}
                        </CardTitle>
                        <p className="text-xs font-medium text-primary mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </CardDescription>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground pt-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Operating Hours: {item.hours}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.highlights.map((h, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs bg-muted/60 text-foreground font-medium"
                      >
                        {h}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA to Rooms */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-8">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-amber-500/10 via-primary/15 to-amber-700/10 p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-md">
          <Utensils className="h-10 w-10 text-primary" />
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Taste the Extraordinary at The Grand Sovereign
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Book your stay with us and enjoy complimentary priority dining
              reservations and in-suite tasting amenities.
            </p>
          </div>
          <Button size="lg" asChild className="px-8 font-semibold shadow-md">
            <Link href="/rooms">
              View Our Accommodations & Reserve
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
