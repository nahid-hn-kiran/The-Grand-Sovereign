import Link from "next/link";
import Image from "next/image";
import { Users, ArrowRight } from "lucide-react";
import { RoomType } from "@/types/room.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  roomType: RoomType;
}

export function RoomCard({ roomType }: RoomCardProps) {
  const primaryImage =
    roomType.images?.[0] ||
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80";

  return (
    <Card className="group overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Preview Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={primaryImage}
          alt={roomType.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Capacity Badge */}
        <Badge className="absolute top-3 right-3 gap-1 bg-background/80 backdrop-blur-md text-foreground border border-border/40 font-semibold shadow-sm">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>Up to {roomType.capacity} Guests</span>
        </Badge>

        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
            {roomType.slug.replace("-", " ")}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-xl font-bold group-hover:text-primary transition-colors">
          {roomType.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 text-sm text-muted-foreground">
        <p className="line-clamp-2 leading-relaxed">{roomType.description}</p>

        {/* Amenities Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {roomType.amenities.slice(0, 4).map((amenityKey) => (
            <Badge
              key={amenityKey}
              variant="secondary"
              className="text-[10px] py-0.5 px-2 bg-secondary/60 text-secondary-foreground border border-border/30 capitalize"
            >
              {amenityKey.replace("-", " ")}
            </Badge>
          ))}
          {roomType.amenities.length > 4 && (
            <Badge variant="outline" className="text-[10px] py-0.5 px-2 text-muted-foreground">
              +{roomType.amenities.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/40 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Starting from
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-2xl font-bold text-foreground">${roomType.basePrice}</span>
            <span className="text-xs text-muted-foreground">/ night</span>
          </div>
        </div>

        <Button size="sm" asChild className="gap-1.5 shadow-md">
          <Link href={`/rooms/${roomType.slug}`}>
            Explore Suite
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
