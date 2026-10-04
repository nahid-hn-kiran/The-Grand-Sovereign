import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminRoomsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Room Inventory Management</h1>
        <p className="text-sm text-muted-foreground">Manage suites, base rates, amenities, and room status.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory & Suite Control</CardTitle>
          <CardDescription>System room database and pricing configuration.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
