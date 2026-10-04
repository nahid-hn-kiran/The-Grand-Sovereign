import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FrontDeskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Front Desk & Room Rack</h1>
        <p className="text-sm text-muted-foreground">Guest check-in, check-out, keycard assignment, and room rack view.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reception Desk Portal</CardTitle>
          <CardDescription>Live room status grid and immediate guest arrivals.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
