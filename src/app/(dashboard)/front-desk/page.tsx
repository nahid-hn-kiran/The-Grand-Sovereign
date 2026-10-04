"use client";

import * as React from "react";
import {
  ConciergeBell,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  RefreshCw,
  LogIn,
  LogOut as LogOutIcon,
  Calendar,
  Building,
  User,
  CreditCard,
  Layers,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Room, RoomStatus } from "@/types/room.types";
import { Booking } from "@/types/booking.types";
import { FALLBACK_ROOM_TYPES } from "@/content/rooms.content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const INITIAL_MOCK_ROOMS: Room[] = [
  { id: "r-101", roomNumber: "101", floor: 1, status: "VACANT_CLEAN", roomTypeId: "rt-deluxe-king", roomType: FALLBACK_ROOM_TYPES[0] },
  { id: "r-102", roomNumber: "102", floor: 1, status: "OCCUPIED", roomTypeId: "rt-deluxe-king", roomType: FALLBACK_ROOM_TYPES[0] },
  { id: "r-103", roomNumber: "103", floor: 1, status: "VACANT_DIRTY", roomTypeId: "rt-ocean-double", roomType: FALLBACK_ROOM_TYPES[1] },
  { id: "r-104", roomNumber: "104", floor: 1, status: "VACANT_CLEAN", roomTypeId: "rt-ocean-double", roomType: FALLBACK_ROOM_TYPES[1] },
  { id: "r-201", roomNumber: "201", floor: 2, status: "OCCUPIED", roomTypeId: "rt-deluxe-king", roomType: FALLBACK_ROOM_TYPES[0] },
  { id: "r-202", roomNumber: "202", floor: 2, status: "VACANT_CLEAN", roomTypeId: "rt-deluxe-king", roomType: FALLBACK_ROOM_TYPES[0] },
  { id: "r-203", roomNumber: "203", floor: 2, status: "OUT_OF_SERVICE", roomTypeId: "rt-ocean-double", roomType: FALLBACK_ROOM_TYPES[1] },
  { id: "r-204", roomNumber: "204", floor: 2, status: "VACANT_DIRTY", roomTypeId: "rt-ocean-double", roomType: FALLBACK_ROOM_TYPES[1] },
  { id: "r-301", roomNumber: "301", floor: 3, status: "VACANT_CLEAN", roomTypeId: "rt-exec-president", roomType: FALLBACK_ROOM_TYPES[2] },
  { id: "r-302", roomNumber: "302", floor: 3, status: "OCCUPIED", roomTypeId: "rt-exec-president", roomType: FALLBACK_ROOM_TYPES[2] },
];

const SAMPLE_ARRIVALS: Booking[] = [
  {
    id: "bk-1001",
    bookingCode: "BK-8F3A29",
    guestId: "g-1",
    roomId: "r-101",
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    totalAmount: 1350,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    guest: { id: "g-1", name: "Alexander Wright", email: "alexander.wright@sovereign.com" },
    room: { id: "r-101", roomNumber: "101", floor: 1, roomTypeId: "rt-deluxe-king", status: "VACANT_CLEAN", roomType: FALLBACK_ROOM_TYPES[0] },
    payments: [{ id: "p-1", amount: 1350, provider: "STRIPE", transactionId: "txn_3N8F9A2019482", status: "COMPLETED", createdAt: new Date().toISOString() }],
  },
];

const SAMPLE_DEPARTURES: Booking[] = [
  {
    id: "bk-1002",
    bookingCode: "BK-9C4B82",
    guestId: "g-2",
    roomId: "r-102",
    checkInDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    checkOutDate: new Date().toISOString(),
    totalAmount: 1860,
    status: "CHECKED_IN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    guest: { id: "g-2", name: "Elena Rostova", email: "elena.rostova@luxury.com" },
    room: { id: "r-102", roomNumber: "102", floor: 1, roomTypeId: "rt-deluxe-king", status: "OCCUPIED", roomType: FALLBACK_ROOM_TYPES[0] },
    payments: [{ id: "p-2", amount: 1860, provider: "SSLCOMMERZ", transactionId: "ssl_99812410294", status: "COMPLETED", createdAt: new Date().toISOString() }],
  },
];

