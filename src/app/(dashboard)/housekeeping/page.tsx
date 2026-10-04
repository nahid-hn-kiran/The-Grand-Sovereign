"use client";

import * as React from "react";
import { Sparkles, CheckCircle2, Clock, RefreshCw, ShieldCheck } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Room } from "@/types/room.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TurnoverRoomItem extends Room {
  priorityLabel: "Urgent" | "High" | "Standard";
  elapsedMinutes: number;
}

const MOCK_TURNOVER_ROOMS: TurnoverRoomItem[] = [
  {
    id: "r-103",
    roomNumber: "103",
    floor: 1,
    status: "VACANT_DIRTY",
    roomTypeId: "rt-ocean-double",
    roomType: {
      id: "rt-ocean-double",
      name: "Oceanfront Double Queen",
      slug: "ocean-double",
      description: "",
      basePrice: 620,
      capacity: 4,
      amenities: [],
      images: [],
    },
    priorityLabel: "Urgent",
    elapsedMinutes: 42,
  },
  {
    id: "r-204",
    roomNumber: "204",
    floor: 2,
    status: "VACANT_DIRTY",
    roomTypeId: "rt-ocean-double",
    roomType: {
      id: "rt-ocean-double",
      name: "Oceanfront Double Queen",
      slug: "ocean-double",
      description: "",
      basePrice: 620,
      capacity: 4,
      amenities: [],
      images: [],
    },
    priorityLabel: "High",
    elapsedMinutes: 25,
  },
  {
    id: "r-303",
    roomNumber: "303",
    floor: 3,
    status: "VACANT_DIRTY",
    roomTypeId: "rt-exec-president",
    roomType: {
      id: "rt-exec-president",
      name: "Presidential Sky Villa",
      slug: "exec-president",
      description: "",
      basePrice: 1850,
      capacity: 6,
      amenities: [],
      images: [],
    },
    priorityLabel: "Standard",
    elapsedMinutes: 12,
  },
];

export default function HousekeepingPage() {
  const [dirtyRooms, setDirtyRooms] = React.useState<TurnoverRoomItem[]>(MOCK_TURNOVER_ROOMS);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchDirtyRooms = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<Room[] | { data: Room[] }>("/rooms");
      const fetched = (res as { data?: Room[] }).data || (res as Room[]);
      if (Array.isArray(fetched) && fetched.length > 0) {
        const dirtyOnly = fetched
          .filter((r) => r.status === "VACANT_DIRTY")
          .map((r, idx) => ({
            ...r,
            priorityLabel: (idx === 0 ? "Urgent" : idx === 1 ? "High" : "Standard") as
              | "Urgent"
              | "High"
              | "Standard",
            elapsedMinutes: (idx + 1) * 15,
          }));
        setDirtyRooms(dirtyOnly.length > 0 ? dirtyOnly : MOCK_TURNOVER_ROOMS);
      }
    } catch {
      // Retain mock data on offline
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDirtyRooms();
  }, [fetchDirtyRooms]);

  const handleMarkSanitized = async (roomId: string) => {
    setDirtyRooms((prev) => prev.filter((r) => r.id !== roomId));

    try {
      await apiClient.patch(`/rooms/${roomId}/status`, { status: "VACANT_CLEAN" });
    } catch {
      fetchDirtyRooms();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Housekeeping Sanitation Board
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Room Turnover Queue</h1>
          <p className="text-sm text-muted-foreground">
            Active suite turnover tasks, priority queueing, and one-click sanitation sign-off.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchDirtyRooms} disabled={isLoading} className="gap-2 self-start sm:self-auto">
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh Queue
        </Button>
      </div>

      {dirtyRooms.length === 0 ? (
        <Card className="border border-border/50 p-12 text-center space-y-3 bg-card/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-xl font-serif font-bold text-foreground">All Suites Clean & Sanitized</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No rooms currently require housekeeping turnover. All vacant suites are verified ready for arrival.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dirtyRooms.map((room) => (
            <Card key={room.id} className="border border-amber-500/30 bg-amber-500/5 shadow-md flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-5 pb-3 border-b border-amber-500/20 bg-amber-500/10 flex flex-row items-center justify-between">
                <div>
                  <span className="font-mono text-2xl font-bold text-foreground">Suite {room.roomNumber}</span>
                  <p className="text-xs text-muted-foreground font-medium">Floor {room.floor}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    room.priorityLabel === "Urgent" && "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 font-bold",
                    room.priorityLabel === "High" && "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold",
                    room.priorityLabel === "Standard" && "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                  )}
                >
                  {room.priorityLabel} Priority
                </Badge>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suite Category</span>
                  <p className="text-sm font-semibold text-foreground">{room.roomType?.name || "Luxury Suite"}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/60 p-2.5 rounded-lg border border-border/40">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Turnover Queue Time: <strong className="text-foreground">{room.elapsedMinutes} mins ago</strong></span>
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0">
                <Button
                  onClick={() => handleMarkSanitized(room.id)}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-md"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Mark Sanitized & Ready
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
