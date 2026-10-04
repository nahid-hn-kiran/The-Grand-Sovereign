"use client";

import * as React from "react";
import { ConciergeBell, CheckCircle2, AlertTriangle, UserCheck, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Room, RoomStatus } from "@/types/room.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const INITIAL_MOCK_ROOMS: Room[] = [
  { id: "r-101", roomNumber: "101", floor: 1, status: "VACANT_CLEAN", roomTypeId: "rt-deluxe-king", roomType: { id: "rt-deluxe-king", name: "Deluxe King", slug: "deluxe-king", description: "", basePrice: 450, capacity: 2, amenities: [], images: [] } },
  { id: "r-102", roomNumber: "102", floor: 1, status: "OCCUPIED", roomTypeId: "rt-deluxe-king", roomType: { id: "rt-deluxe-king", name: "Deluxe King", slug: "deluxe-king", description: "", basePrice: 450, capacity: 2, amenities: [], images: [] } },
  { id: "r-103", roomNumber: "103", floor: 1, status: "VACANT_DIRTY", roomTypeId: "rt-ocean-double", roomType: { id: "rt-ocean-double", name: "Ocean Double", slug: "ocean-double", description: "", basePrice: 620, capacity: 4, amenities: [], images: [] } },
  { id: "r-104", roomNumber: "104", floor: 1, status: "VACANT_CLEAN", roomTypeId: "rt-ocean-double", roomType: { id: "rt-ocean-double", name: "Ocean Double", slug: "ocean-double", description: "", basePrice: 620, capacity: 4, amenities: [], images: [] } },
  { id: "r-201", roomNumber: "201", floor: 2, status: "OCCUPIED", roomTypeId: "rt-deluxe-king", roomType: { id: "rt-deluxe-king", name: "Deluxe King", slug: "deluxe-king", description: "", basePrice: 450, capacity: 2, amenities: [], images: [] } },
  { id: "r-202", roomNumber: "202", floor: 2, status: "VACANT_CLEAN", roomTypeId: "rt-deluxe-king", roomType: { id: "rt-deluxe-king", name: "Deluxe King", slug: "deluxe-king", description: "", basePrice: 450, capacity: 2, amenities: [], images: [] } },
  { id: "r-203", roomNumber: "203", floor: 2, status: "OUT_OF_SERVICE", roomTypeId: "rt-ocean-double", roomType: { id: "rt-ocean-double", name: "Ocean Double", slug: "ocean-double", description: "", basePrice: 620, capacity: 4, amenities: [], images: [] } },
  { id: "r-204", roomNumber: "204", floor: 2, status: "VACANT_DIRTY", roomTypeId: "rt-ocean-double", roomType: { id: "rt-ocean-double", name: "Ocean Double", slug: "ocean-double", description: "", basePrice: 620, capacity: 4, amenities: [], images: [] } },
  { id: "r-301", roomNumber: "301", floor: 3, status: "VACANT_CLEAN", roomTypeId: "rt-exec-president", roomType: { id: "rt-exec-president", name: "Presidential Sky Villa", slug: "exec-president", description: "", basePrice: 1850, capacity: 6, amenities: [], images: [] } },
  { id: "r-302", roomNumber: "302", floor: 3, status: "OCCUPIED", roomTypeId: "rt-exec-president", roomType: { id: "rt-exec-president", name: "Presidential Sky Villa", slug: "exec-president", description: "", basePrice: 1850, capacity: 6, amenities: [], images: [] } },
];

const statusBadgeConfig: Record<RoomStatus, { label: string; className: string }> = {
  VACANT_CLEAN: { label: "Vacant Clean", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold" },
  VACANT_DIRTY: { label: "Needs Turnover", className: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold" },
  OCCUPIED: { label: "Occupied", className: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" },
  OUT_OF_SERVICE: { label: "Maintenance Lock", className: "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold" },
};

export default function FrontDeskPage() {
  const [rooms, setRooms] = React.useState<Room[]>(INITIAL_MOCK_ROOMS);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchRooms = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<Room[] | { data: Room[] }>("/rooms");
      const fetched = (res as { data?: Room[] }).data || (res as Room[]);
      if (Array.isArray(fetched) && fetched.length > 0) {
        setRooms(fetched);
      }
    } catch {
      // Retain mock rooms on backend offline
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const updateRoomStatus = async (roomId: string, newStatus: RoomStatus) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r)));
    try {
      await apiClient.patch(`/rooms/${roomId}/status`, { status: newStatus });
    } catch {
      fetchRooms();
    }
  };

  const totalCount = rooms.length;
  const vacantCleanCount = rooms.filter((r) => r.status === "VACANT_CLEAN").length;
  const vacantDirtyCount = rooms.filter((r) => r.status === "VACANT_DIRTY").length;
  const occupiedCount = rooms.filter((r) => r.status === "OCCUPIED").length;

  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
            <ConciergeBell className="h-3.5 w-3.5" />
            Front Desk Reception Control
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Visual Room Rack</h1>
          <p className="text-sm text-muted-foreground">
            Real-time physical room matrix, occupancy indicators, and operational status overrides.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchRooms} disabled={isLoading} className="gap-2 self-start sm:self-auto">
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh Matrix
        </Button>
      </div>

      {/* Summary Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/60">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Inventory</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="font-serif text-3xl font-bold text-foreground">{totalCount}</span>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Ready & Clean
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
              <UserCheck className="h-3.5 w-3.5" /> Occupied Guests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="font-serif text-3xl font-bold text-blue-600 dark:text-blue-400">{occupiedCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* Room Rack Matrix grouped by floor */}
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
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xl font-bold text-foreground">Suite {room.roomNumber}</span>
                        </div>
                        <Badge variant="outline" className={statusInfo.className}>
                          {statusInfo.label}
                        </Badge>
                      </CardHeader>

                      <CardContent className="p-4 pt-1 space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {room.roomType?.name || "Luxury Suite"}
                        </p>

                        {/* Quick Operational Status Override Triggers */}
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
    </div>
  );
}
