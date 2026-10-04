import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/content/site.config";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of service and stay conditions at The Grand Sovereign Hotel & Suites.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Effective Date: January 1, 2026 • {siteConfig.name}
        </p>
      </div>

      <Card className="border border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold">
            1. Reservations & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            All suite reservations made through our digital system or concierge
            team are subject to confirmation and identity verification upon
            check-in. Guests must present valid government photo identification
            and the credit card used during booking.
          </p>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold">
            2. Check-In & Check-Out Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <ul className="list-disc pl-5 space-y-1">
            <li>Standard Check-In Time: 3:00 PM</li>
            <li>Standard Check-Out Time: 11:00 AM</li>
            <li>
              Late check-outs are subject to availability and prior
              authorization by the front desk.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold">
            3. Cancellation & Guarantee
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            Cancellations made 48 hours prior to local arrival time incur zero
            cancellation penalties. Late cancellations or no-shows are subject
            to a one-night room rate charge plus applicable taxes.
          </p>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-xl font-bold">
            4. Guest Conduct & Property Care
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            {siteConfig.name} maintains a non-smoking policy throughout all
            indoor premises and guest suites. Violations or property damages
            will result in immediate room restoration fees.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
