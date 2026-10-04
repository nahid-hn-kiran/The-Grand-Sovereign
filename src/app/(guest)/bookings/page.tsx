"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Crown, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiClient, ApiError } from "@/lib/api-client";
import { Booking, BookingStatus } from "@/types/booking.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusBadgeMap: Record<BookingStatus, { label: string; className: string }> = {
  CONFIRMED: { label: "Confirmed", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  PENDING_PAYMENT: { label: "Pending Payment", className: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  CHECKED_IN: { label: "Checked In", className: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  CHECKED_OUT: { label: "Completed", className: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  CANCELLED: { label: "Cancelled", className: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400" },
};

export default function GuestBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [actionError, setActionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      try {
        const res = await apiClient.get<Booking[] | { data: Booking[] }>("/bookings/me");
        const fetched = (res as { data?: Booking[] }).data || (res as Booking[]);
        if (Array.isArray(fetched)) {
          setBookings(fetched);
        } else {
          setBookings([]);
        }
      } catch {
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    setActionError(null);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" as BookingStatus } : b))
    );

    try {
      await apiClient.patch(`/bookings/${id}/cancel`);
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : "Failed to cancel reservation.";
      setActionError(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto animate-pulse">
            <Crown className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Loading Your Sovereign Reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge className="bg-primary/10 text-primary border-primary/30 font-semibold gap-1.5 py-1 px-3">
          <Crown className="h-3.5 w-3.5" />
          Guest Reservation History
        </Badge>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          My Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your upcoming stays, view booking references, or proceed with pending checkouts.
        </p>
      </div>

      {actionError && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">{actionError}</div>
        </div>
      )}

      {bookings.length === 0 ? (
        <Card className="border border-border/50 p-12 text-center space-y-4 bg-card/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-foreground">No Reservations Found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You haven&apos;t reserved any Sovereign suites yet. Explore our handcrafted accommodations catalog to plan your luxury stay.
            </p>
          </div>
          <Button asChild size="lg" className="shadow-md">
            <Link href="/rooms">
              Explore Suites
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const statusConfig = statusBadgeMap[booking.status] || statusBadgeMap.PENDING_PAYMENT;
            return (
              <Card key={booking.id} className="border border-border/50 shadow-md overflow-hidden bg-card/60">
                <CardHeader className="p-6 bg-muted/20 flex flex-row items-center justify-between border-b border-border/40">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Booking Reference
                    </span>
                    <span className="font-mono text-lg font-bold text-foreground">{booking.bookingCode}</span>
                  </div>
                  <Badge variant="outline" className={statusConfig.className}>
                    {statusConfig.label}
                  </Badge>
                </CardHeader>

                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Check-In</span>
                    <p className="font-semibold text-foreground">{booking.checkInDate}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Check-Out</span>
                    <p className="font-semibold text-foreground">{booking.checkOutDate}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Total Amount</span>
                    <p className="font-serif font-bold text-lg text-primary">${booking.totalAmount}</p>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 border-t border-border/40 flex items-center justify-between gap-4">
                  {booking.status === "PENDING_PAYMENT" && (
                    <Button size="sm" asChild className="gap-1.5 shadow-sm">
                      <Link href={`/checkout/${booking.id}`}>
                        Complete Payment
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}

                  {booking.status !== "CANCELLED" && booking.status !== "CHECKED_OUT" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      Cancel Reservation
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
