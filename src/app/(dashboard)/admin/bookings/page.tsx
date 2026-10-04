"use client";

import * as React from "react";
import {
  Search,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  Building,
  Clock,
  ShieldCheck,
  Eye,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { BookingStatus, Booking } from "@/types/booking.types";
import { FALLBACK_ROOM_TYPES } from "@/content/rooms.content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  PENDING_PAYMENT: { label: "Pending Payment", className: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400", icon: AlertCircle },
  CONFIRMED: { label: "Confirmed", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400", icon: CheckCircle2 },
  CHECKED_IN: { label: "Checked In", className: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400", icon: CheckCircle2 },
  CHECKED_OUT: { label: "Checked Out", className: "bg-muted text-muted-foreground border-border/60", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
};

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "bk-1001",
    bookingCode: "BK-8F3A29",
    guestId: "g-1",
    roomId: "rm-101",
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    totalAmount: 1350,
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    guest: { id: "g-1", name: "Alexander Wright", email: "alexander.wright@sovereign.com" },
    room: { id: "rm-101", roomNumber: "101", floor: 1, roomTypeId: "rt-deluxe-king", status: "VACANT_CLEAN", roomType: FALLBACK_ROOM_TYPES[0] },
    payments: [{ id: "pay-1", amount: 1350, provider: "STRIPE", transactionId: "txn_3N8F9A2019482", status: "COMPLETED", createdAt: new Date().toISOString() }],
  },
  {
    id: "bk-1002",
    bookingCode: "BK-9C4B82",
    guestId: "g-2",
    roomId: "rm-201",
    checkInDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    totalAmount: 1860,
    status: "CHECKED_IN",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    guest: { id: "g-2", name: "Elena Rostova", email: "elena.rostova@luxury.com" },
    room: { id: "rm-201", roomNumber: "201", floor: 2, roomTypeId: "rt-ocean-double", status: "OCCUPIED", roomType: FALLBACK_ROOM_TYPES[1] },
    payments: [{ id: "pay-2", amount: 1860, provider: "SSLCOMMERZ", transactionId: "ssl_99812410294", status: "COMPLETED", createdAt: new Date().toISOString() }],
  },
  {
    id: "bk-1003",
    bookingCode: "BK-3D7E11",
    guestId: "g-3",
    roomId: "rm-301",
    checkInDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 6).toISOString(),
    totalAmount: 7400,
    status: "PENDING_PAYMENT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    guest: { id: "g-3", name: "Lord Harrison Sterling", email: "harrison@sterlingvillas.co.uk" },
    room: { id: "rm-301", roomNumber: "301", floor: 3, roomTypeId: "rt-exec-president", status: "VACANT_CLEAN", roomType: FALLBACK_ROOM_TYPES[2] },
    payments: [],
  },
];

