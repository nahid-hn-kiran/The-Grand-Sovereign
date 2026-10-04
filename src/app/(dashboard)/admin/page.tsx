import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Analytics Overview</h1>
        <p className="text-sm text-muted-foreground">Admin operational metrics, occupancy rate, and revenue summary.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Management Overview</CardTitle>
          <CardDescription>Hotel operational analytics and active reservations monitoring.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
