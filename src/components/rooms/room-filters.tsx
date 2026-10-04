"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AMENITY_DEFINITIONS } from "@/content/rooms.content";

function RoomFiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCapacity = searchParams?.get("capacity") || "";
  const currentMaxPrice = searchParams?.get("maxPrice") || "";
  const currentAmenity = searchParams?.get("amenity") || "";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/rooms?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/rooms");
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2 font-serif font-bold text-lg text-foreground">
          <Filter className="h-5 w-5 text-primary" />
          <span>Filter Suites</span>
        </div>
        {(currentCapacity || currentMaxPrice || currentAmenity) && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Guest Capacity Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Guest Capacity
        </label>
        <div className="grid grid-cols-4 gap-2">
          {["", "2", "4", "6"].map((cap) => (
            <Button
              key={cap}
              variant={currentCapacity === cap ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilters("capacity", cap)}
              className="h-9 text-xs"
            >
              {cap === "" ? "Any" : `${cap}+`}
            </Button>
          ))}
        </div>
      </div>

      {/* Max Nightly Rate */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Max Rate ($ / Night)
        </label>
        <Input
          type="number"
          placeholder="e.g. 1000"
          value={currentMaxPrice}
          onChange={(e) => updateFilters("maxPrice", e.target.value)}
          className="h-9 text-sm"
        />
      </div>

      {/* Key Amenity Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Featured Amenity
        </label>
        <div className="flex flex-wrap gap-1.5">
          {AMENITY_DEFINITIONS.map((amenity) => {
            const isSelected = currentAmenity === amenity.id;
            return (
              <Badge
                key={amenity.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => updateFilters("amenity", isSelected ? "" : amenity.id)}
                className="cursor-pointer py-1 px-2.5 text-xs transition-colors"
              >
                {amenity.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function RoomFilters() {
  return (
    <React.Suspense fallback={<div className="h-64 rounded-2xl border border-border/40 p-6 bg-card/40">Loading filters...</div>}>
      <RoomFiltersContent />
    </React.Suspense>
  );
}