const statusBadgeConfig: Record<RoomStatus, { label: string; className: string }> = {
  VACANT_CLEAN: { label: "Vacant Clean", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold" },
  VACANT_DIRTY: { label: "Needs Turnover", className: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold" },
  OCCUPIED: { label: "Occupied", className: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" },
  OUT_OF_SERVICE: { label: "Maintenance Lock", className: "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold" },
};

export default function FrontDeskPage() {
  const [activeTab, setActiveTab] = React.useState<"rack" | "arrivals" | "departures">("rack");
  const [rooms, setRooms] = React.useState<Room[]>(INITIAL_MOCK_ROOMS);
  const [bookings, setBookings] = React.useState<Booking[]>([...SAMPLE_ARRIVALS, ...SAMPLE_DEPARTURES]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.allSettled([
        apiClient.get<Room[] | { data: Room[] }>("/rooms"),
        apiClient.get<Booking[] | { data: Booking[] }>("/bookings"),
      ]);

      if (roomsRes.status === "fulfilled") {
        const fetchedRooms = (roomsRes.value as { data?: Room[] }).data || (roomsRes.value as Room[]);
        if (Array.isArray(fetchedRooms) && fetchedRooms.length > 0) {
          setRooms(fetchedRooms);
        }
      }

      if (bookingsRes.status === "fulfilled") {
        const fetchedBookings = (bookingsRes.value as { data?: Booking[] }).data || (bookingsRes.value as Booking[]);
        if (Array.isArray(fetchedBookings) && fetchedBookings.length > 0) {
          setBookings(fetchedBookings);
        }
      }
    } catch {
      // Retain mock data on offline
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update physical room status
  const updateRoomStatus = async (roomId: string, newStatus: RoomStatus) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r)));
    try {
      await apiClient.patch(`/rooms/${roomId}/status`, { status: newStatus });
    } catch {
      // Keep optimistic
    }
  };

  // 1-Click Check In Guest
  const handleCheckInGuest = async (booking: Booking) => {
    // Optimistic updates
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "CHECKED_IN" } : b)));
    if (booking.roomId) {
      setRooms((prev) => prev.map((r) => (r.id === booking.roomId ? { ...r, status: "OCCUPIED" } : r)));
    }

    try {
      await apiClient.patch(`/bookings/${booking.id}/status`, { status: "CHECKED_IN" });
    } catch {
      // Keep optimistic state
    }
  };

  // 1-Click Check Out Guest
  const handleCheckOutGuest = async (booking: Booking) => {
    // Optimistic updates
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: "CHECKED_OUT" } : b)));
    if (booking.roomId) {
      setRooms((prev) => prev.map((r) => (r.id === booking.roomId ? { ...r, status: "VACANT_DIRTY" } : r)));
    }

    try {
      await apiClient.patch(`/bookings/${booking.id}/status`, { status: "CHECKED_OUT" });
    } catch {
      // Keep optimistic state
    }
  };

  const totalCount = rooms.length;
  const vacantCleanCount = rooms.filter((r) => r.status === "VACANT_CLEAN").length;
  const vacantDirtyCount = rooms.filter((r) => r.status === "VACANT_DIRTY").length;
  const occupiedCount = rooms.filter((r) => r.status === "OCCUPIED").length;

  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);

  // Filter Arrivals & Departures
  const expectedArrivals = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING_PAYMENT");
  const expectedDepartures = bookings.filter((b) => b.status === "CHECKED_IN");

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
            <ConciergeBell className="h-3.5 w-3.5" />
            Front Desk Operations Bar
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Front Desk Reception & Rack</h1>
          <p className="text-sm text-muted-foreground">
            Manage live room allocations, 1-click arrival check-ins, and departure checkout turnover.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading} className="gap-2 self-start sm:self-auto">
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh Desk Telemetry
        </Button>
      </div>

      {/* Summary Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/60">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Fleet</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="font-serif text-3xl font-bold text-foreground">{totalCount}</span>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Vacant Clean
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400">{vacantCleanCount}</span>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Needs Turnover
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="font-serif text-3xl font-bold text-amber-600 dark:text-amber-400">{vacantDirtyCount}</span>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5" /> Occupied
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="font-serif text-3xl font-bold text-blue-600 dark:text-blue-400">{occupiedCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* 3-TAB OPERATIONAL NAVIGATION */}
      <div className="flex border-b border-border/50 gap-4">
        <button
          onClick={() => setActiveTab("rack")}
          className={cn(
            "pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors",
            activeTab === "rack"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Layers className="h-4 w-4" />
          Visual Room Rack
        </button>

        <button
          onClick={() => setActiveTab("arrivals")}
          className={cn(
            "pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors",
            activeTab === "arrivals"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <LogIn className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Today&apos;s Arrivals ({expectedArrivals.length})
        </button>

        <button
          onClick={() => setActiveTab("departures")}
          className={cn(
            "pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors",
            activeTab === "departures"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <LogOutIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          Today&apos;s Departures ({expectedDepartures.length})
        </button>
      </div>

      {/* TAB 1: VISUAL ROOM RACK */}
      {activeTab === "rack" && (
        <div className="space-y-8">
          {floors.map((floorNum) => {
            const floorRooms = rooms.filter((r) => r.floor === floorNum);
            return (
              <div key={floorNum} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                  <span className="font-serif font-bold text-lg text-foreground">Floor {floorNum}</span>
                  <Badge variant="outline" className="text-[10px] font-medium">
                    {floorRooms.length} Rooms
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {floorRooms.map((room) => {
                    const statusInfo = statusBadgeConfig[room.status] || statusBadgeConfig.VACANT_CLEAN;
                    return (
                      <Card
                        key={room.id}
                        className={cn(
                          "border shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between",
                          room.status === "VACANT_CLEAN" && "border-emerald-500/30 bg-emerald-500/5",
                          room.status === "VACANT_DIRTY" && "border-amber-500/30 bg-amber-500/5",
                          room.status === "OCCUPIED" && "border-blue-500/30 bg-blue-500/5",
                          room.status === "OUT_OF_SERVICE" && "border-rose-500/30 bg-rose-500/5"
                        )}
                      >
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                          <span className="font-mono text-xl font-bold text-foreground">Suite {room.roomNumber}</span>
                          <Badge variant="outline" className={statusInfo.className}>
                            {statusInfo.label}
                          </Badge>
                        </CardHeader>

                        <CardContent className="p-4 pt-1 space-y-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {room.roomType?.name || "Luxury Suite"}
                          </p>

                          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border/40">
                            <Button
                              size="sm"
                              variant={room.status === "VACANT_CLEAN" ? "default" : "outline"}
                              onClick={() => updateRoomStatus(room.id, "VACANT_CLEAN")}
                              className="h-7 text-[10px] px-1.5"
                            >
                              Set Clean
                            </Button>
                            <Button
                              size="sm"
                              variant={room.status === "VACANT_DIRTY" ? "default" : "outline"}
                              onClick={() => updateRoomStatus(room.id, "VACANT_DIRTY")}
                              className="h-7 text-[10px] px-1.5"
                            >
                              Turnover
                            </Button>
                            <Button
                              size="sm"
                              variant={room.status === "OUT_OF_SERVICE" ? "destructive" : "outline"}
                              onClick={() => updateRoomStatus(room.id, "OUT_OF_SERVICE")}
                              className="h-7 text-[10px] px-1.5"
                            >
                              Lock
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TODAY'S EXPECTED ARRIVALS */}
      {activeTab === "arrivals" && (
        <div className="space-y-4">
          <Card className="border border-border/60 bg-card p-4">
            <h2 className="font-serif text-lg font-bold">Confirmed Arrival Queue</h2>
            <p className="text-xs text-muted-foreground">Verify guest identity, confirm door unit, and trigger 1-click check in.</p>
          </Card>

          {expectedArrivals.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground border-border/60">
              No expected arrivals pending check-in.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expectedArrivals.map((b) => (
                <Card key={b.id} className="border border-emerald-500/30 bg-emerald-500/5 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="font-mono text-xs font-bold border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                          {b.bookingCode}
                        </Badge>
                        <h3 className="font-serif font-bold text-lg text-foreground mt-1">{b.guest?.name || "Guest Arrival"}</h3>
                        <p className="text-xs text-muted-foreground">{b.guest?.email}</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-600 font-bold text-xs border-none">
                        {b.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/40">
                      <div>
                        <span className="text-muted-foreground block">Assigned Suite</span>
                        <strong className="text-foreground">{b.room?.roomType?.name || "Deluxe Suite"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Door Unit</span>
                        <strong className="text-foreground">Room #{b.room?.roomNumber || "101"}</strong>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleCheckInGuest(b)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-md"
                  >
                    <LogIn className="h-4 w-4" />
                    Check In Guest (Set Occupied)
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TODAY'S EXPECTED DEPARTURES */}
      {activeTab === "departures" && (
        <div className="space-y-4">
          <Card className="border border-border/60 bg-card p-4">
            <h2 className="font-serif text-lg font-bold">Active Checked-In Guests</h2>
            <p className="text-xs text-muted-foreground">Perform 1-click check out and automatically flag door for housekeeping turnover.</p>
          </Card>

          {expectedDepartures.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground border-border/60">
              No active guests scheduled for departure.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expectedDepartures.map((b) => (
                <Card key={b.id} className="border border-amber-500/30 bg-amber-500/5 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="font-mono text-xs font-bold border-amber-500/40 text-amber-600 dark:text-amber-400">
                          {b.bookingCode}
                        </Badge>
                        <h3 className="font-serif font-bold text-lg text-foreground mt-1">{b.guest?.name || "In-House Guest"}</h3>
                        <p className="text-xs text-muted-foreground">{b.guest?.email}</p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-600 font-bold text-xs border-none">
                        {b.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/40">
                      <div>
                        <span className="text-muted-foreground block">Assigned Suite</span>
                        <strong className="text-foreground">{b.room?.roomType?.name || "Deluxe Suite"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Door Unit</span>
                        <strong className="text-foreground">Room #{b.room?.roomNumber || "102"}</strong>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleCheckOutGuest(b)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 shadow-md"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Check Out Guest (Set Needs Turnover)
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

