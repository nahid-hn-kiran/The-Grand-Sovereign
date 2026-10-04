"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { Calendar, Users, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiClient, ApiError } from "@/lib/api-client";
import { RoomType } from "@/types/room.types";
import { Booking } from "@/types/booking.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookingWidgetProps {
  roomType: RoomType;
}

export function BookingWidget({ roomType }: BookingWidgetProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tomorrowStr = format(addDays(new Date(), 2), "yyyy-MM-dd");

  const [checkIn, setCheckIn] = React.useState(todayStr);
  const [checkOut, setCheckOut] = React.useState(tomorrowStr);
  const [guestsCount, setGuestsCount] = React.useState(2);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const checkInDateObj = new Date(checkIn);
  const checkOutDateObj = new Date(checkOut);

  const nights = React.useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = differenceInCalendarDays(checkOutDateObj, checkInDateObj);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const subtotal = roomType.basePrice * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const totalAmount = subtotal + serviceFee;

  const handleReserve = async () => {
    setErrorMessage(null);

    if (nights <= 0) {
      setErrorMessage("Check-out date must be after check-in date.");
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=/rooms/${roomType.slug}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post<Booking | { data: Booking }>("/bookings", {
        roomTypeId: roomType.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestsCount,
      });

      const booking = (res as { data?: Booking }).data || (res as Booking);
      const bookingId = booking?.id || (booking as unknown as { _id?: string })._id;

      if (bookingId) {
        router.push(`/checkout/${bookingId}`);
      } else {
        router.push("/bookings");
      }
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : "Failed to create reservation. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border/50 shadow-2xl bg-card/80 backdrop-blur-md overflow-hidden sticky top-24">
      <CardHeader className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-3xl font-bold text-foreground">${roomType.basePrice}</span>
            <span className="text-sm text-muted-foreground">/ night</span>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary font-semibold text-xs">
            Guaranteed Best Rate
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {errorMessage && (
          <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Date Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Check-In
            </label>
            <Input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="text-xs font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Check-Out
            </label>
            <Input
              type="date"
              min={checkIn || todayStr}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="text-xs font-medium"
            />
          </div>
        </div>

        {/* Guests Count */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" />
            Guests
          </label>
          <select
            value={guestsCount}
            onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {Array.from({ length: roomType.capacity }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing Breakdown */}
        {nights > 0 && (
          <div className="space-y-2 pt-3 border-t border-border/40 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>
                ${roomType.basePrice} × {nights} {nights === 1 ? "night" : "nights"}
              </span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Hospitality & Service Fee (12%)</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/40 font-semibold text-base text-foreground">
              <span>Total Due</span>
              <span className="font-serif text-lg font-bold text-primary">${totalAmount}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-3">
        <Button
          onClick={handleReserve}
          disabled={isSubmitting || nights <= 0}
          className="w-full h-12 text-base font-semibold shadow-lg group"
        >
          {isSubmitting ? "Securing Reservation..." : isAuthenticated ? "Reserve Suite Now" : "Sign In & Reserve"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Free Cancellation up to 48 hours before check-in</span>
        </div>
      </CardFooter>
    </Card>
  );
}
