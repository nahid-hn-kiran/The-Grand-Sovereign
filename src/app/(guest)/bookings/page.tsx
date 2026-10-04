"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Crown,
  AlertCircle,
  ArrowRight,
  Clock,
  Building,
  CreditCard,
  CheckCircle2,
  XCircle,
  Tag,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiClient, ApiError } from "@/lib/api-client";
import { Booking, BookingStatus } from "@/types/booking.types";
import { FALLBACK_ROOM_TYPES } from "@/content/rooms.content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const statusBadgeMap: Record<BookingStatus, { label: string; className: string }> = {
  CONFIRMED: { label: "Confirmed", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold" },
  PENDING_PAYMENT: { label: "Pending Payment", className: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold" },
  CHECKED_IN: { label: "Checked In", className: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" },
  CHECKED_OUT: { label: "Completed", className: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold" },
  CANCELLED: { label: "Cancelled", className: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold" },
};

const SAMPLE_GUEST_BOOKINGS: Booking[] = [
  {
    id: "bk-guest-1",
    bookingCode: "BK-8F3A29",
    guestId: "g-1",
    roomId: "rm-101",
    checkInDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    totalAmount: 1350,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    room: { id: "rm-101", roomNumber: "101", floor: 1, roomTypeId: "rt-deluxe-king", status: "VACANT_CLEAN", roomType: FALLBACK_ROOM_TYPES[0] },
    payments: [{ id: "pay-1", amount: 1350, provider: "STRIPE", transactionId: "txn_3N8F9A2019482", status: "COMPLETED", createdAt: new Date().toISOString() }],
  },
  {
    id: "bk-guest-2",
    bookingCode: "BK-3D7E11",
    guestId: "g-1",
    roomId: "rm-301",
    checkInDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    totalAmount: 7400,
    status: "PENDING_PAYMENT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    room: { id: "rm-301", roomNumber: "301", floor: 3, roomTypeId: "rt-exec-president", status: "VACANT_CLEAN", roomType: FALLBACK_ROOM_TYPES[2] },
    payments: [],
  },
];

export default function GuestBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<Booking[]>(SAMPLE_GUEST_BOOKINGS);
  const [isLoading, setIsLoading] = React.useState(true);
  const [actionError, setActionError] = React.useState<string | null>(null);

  // Modal Cancel State
  const [cancelTargetId, setCancelTargetId] = React.useState<string | null>(null);
  const [isCancelling, setIsCancelling] = React.useState(false);

  React.useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      try {
        const res = await apiClient.get<Booking[] | { data: Booking[] }>("/bookings/me");
        const fetched = (res as { data?: Booking[] }).data || (res as Booking[]);
        if (Array.isArray(fetched) && fetched.length > 0) {
          setBookings(fetched);
        }
      } catch {
        // Keep sample bookings fallback for smooth UX
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const confirmCancelBooking = async () => {
    if (!cancelTargetId) return;
    setIsCancelling(true);
    setActionError(null);

    // Optimistic cancellation update
    setBookings((prev) =>
      prev.map((b) => (b.id === cancelTargetId ? { ...b, status: "CANCELLED" as BookingStatus } : b))
    );

    try {
      await apiClient.patch(`/bookings/${cancelTargetId}/cancel`);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : "Failed to cancel reservation.";
      setActionError(msg);
    } finally {
      setIsCancelling(false);
      setCancelTargetId(null);
    }
  };

  const activeBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING_PAYMENT" || b.status === "CHECKED_IN"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "CHECKED_OUT" || b.status === "CANCELLED"
  );

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto animate-pulse">
            <Crown className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Loading Your Sovereign Stay Itineraries...</p>
        </div>
      </div>
    );
  }

  const renderBookingCard = (booking: Booking) => {
    const statusConfig = statusBadgeMap[booking.status] || statusBadgeMap.PENDING_PAYMENT;
    const isPaid = booking.payments && booking.payments.some((p) => p.status === "COMPLETED");
    const paymentRecord = booking.payments?.[0];

    const checkInDateObj = new Date(booking.checkInDate);
    const checkOutDateObj = new Date(booking.checkOutDate);
    const diffTime = checkOutDateObj.getTime() - checkInDateObj.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const baseRate = booking.room?.roomType?.basePrice || Math.round(booking.totalAmount / nights);
    const subtotal = baseRate * nights;
    const taxesAndFees = Math.round(subtotal * 0.12);

    return (
      <Card key={booking.id} className="border border-border/60 shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
        {/* Pass Header */}
        <CardHeader className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 flex flex-row items-center justify-between border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20">
              <Crown className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Sovereign Itinerary Token
              </span>
              <span className="font-mono text-lg font-bold text-primary">{booking.bookingCode}</span>
            </div>
          </div>
          <Badge variant="outline" className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        </CardHeader>

        {/* Pass Body */}
        <CardContent className="p-6 space-y-6 text-sm">
          {/* Suite & Door Unit Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold block">Reserved Accommodation</span>
              <h3 className="font-serif text-xl font-bold text-foreground">
                {booking.room?.roomType?.name || "Luxury Sovereign Suite"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Assigned Door Unit: <strong className="text-foreground font-mono">Room #{booking.room?.roomNumber || "101"}</strong> (Floor {booking.room?.floor || 1})
              </p>
            </div>

            {/* Check-In / Check-Out Badges */}
            <div className="flex flex-wrap sm:flex-col gap-2 text-right">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[11px] font-semibold gap-1">
                <Clock className="h-3 w-3" /> Check-in from 2:00 PM
              </Badge>
              <Badge variant="outline" className="text-[11px] font-semibold gap-1 text-muted-foreground">
                Check-out by 11:00 AM
              </Badge>
            </div>
          </div>

          {/* Dates & Stay Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl border border-border/50 bg-muted/20 space-y-1">
              <span className="text-[11px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Check-In Date
              </span>
              <p className="font-semibold text-foreground text-sm">
                {checkInDateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/50 bg-muted/20 space-y-1">
              <span className="text-[11px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Check-Out Date
              </span>
              <p className="font-semibold text-foreground text-sm">
                {checkOutDateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/50 bg-muted/20 space-y-1">
              <span className="text-[11px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-primary" /> Duration
              </span>
              <p className="font-semibold text-foreground text-sm">
                {nights} Night{nights === 1 ? "" : "s"} Stay
              </p>
            </div>
          </div>

          {/* Financials & Payment Settlement Breakdown */}
          <div className="rounded-xl border border-border/50 p-4 space-y-3 bg-muted/10">
            <div className="flex items-center justify-between font-semibold text-xs text-muted-foreground uppercase border-b border-border/30 pb-2">
              <span>Financial Breakdown</span>
              <span className="flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                Payment Status:{" "}
                <Badge className={isPaid ? "bg-emerald-500/10 text-emerald-600 border-none font-bold ml-1" : "bg-amber-500/10 text-amber-600 border-none font-bold ml-1"}>
                  {isPaid ? "PAID IN FULL" : "PENDING"}
                </Badge>
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Suite Base Nightly Rate ({nights} nights @ ${baseRate}/night)</span>
                <span className="font-medium text-foreground">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>State Hospitality Taxes & Service Fee (12%)</span>
                <span className="font-medium text-foreground">${taxesAndFees}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border/40">
                <span>Total Amount</span>
                <span className="font-serif text-lg text-primary">${booking.totalAmount}</span>
              </div>
            </div>

            {paymentRecord && (
              <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground flex flex-col sm:flex-row justify-between gap-1">
                <span>Payment Gateway: <strong>{paymentRecord.provider}</strong></span>
                <span className="font-mono">Transaction ID: {paymentRecord.transactionId}</span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Pass Actions */}
        <CardFooter className="p-6 pt-0 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {booking.status === "PENDING_PAYMENT" && (
              <Button size="sm" asChild className="gap-1.5 shadow-md font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white">
                <Link href={`/checkout/${booking.id}`}>
                  Complete Payment Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {(booking.status === "CONFIRMED" || booking.status === "PENDING_PAYMENT") && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCancelTargetId(booking.id)}
              className="text-destructive border-destructive/30 hover:bg-destructive/10 text-xs font-semibold"
            >
              Cancel Reservation
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <Badge className="bg-primary/10 text-primary border-primary/30 font-semibold gap-1.5 py-1 px-3">
          <Crown className="h-3.5 w-3.5" />
          Guest Stay Itineraries
        </Badge>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          My Sovereign Bookings & Travel Pass
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage upcoming stays, review financial breakdowns, complete pending checkout payments, or manage your travel history.
        </p>
      </div>

      {actionError && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">{actionError}</div>
        </div>
      )}

      {/* ACTIVE & UPCOMING STAYS */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Active Stays & Upcoming Reservations
        </h2>

        {activeBookings.length === 0 ? (
          <Card className="border border-border/50 p-8 text-center space-y-3 bg-card/40">
            <p className="text-sm text-muted-foreground">You currently have no active or upcoming stay itineraries.</p>
            <Button asChild size="sm">
              <Link href="/rooms">Explore Suites & Book Your Next Stay</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">{activeBookings.map((b) => renderBookingCard(b))}</div>
        )}
      </div>

      {/* PAST TRAVEL HISTORY */}
      {pastBookings.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border/40">
          <h2 className="font-serif text-2xl font-bold text-foreground">Past Travel History</h2>
          <div className="space-y-6">{pastBookings.map((b) => renderBookingCard(b))}</div>
        </div>
      )}

      {/* CANCELLATION CONFIRMATION MODAL */}
      <Dialog open={!!cancelTargetId} onOpenChange={(open) => !open && setCancelTargetId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Cancel Suite Reservation?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Are you sure you wish to cancel this reservation? Cancellations made 48 hours prior to check-in incur zero penalties.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setCancelTargetId(null)} disabled={isCancelling}>
              Keep Reservation
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelBooking}
              disabled={isCancelling}
              className="font-semibold"
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

