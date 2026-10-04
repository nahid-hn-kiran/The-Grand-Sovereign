"use client";

import * as React from "react";
import Link from "next/link";
import {
  BedDouble,
  Plus,
  Search,
  Layers,
  Filter,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Ban,
  Building,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { RoomStatus, PhysicalRoom } from "@/types/room.types";
import { FALLBACK_ROOM_TYPES } from "@/content/rooms.content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const STATUS_CONFIG: Record<RoomStatus, { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }> = {
  VACANT_CLEAN: { label: "Vacant Clean", badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400", icon: CheckCircle },
  VACANT_DIRTY: { label: "Vacant Dirty", badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400", icon: AlertTriangle },
  OCCUPIED: { label: "Occupied", badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400", icon: UserCheck },
  OUT_OF_SERVICE: { label: "Out of Service", badgeClass: "bg-destructive/10 text-destructive border-destructive/30", icon: Ban },
};

const SAMPLE_PHYSICAL_ROOMS: PhysicalRoom[] = [
  { id: "rm-101", roomNumber: "101", floor: 1, roomTypeId: "rt-deluxe-king", status: "VACANT_CLEAN", roomType: FALLBACK_ROOM_TYPES[0] },
  { id: "rm-102", roomNumber: "102", floor: 1, roomTypeId: "rt-deluxe-king", status: "OCCUPIED", roomType: FALLBACK_ROOM_TYPES[0] },
  { id: "rm-201", roomNumber: "201", floor: 2, roomTypeId: "rt-ocean-double", status: "VACANT_DIRTY", roomType: FALLBACK_ROOM_TYPES[1] },
  { id: "rm-202", roomNumber: "202", floor: 2, roomTypeId: "rt-ocean-double", status: "VACANT_CLEAN", roomType: FALLBACK_ROOM_TYPES[1] },
  { id: "rm-301", roomNumber: "301", floor: 3, roomTypeId: "rt-exec-president", status: "OCCUPIED", roomType: FALLBACK_ROOM_TYPES[2] },
  { id: "rm-302", roomNumber: "302", floor: 3, roomTypeId: "rt-exec-president", status: "OUT_OF_SERVICE", roomType: FALLBACK_ROOM_TYPES[2] },
];

export default function AdminPhysicalRoomsPage() {
  const [rooms, setRooms] = React.useState<PhysicalRoom[]>(SAMPLE_PHYSICAL_ROOMS);
  const [roomTypes, setRoomTypes] = React.useState(FALLBACK_ROOM_TYPES);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [floorFilter, setFloorFilter] = React.useState<string>("ALL");
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL");
  const [isProvisionOpen, setIsProvisionOpen] = React.useState(false);

  // Form State for Provisioning
  const [provisionForm, setProvisionForm] = React.useState({
    roomNumber: "",
    floor: 1,
    roomTypeId: FALLBACK_ROOM_TYPES[0].id,
  });

  const fetchRoomsAndTypes = React.useCallback(async () => {
    try {
      const [roomsRes, typesRes] = await Promise.allSettled([
        apiClient.get<PhysicalRoom[] | { data: PhysicalRoom[] }>("/rooms"),
        apiClient.get("/rooms/types"),
      ]);

      if (roomsRes.status === "fulfilled") {
        const fetchedRooms = (roomsRes.value as { data?: PhysicalRoom[] }).data || (roomsRes.value as PhysicalRoom[]);
        if (Array.isArray(fetchedRooms) && fetchedRooms.length > 0) {
          setRooms(fetchedRooms);
        }
      }

      if (typesRes.status === "fulfilled") {
        const fetchedTypes = (typesRes.value as { data?: typeof FALLBACK_ROOM_TYPES }).data || (typesRes.value as typeof FALLBACK_ROOM_TYPES);
        if (Array.isArray(fetchedTypes) && fetchedTypes.length > 0) {
          setRoomTypes(fetchedTypes);
          if (!provisionForm.roomTypeId) {
            setProvisionForm((p) => ({ ...p, roomTypeId: fetchedTypes[0].id }));
          }
        }
      }
    } catch (err) {
      console.warn("Using sample inventory data:", err);
    }
  }, [provisionForm.roomTypeId]);

  React.useEffect(() => {
    fetchRoomsAndTypes();
  }, [fetchRoomsAndTypes]);

  // Handle status PATCH override
  const handleStatusChange = async (roomId: string, newStatus: RoomStatus) => {
    try {
      await apiClient.patch(`/rooms/${roomId}/status`, { status: newStatus });
      setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r)));
    } catch {
      // Optimistic fallback
      setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r)));
    }
  };

  // Handle Provisioning Submit
  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      roomNumber: provisionForm.roomNumber,
      floor: Number(provisionForm.floor),
      roomTypeId: provisionForm.roomTypeId,
    };

    try {
      await apiClient.post("/rooms", payload);
      setIsProvisionOpen(false);
      setProvisionForm({ roomNumber: "", floor: 1, roomTypeId: roomTypes[0]?.id || "" });
      await fetchRoomsAndTypes();
    } catch {
      // Optimistic fallback addition
      const selectedType = roomTypes.find((t) => t.id === provisionForm.roomTypeId) || roomTypes[0];
      const newRoom: PhysicalRoom = {
        id: `rm-${provisionForm.roomNumber}`,
        roomNumber: provisionForm.roomNumber,
        floor: Number(provisionForm.floor),
        roomTypeId: provisionForm.roomTypeId,
        status: "VACANT_CLEAN",
        roomType: selectedType,
      };
      setRooms((prev) => [...prev, newRoom]);
      setIsProvisionOpen(false);
      setProvisionForm({ roomNumber: "", floor: 1, roomTypeId: roomTypes[0]?.id || "" });
    }
  };

  // Filtered dataset
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch = r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFloor = floorFilter === "ALL" || r.floor === Number(floorFilter);
    const matchesType = typeFilter === "ALL" || r.roomTypeId === typeFilter;
    return matchesSearch && matchesFloor && matchesType;
  });

  const availableFloors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Physical Unit Fleet Management</h1>
          <p className="text-sm text-muted-foreground">
            Provision physical room inventory, assign suite tier profiles, and override real-time sanitation statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild size="sm">
            <Link href="/admin/rooms/types">
              <Layers className="h-4 w-4 mr-2 text-primary" />
              Suite Tier Governance
            </Link>
          </Button>

          <Button onClick={() => setIsProvisionOpen(true)} size="sm" className="shadow-md gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            Provision New Room
          </Button>
        </div>
      </div>

      {/* Fleet Controls & Filters */}
      <Card className="border border-border/60 bg-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by room number (e.g. 304)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border/60"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-1 text-xs font-semibold focus:outline-none"
              >
                <option value="ALL">All Floors</option>
                {availableFloors.map((f) => (
                  <option key={f} value={f}>
                    Floor {f}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-1 text-xs font-semibold focus:outline-none"
            >
              <option value="ALL">All Suite Tiers</option>
              {roomTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Fleet Table */}
      <Card className="border border-border/60 overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Room Number</th>
                <th className="px-6 py-4">Floor</th>
                <th className="px-6 py-4">Assigned Suite Tier</th>
                <th className="px-6 py-4">Base Rate / Night</th>
                <th className="px-6 py-4">Operational Status</th>
                <th className="px-6 py-4 text-right">Instant Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No physical rooms found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => {
                  const statusInfo = STATUS_CONFIG[room.status] || STATUS_CONFIG.VACANT_CLEAN;
                  const Icon = statusInfo.icon;
                  const suiteTier = room.roomType || roomTypes.find((t) => t.id === room.roomTypeId);

                  return (
                    <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-foreground">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-primary" />
                          <span>Room {room.roomNumber}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-muted-foreground">
                        Floor {room.floor}
                      </td>

                      <td className="px-6 py-4 font-serif font-bold text-foreground">
                        {suiteTier?.name || "Standard Suite"}
                      </td>

                      <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                        ${suiteTier?.basePrice || 450} <span className="text-xs text-muted-foreground font-normal">/ night</span>
                      </td>

                      <td className="px-6 py-4">
                        <Badge className={`${statusInfo.badgeClass} gap-1.5 py-1 px-3 font-semibold text-xs border`}>
                          <Icon className="h-3.5 w-3.5" />
                          {statusInfo.label}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <select
                          value={room.status}
                          onChange={(e) => handleStatusChange(room.id, e.target.value as RoomStatus)}
                          className="h-9 rounded-md border border-input bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                          <option value="VACANT_CLEAN">Set Vacant Clean</option>
                          <option value="VACANT_DIRTY">Set Vacant Dirty</option>
                          <option value="OCCUPIED">Set Occupied</option>
                          <option value="OUT_OF_SERVICE">Set Out of Service</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PROVISION NEW ROOM DIALOG */}
      <Dialog open={isProvisionOpen} onOpenChange={setIsProvisionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">Provision Physical Room</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new door unit to the hotel inventory and link it to a suite tier.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProvisionSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Room Door Number</label>
              <Input
                required
                placeholder="e.g. 304"
                value={provisionForm.roomNumber}
                onChange={(e) => setProvisionForm({ ...provisionForm, roomNumber: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Floor Level</label>
              <Input
                type="number"
                required
                min={1}
                max={50}
                value={provisionForm.floor}
                onChange={(e) => setProvisionForm({ ...provisionForm, floor: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Assigned Suite Tier</label>
              <select
                required
                value={provisionForm.roomTypeId}
                onChange={(e) => setProvisionForm({ ...provisionForm, roomTypeId: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (${t.basePrice}/night)
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsProvisionOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-semibold">
                Provision Unit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
