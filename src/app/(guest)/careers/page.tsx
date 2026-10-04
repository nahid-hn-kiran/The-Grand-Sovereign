import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/content/site.config";
import { Award } from "lucide-react";

export const metadata = {
  title: "Careers & Talent",
  description:
    "Join the luxury hospitality team at The Grand Sovereign Hotel & Suites.",
};

const OPEN_ROLES = [
  {
    title: "Executive Sous Chef",
    department: "Culinary & Fine Dining",
    type: "Full-Time",
    location: siteConfig.address.city,
    description:
      "Lead daily kitchen operations and artisanal menu design alongside Michelin-starred culinary talent.",
  },
  {
    title: "Chief Guest Concierge",
    department: "Guest Relations & Services",
    type: "Full-Time",
    location: siteConfig.address.city,
    description:
      "Deliver unparalleled, hyper-personalized guest experiences for VIPs, executives, and international dignitaries.",
  },
  {
    title: "Front Desk & Revenue Lead",
    department: "Front Office Operations",
    type: "Full-Time",
    location: siteConfig.address.city,
    description:
      "Oversee guest arrival experiences, reservation allocations, and frontline team excellence.",
  },
];

export default function CareersPage() {
  return (
    <div className="flex flex-col gap-12 pb-20 pt-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-12 md:py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge
            variant="outline"
            className="mb-4 gap-2 py-1 px-4 text-xs font-semibold uppercase tracking-wider border-primary/30 bg-primary/5 text-primary rounded-full"
          >
            <Award className="h-3.5 w-3.5 text-primary" />
            Hospitality Excellence
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Join The Sovereign Legacy
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Build a prestigious career with {siteConfig.name}, where
            uncompromising quality and world-class luxury come together.
          </p>
        </div>
      </section>

      {/* Open Opportunities */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Current Opportunities
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {OPEN_ROLES.map((role, index) => (
            <Card
              key={index}
              className="border border-border/60 bg-card hover:border-primary/40 transition-colors"
            >
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="secondary"
                      className="text-[10px] uppercase font-bold"
                    >
                      {role.department}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      • {role.type}
                    </span>
                  </div>
                  <CardTitle className="font-serif text-xl font-bold">
                    {role.title}
                  </CardTitle>
                </div>
                <Button size="sm" className="w-full md:w-auto font-semibold">
                  Apply Now
                </Button>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {role.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
