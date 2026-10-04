import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Users, Crown } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { RoomType } from "@/types/room.types";
import { FALLBACK_ROOM_TYPES, AMENITY_DEFINITIONS } from "@/content/rooms.content";
import { BookingWidget } from "@/components/booking/booking-widget";
import { Badge } from "@/components/ui/badge";

interface RoomDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { slug } = await params;

  let roomType: RoomType | null = null;

  try {
    const res = await apiClient.get<RoomType | { data: RoomType }>(`/rooms/types/${slug}`);
    roomType = (res as { data?: RoomType }).data || (res as RoomType);
  } catch {
    roomType = FALLBACK_ROOM_TYPES.find((rt) => rt.slug === slug) || null;
  }

  if (!roomType || !roomType.id) {
    roomType = FALLBACK_ROOM_TYPES.find((rt) => rt.slug === slug) || null;
  }

  if (!roomType) {
    notFound();
  }

  const galleryImages = roomType.images?.length ? roomType.images : FALLBACK_ROOM_TYPES[0].images;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Link */}
      <Link
        href="/rooms"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Suite Collection
      </Link>

      {/* Hero Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-2xl border border-border/40">
        <div className="md:col-span-2 relative aspect-[16/10] w-full">
          <Image
            src={galleryImages[0]}
            alt={roomType.name}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 66vw"
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {galleryImages.slice(1, 3).map((img, idx) => (
            <div key={idx} className="relative aspect-[16/10] md:aspect-auto md:h-full w-full">
              <Image
                src={img}
                alt={`${roomType.name} preview ${idx + 2}`}
                fill
                sizes="(max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout: Description & Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Editorial Suite Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <Badge className="bg-primary/10 text-primary border-primary/30 font-semibold gap-1.5 py-1 px-3">
              <Crown className="h-3.5 w-3.5" />
              Sovereign Luxury Accommodations
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {roomType.name}
            </h1>
            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4 text-primary" />
                Up to {roomType.capacity} Guests
              </span>
              <span>•</span>
              <span>Sanctuary King Layout</span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-base text-muted-foreground leading-relaxed">
            <p>{roomType.description}</p>
          </div>

          {/* Amenities Checklist */}
          <div className="space-y-4 pt-6 border-t border-border/40">
            <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Suite Amenities & VIP Services
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roomType.amenities.map((amenityId) => {
                const matched = AMENITY_DEFINITIONS.find((a) => a.id === amenityId);
                const label = matched ? matched.label : amenityId.replace("-", " ");
                return (
                  <div key={amenityId} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="capitalize">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-2">
            <div className="flex items-center gap-2 font-serif font-bold text-foreground text-lg">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Sovereign Hospitality Promise</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every suite features 24/7 direct access to our Sovereign AI Concierge, daily turndown service, complimentary valet parking, and private elevator access.
            </p>
          </div>
        </div>

        {/* Sticky Interactive Booking Widget */}
        <div className="lg:col-span-5">
          <BookingWidget roomType={roomType} />
        </div>
      </div>
    </div>
  );
}
