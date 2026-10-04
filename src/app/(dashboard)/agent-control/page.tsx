import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AgentControlPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">AI Agent Control Center</h1>
        <p className="text-sm text-muted-foreground">Monitor AI Concierge logs, system rules, human takeover, and memory.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Autonomous AI Assistant Oversight</CardTitle>
          <CardDescription>System prompt settings, active guest sessions, and escalation controls.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
