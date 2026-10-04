import Link from "next/link";
import Image from "next/image";
import { Sparkles, Waves, Dumbbell, Compass, ArrowRight, ShieldCheck, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = {
  title: "Luxury Amenities & Wellness Atelier",
  description: "Experience our world-class hydrotherapy spa, infinity pool, fitness atelier, and private valet services at The Grand Sovereign.",
};

const AMENITIES_LIST = [
  {
    title: "Sovereign Hydrotherapy Spa & Thermal Suites",
    description: "Rejuvenate body and mind with bespoke massage therapies, Italian marble hydro-soaking tubs, and aromatic eucalyptus steam rooms.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    tags: ["Hydrotherapy", "Eucalyptus Steam", "Custom Treatments"],
  },
  {
    title: "Skyline Infinity Pool & Sunset Cabanas",
    description: "Enjoy temperature-controlled rooftop swimming with breathtaking ocean and skyline vistas, accompanied by dedicated cabana butler service.",
    icon: Waves,
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    tags: ["Heated Rooftop Pool", "Ocean Vistas", "Private Cabanas"],
  },
  {
    title: "Technogym Elite Fitness Atelier",
    description: "State-of-the-art cardiovascular and biometric strength equipment, private personal training sessions, and complimentary wellness juices.",
    icon: Dumbbell,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    tags: ["24/7 Access", "Technogym Gear", "Personal Trainers"],
  },
  {
    title: "Private Chauffeur & Subterranean Valet",
    description: "Seamless luxury transportation with our dedicated fleet of executive sedans and 24-hour private valet service.",
    icon: Compass,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    tags: ["24/7 Chauffeur", "Subterranean Parking", "EV Fast Charging"],
  },
];

export default function AmenitiesPage() {
  return (
    <div className="flex flex-col gap-12 pb-20 pt-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-12 md:py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-4 gap-2 py-1 px-4 text-xs font-semibold uppercase tracking-wider border-primary/30 bg-primary/5 text-primary rounded-full">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            World-Class Facilities
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Luxury Amenities & Wellness Atelier
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Immerse yourself in unrivaled relaxation, state-of-the-art fitness, and personalized guest services crafted for absolute comfort.
          </p>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AMENITIES_LIST.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg transition-all duration-300">
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
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-serif text-xl font-bold">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-muted/60 text-foreground font-medium">
                        {tag}
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
          <Coffee className="h-10 w-10 text-primary" />
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Ready to Experience Unmatched Hospitality?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Reserve your suite today and enjoy complimentary access to all spa, pool, and fitness facilities.
            </p>
          </div>
          <Button size="lg" asChild className="px-8 font-semibold shadow-md">
            <Link href="/rooms">
              Explore Our Suites & Book Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
