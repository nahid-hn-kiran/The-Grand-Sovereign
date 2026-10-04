import { MapPin, Phone, Mail, Clock, Send, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { siteConfig } from "@/content/site.config";

export const metadata = {
  title: "Contact & Concierge Inquiries",
  description: "Get in touch with The Grand Sovereign Hotel & Suites concierge and reservation desk.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-12 pb-20 pt-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-12 md:py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-4 gap-2 py-1 px-4 text-xs font-semibold uppercase tracking-wider border-primary/30 bg-primary/5 text-primary rounded-full">
            <Crown className="h-3.5 w-3.5 text-primary" />
            24/7 Dedicated Service
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Contact & Reservations
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Our concierge team is at your service 24 hours a day to assist with suite bookings, dining reservations, and bespoke travel requests.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details Card */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">Direct Contact Channels</h2>

            <Card className="border border-border/60 bg-card">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base">Hotel Address</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {siteConfig.address.street}<br />
                      {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}, {siteConfig.address.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base">Phone & Reservations</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reservations Desk: {siteConfig.contact.phone}<br />
                      Concierge Desk: Ext. 4004
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base">Electronic Mail</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reservations: {siteConfig.contact.email}<br />
                      Private Concierge: {siteConfig.contact.conciergeEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base">Front Office Hours</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Concierge & Front Desk: Open 24/7, 365 days a year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inquiry Form */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">Send an Inquiry</h2>
            <Card className="border border-border/60 bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-xl font-bold">Concierge Message Form</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Complete the form below and a member of our team will respond within 2 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Full Name</label>
                  <Input placeholder="Lord / Lady Sovereign" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Email Address</label>
                  <Input type="email" placeholder="guest@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Inquiry Subject</label>
                  <Input placeholder="Suite Reservation / Event Inquiry" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Message</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="How may our concierge assist you?"
                  />
                </div>
                <Button className="w-full font-semibold gap-2 shadow-md">
                  <Send className="h-4 w-4" />
                  Transmit Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
