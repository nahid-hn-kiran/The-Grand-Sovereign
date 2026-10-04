import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/content/site.config";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and guest data protection standards at The Grand Sovereign Hotel & Suites.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Effective Date: January 1, 2026 • {siteConfig.name}
        </p>
      </div>

      <Card className="border border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold">1. Commitment to Guest Privacy</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            At {siteConfig.name}, we hold guest confidentiality and data security in the highest regard. This Privacy Policy details how we collect, safeguard, and process personal information acquired through our online booking platforms, concierge services, and hotel premises.
          </p>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold">2. Information Collection & Use</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>We collect essential reservation data, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact Information (Full Name, Email Address, Phone Number)</li>
            <li>Reservation & Stay Details (Check-in/out dates, room selection, special preferences)</li>
            <li>Payment & Financial Data processed securely via PCI-compliant payment gateways</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold">3. Data Security & Storage</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            We implement enterprise-grade encryption standard protocols to protect guest telemetry and personal records. We do not sell or rent guest information to third-party advertisers under any circumstances.
          </p>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold">4. Guest Rights & Contact</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            Guests may request access to, correction of, or deletion of their personal records at any time by contacting our Privacy Officer at <span className="text-primary font-medium">{siteConfig.contact.email}</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
