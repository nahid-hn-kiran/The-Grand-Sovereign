import { apiClient } from "@/lib/api-client";
import { RoomType } from "@/types/room.types";
import { FALLBACK_ROOM_TYPES } from "@/content/rooms.content";
import { RoomCard } from "@/components/rooms/room-card";
import { RoomFilters } from "@/components/rooms/room-filters";
import { Sparkles } from "lucide-react";

interface RoomsPageProps {
  searchParams: Promise<{
    capacity?: string;
    maxPrice?: string;
    amenity?: string;
  }>;
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const params = await searchParams;

  let roomTypes: RoomType[] = [];

  try {
    const res = await apiClient.get<RoomType[] | { data: RoomType[] }>("/rooms/types");
    const fetched = (res as { data?: RoomType[] }).data || (res as RoomType[]);
    if (Array.isArray(fetched) && fetched.length > 0) {
      roomTypes = fetched;
    } else {
      roomTypes = FALLBACK_ROOM_TYPES;
    }
  } catch {
    roomTypes = FALLBACK_ROOM_TYPES;
  }

  // Filter room types based on query params
  if (params.capacity) {
    const capNum = parseInt(params.capacity, 10);
    if (!isNaN(capNum)) {
      roomTypes = roomTypes.filter((rt) => rt.capacity >= capNum);
    }
  }

  if (params.maxPrice) {
    const maxP = parseFloat(params.maxPrice);
    if (!isNaN(maxP)) {
      roomTypes = roomTypes.filter((rt) => rt.basePrice <= maxP);
    }
  }

  if (params.amenity) {
    roomTypes = roomTypes.filter((rt) => rt.amenities.includes(params.amenity!));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3 text-center md:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The Sovereign Suite Collection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Suites & Accommodations
        </h1>
        <p className="max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
          Select from our handcrafted collection of royal suites, oceanfront double queens, and penthouse sky villas.
        </p>
      </div>

      {/* Main Grid & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <RoomFilters />
        </div>

        {/* Room Catalog Grid */}
        <div className="lg:col-span-8">
          {roomTypes.length === 0 ? (
            <div className="rounded-2xl border border-border/50 p-12 text-center space-y-3 bg-card/40">
              <p className="text-lg font-serif font-bold text-foreground">No Suites Found</p>
              <p className="text-sm text-muted-foreground">
                No accommodations matched your filter criteria. Try adjusting your capacity or rate range.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roomTypes.map((rt) => (
                <RoomCard key={rt.id} roomType={rt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
