import Link from "next/link";
import {
  Crown,
  Sparkles,
  Utensils,
  ShieldCheck,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import { homeContent } from "@/content/home.content";
import { siteConfig } from "@/content/site.config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Crown,
  Sparkles,
  Utensils,
  ShieldCheck,
};

export default function GuestHomePage() {
  const { badge, headline, headlineHighlight, subtitle, ctaPrimary, ctaSecondary, highlights, promoBanner } =
    homeContent;

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-28">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-6 gap-2 py-1.5 px-4 text-xs font-semibold uppercase tracking-wider border-primary/30 bg-primary/5 text-primary rounded-full shadow-sm"
          >
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {badge}
          </Badge>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight font-serif text-foreground">
            {headline}{" "}
            <span className="block mt-2 bg-gradient-to-r from-amber-600 via-primary to-amber-700 dark:from-amber-300 dark:via-primary dark:to-amber-500 bg-clip-text text-transparent">
              {headlineHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button size="lg" asChild className="w-full sm:w-auto px-8 h-12 text-base font-semibold shadow-lg group">
              <Link href={ctaPrimary.href}>
                {ctaPrimary.label}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto px-8 h-12 text-base border-border/60">
              <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
            </Button>
          </div>

          {/* Address & Quick Info */}
          <div className="mt-8 text-xs font-medium text-muted-foreground">
            {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip} • {siteConfig.contact.phone}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => {
            const IconComponent = iconMap[item.iconName] || Sparkles;
            return (
              <Card
                key={index}
                className="border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-serif mt-4 font-bold">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Promotional Banner */}
      {promoBanner.enabled && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-amber-500/10 via-primary/15 to-amber-700/10 p-8 md:p-12 shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <Badge variant="secondary" className="bg-primary/20 text-primary font-semibold text-xs border-none">
                  {promoBanner.tag}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  {promoBanner.headline}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  {promoBanner.description}
                </p>
              </div>
              <Button size="lg" asChild className="shrink-0 font-semibold shadow-md">
                <Link href={promoBanner.ctaHref}>
                  {promoBanner.ctaLabel}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
