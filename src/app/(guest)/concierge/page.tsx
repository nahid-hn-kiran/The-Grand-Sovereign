import Link from "next/link";
import { Sparkles, Bot, ShieldCheck, MessageSquare, Clock, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { conciergeContent } from "@/content/concierge.content";

export const metadata = {
  title: "AI Guest Concierge Atelier",
  description: "Experience 24/7 intelligent hotel assistance powered by grounded policy search and instant guest support.",
};

export default function ConciergePage() {
  return (
    <div className="flex flex-col gap-12 pb-20 pt-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-12 md:py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-4 gap-2 py-1 px-4 text-xs font-semibold uppercase tracking-wider border-primary/30 bg-primary/5 text-primary rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            24/7 Virtual AI Assistant
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {conciergeContent.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {conciergeContent.subtitle}
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="font-serif text-lg font-bold">Grounded Hotel Knowledge</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                Our AI Concierge relies on official hotel policies, dining schedules, and room amenities to deliver verified, accurate responses.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary mb-2">
                <Clock className="h-5 w-5" />
              </div>
              <CardTitle className="font-serif text-lg font-bold">Instant 24/7 Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                Whether you need late checkout guidelines, breakfast hours, or valet instructions at midnight, the concierge responds instantly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary mb-2">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="font-serif text-lg font-bold">Smart Concierge Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                Explore pre-formulated queries for fast answers regarding Wi-Fi access, pool rules, airport shuttles, and in-suite dining options.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Queries Showcase */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="font-serif text-2xl font-bold text-center mb-6">Common Concierge Inquiries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {conciergeContent.quickPrompts.map((qp) => (
            <div key={qp.id} className="p-4 rounded-xl border border-border/60 bg-card flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">{qp.shortLabel}</p>
                <p className="text-xs text-muted-foreground mt-1">&quot;{qp.prompt}&quot;</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-amber-500/10 via-primary/15 to-amber-700/10 p-8 text-center flex flex-col items-center gap-6 shadow-md">
          <Bot className="h-10 w-10 text-primary" />
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Launch the Assistant Anywhere
            </h2>
            <p className="text-sm text-muted-foreground">
              Click the AI Concierge floating button on the bottom right corner of your screen at any time to open the drawer.
            </p>
          </div>
          <Button size="lg" asChild className="px-8 font-semibold shadow-md">
            <Link href="/rooms">
              Explore Our Luxury Rooms
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
