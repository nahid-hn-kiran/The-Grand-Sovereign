import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HousekeepingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Housekeeping Turnover Kanban</h1>
        <p className="text-sm text-muted-foreground">Manage cleaning queues, room inspection, and turnover status.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Room Cleaning Management</CardTitle>
          <CardDescription>Real-time room status updates: VACANT_CLEAN, VACANT_DIRTY, OCCUPIED.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