export default function MasterBookingsLedgerPage() {
  const [bookings, setBookings] = React.useState<Booking[]>(SAMPLE_BOOKINGS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchBookings = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<Booking[] | { data: Booking[] }>("/bookings");
      const fetched = (res as { data?: Booking[] }).data || (res as Booking[]);
      if (Array.isArray(fetched) && fetched.length > 0) {
        setBookings(fetched);
      }
    } catch (err) {
      console.warn("Using sample bookings ledger:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guest?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guest?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "ALL" || b.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const tabOptions: { key: string; label: string }[] = [
    { key: "ALL", label: "All Bookings" },
    { key: "PENDING_PAYMENT", label: "Pending Payment" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "CHECKED_IN", label: "Checked In" },
    { key: "CHECKED_OUT", label: "Checked Out" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Master Bookings Audit Ledger</h1>
        <p className="text-sm text-muted-foreground">
          Hotel-wide audit ledger tracking guest reservations, stay timelines, and financial settlements.
        </p>
      </div>

      {/* Control Bar: Search & Status Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Guest Name, Email, or Booking Code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border/60"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Total Shown:</span>
            <Badge variant="secondary" className="font-bold text-foreground">
              {filteredBookings.length} Record{filteredBookings.length === 1 ? "" : "s"}
            </Badge>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex overflow-x-auto gap-2 border-b border-border/50 pb-2 scrollbar-none">
          {tabOptions.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedTab(t.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTab === t.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Audit Table */}
      <Card className="border border-border/60 overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Booking Token</th>
                <th className="px-6 py-4">Guest Profile</th>
                <th className="px-6 py-4">Suite / Room</th>
                <th className="px-6 py-4">Stay Dates</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    No reservations found matching search or status filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const statusInfo = STATUS_BADGE[b.status] || STATUS_BADGE.CONFIRMED;
                  const Icon = statusInfo.icon;
                  const isPaid = b.payments && b.payments.some((p) => p.status === "COMPLETED");

                  const checkInStr = new Date(b.checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  const checkOutStr = new Date(b.checkOutDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });

                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-primary">
                        {b.bookingCode}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{b.guest?.name || "Guest"}</span>
                          <span className="text-xs text-muted-foreground">{b.guest?.email || "No email"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-serif font-semibold text-foreground">
                        {b.room?.roomType?.name || "Suite Accommodations"}<br />
                        <span className="text-xs font-mono text-muted-foreground font-normal">Door #{b.room?.roomNumber || "Unassigned"}</span>
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>{checkInStr} – {checkOutStr}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-foreground">
                        ${b.totalAmount}
                      </td>

                      <td className="px-6 py-4">
                        {isPaid ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-semibold text-xs border">
                            PAID
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 font-semibold text-xs border">
                            PENDING
                          </Badge>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <Badge className={`${statusInfo.className} gap-1.5 py-1 px-2.5 font-semibold text-xs border`}>
                          <Icon className="h-3.5 w-3.5" />
                          {statusInfo.label}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ROW DETAILS DRAWER */}
      <Sheet open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 space-y-6 overflow-y-auto">
          {selectedBooking && (
            <>
              <SheetHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono font-bold text-primary border-primary/30">
                    {selectedBooking.bookingCode}
                  </Badge>
                  <Badge className={STATUS_BADGE[selectedBooking.status]?.className}>
                    {STATUS_BADGE[selectedBooking.status]?.label}
                  </Badge>
                </div>
                <SheetTitle className="font-serif text-2xl font-bold pt-2">
                  Reservation Audit Details
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Complete telemetry, guest identity, and financial transaction records.
                </SheetDescription>
              </SheetHeader>

              {/* Guest Profile Section */}
              <div className="space-y-3 rounded-xl border border-border/60 p-4 bg-muted/20">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <User className="h-4 w-4 text-primary" /> Guest Information
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-foreground">{selectedBooking.guest?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedBooking.guest?.email}</p>
                </div>
              </div>

              {/* Suite & Door Details */}
              <div className="space-y-3 rounded-xl border border-border/60 p-4 bg-muted/20">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Building className="h-4 w-4 text-primary" /> Suite & Inventory Allocation
                </div>
                <div className="space-y-1 text-xs text-foreground">
                  <p className="font-serif font-bold text-sm">{selectedBooking.room?.roomType?.name || "Luxury Suite"}</p>
                  <p className="text-muted-foreground">Assigned Door Unit: <strong>Room #{selectedBooking.room?.roomNumber || "101"}</strong> (Floor {selectedBooking.room?.floor || 1})</p>
                </div>
              </div>

              {/* Timelines */}
              <div className="space-y-3 rounded-xl border border-border/60 p-4 bg-muted/20">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" /> Stay Schedule
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Check-in Date</span>
                    <strong className="text-foreground">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Check-out Date</span>
                    <strong className="text-foreground">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              {/* Financials & Transaction Audit */}
              <div className="space-y-3 rounded-xl border border-border/60 p-4 bg-muted/20">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" /> Settlement & Gateway Telemetry
                </div>

                <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Total Agreed Amount</span>
                  <span className="font-bold font-serif text-foreground">${selectedBooking.totalAmount}</span>
                </div>

                {selectedBooking.payments && selectedBooking.payments.length > 0 ? (
                  selectedBooking.payments.map((p) => (
                    <div key={p.id} className="space-y-1 text-xs text-muted-foreground pt-1">
                      <div className="flex justify-between">
                        <span>Provider: <strong>{p.provider}</strong></span>
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-none font-bold">
                          {p.status}
                        </Badge>
                      </div>
                      <p className="font-mono text-[11px] truncate">Ref: {p.transactionId}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold pt-1">
                    No completed payment transaction registered yet.
                  </p>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

