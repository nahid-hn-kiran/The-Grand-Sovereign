"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, Users, BedDouble, DollarSign, ArrowRight, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_RECENT_BOOKINGS = [
  { id: "b-1", code: "GS-891A20", guest: "Lord Sterling", suite: "Presidential Sky Villa", checkIn: "2026-10-05", amount: "$3,700", status: "CONFIRMED" },
  { id: "b-2", code: "GS-442F19", guest: "Lady Eleanor Vance", suite: "Deluxe Sovereign King", checkIn: "2026-10-06", amount: "$900", status: "CONFIRMED" },
  { id: "b-3", code: "GS-109C88", guest: "Julian Mercer", suite: "Oceanfront Double Queen", checkIn: "2026-10-08", amount: "$1,240", status: "PENDING_PAYMENT" },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Executive Administration & Analytics
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Management Overview</h1>
          <p className="text-sm text-muted-foreground">
            Real-time occupancy metrics, operational revenue stream, and direct management shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button size="sm" asChild variant="outline">
            <Link href="/admin/rooms">
              <BedDouble className="h-4 w-4 mr-1.5" />
              Room Inventory
            </Link>
          </Button>
          <Button size="sm" asChild className="shadow-md">
            <Link href="/agent-control">
              <Bot className="h-4 w-4 mr-1.5" />
              Agent Control
            </Link>
          </Button>
        </div>
      </div>

      {/* Top Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/60">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
              <span>Occupancy Rate</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-1">
            <span className="font-serif text-3xl font-bold text-foreground">84.5%</span>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+6.2% vs previous week</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
              <span>Active Reservations</span>
              <Users className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-1">
            <span className="font-serif text-3xl font-bold text-foreground">18</span>
            <p className="text-xs text-muted-foreground font-medium">12 Checked In • 6 Upcoming</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
              <span>Rooms in Turnover</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-1">
            <span className="font-serif text-3xl font-bold text-amber-600 dark:text-amber-400">3</span>
            <p className="text-xs text-muted-foreground font-medium">Average turnover: 28 mins</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
              <span>Total MTD Revenue</span>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-1">
            <span className="font-serif text-3xl font-bold text-primary">$128,450</span>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+14% vs target</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Bookings & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Bookings Quick Table */}
        <div className="lg:col-span-8">
          <Card className="border border-border/50 shadow-md">
            <CardHeader className="p-5 bg-muted/20 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-xl font-bold">Recent Guest Reservations</CardTitle>
                <CardDescription>Latest confirmed and pending guest check-ins</CardDescription>
              </div>
              <Button size="sm" variant="ghost" asChild className="text-xs">
                <Link href="/front-desk">View Room Rack</Link>
              </Button>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                  <tr>
                    <th className="p-4">Code</th>
                    <th className="p-4">Guest Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Check-In</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {MOCK_RECENT_BOOKINGS.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-xs">{b.code}</td>
                      <td className="p-4 font-semibold text-foreground">{b.guest}</td>
                      <td className="p-4 text-xs text-muted-foreground">{b.suite}</td>
                      <td className="p-4 text-xs">{b.checkIn}</td>
                      <td className="p-4 font-serif font-bold text-primary">{b.amount}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={
                            b.status === "CONFIRMED"
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }
                        >
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* System & AI Control Shortcuts Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-amber-500/10 p-6 space-y-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-foreground">AI Concierge Health</h3>
                <p className="text-xs text-muted-foreground">Autonomous Multi-Agent System</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>RAG Vector Policy Store</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">ONLINE (100%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>Active HITL Approvals</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">1 Pending</span>
              </div>
            </div>

            <Button asChild className="w-full font-semibold shadow-md">
              <Link href="/agent-control">
                Open AI Control Station
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
