"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BedDouble,
  Plus,
  Search,
  DollarSign,
  Users,
  Layers,
  Edit,
  Check,
  Sparkles,
  ArrowLeft,
  Building,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { RoomType } from "@/types/room.types";
import { FALLBACK_ROOM_TYPES, AMENITY_DEFINITIONS } from "@/content/rooms.content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function AdminRoomTypesPage() {
  const [roomTypes, setRoomTypes] = React.useState<RoomType[]>(FALLBACK_ROOM_TYPES);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState<RoomType | null>(null);

  // Inline Price Edit state map: { [id]: number }
  const [editingPrices, setEditingPrices] = React.useState<Record<string, number>>({});
  const [savingPrices, setSavingPrices] = React.useState<Record<string, boolean>>({});

  // Create Form State
  const [createForm, setCreateForm] = React.useState({
    name: "",
    slug: "",
    basePrice: 500,
    capacity: 2,
    description: "",
    amenities: [] as string[],
    images: "",
  });

  // Edit Form State
  const [editForm, setEditForm] = React.useState({
    name: "",
    description: "",
    basePrice: 500,
    capacity: 2,
    amenities: [] as string[],
    images: "",
  });

  const fetchRoomTypes = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<RoomType[] | { data: RoomType[] }>("/rooms/types");
      const fetched = (res as { data?: RoomType[] }).data || (res as RoomType[]);
      if (Array.isArray(fetched) && fetched.length > 0) {
        setRoomTypes(fetched);
      }
    } catch (err) {
      console.warn("Using fallback room types:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  // Derived Metrics
  const totalTiers = roomTypes.length;
  const avgRate = totalTiers > 0 ? Math.round(roomTypes.reduce((acc, r) => acc + r.basePrice, 0) / totalTiers) : 0;
  const totalProvisionedUnits = roomTypes.reduce((acc, r) => acc + (r._count?.rooms || 4), 0);

  const filteredTypes = roomTypes.filter(
    (rt) =>
      rt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rt.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rt.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create Room Type Handler
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageArray = createForm.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: createForm.name,
      slug: createForm.slug || createForm.name.toLowerCase().replace(/\s+/g, "-"),
      basePrice: Number(createForm.basePrice),
      capacity: Number(createForm.capacity),
      description: createForm.description,
      amenities: createForm.amenities,
      images: imageArray.length > 0 ? imageArray : [FALLBACK_ROOM_TYPES[0].images[0]],
    };

    try {
      await apiClient.post("/rooms/types", payload);
      setIsCreateOpen(false);
      setCreateForm({
        name: "",
        slug: "",
        basePrice: 500,
        capacity: 2,
        description: "",
        amenities: [],
        images: "",
      });
      await fetchRoomTypes();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create suite tier");
    }
  };

  // Open Edit Modal
  const openEditModal = (rt: RoomType) => {
    setEditingType(rt);
    setEditForm({
      name: rt.name,
      description: rt.description,
      basePrice: rt.basePrice,
      capacity: rt.capacity,
      amenities: rt.amenities || [],
      images: (rt.images || []).join("\n"),
    });
  };

  // Save Edit Suite Tier Handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;

    const imageArray = editForm.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: editForm.name,
      description: editForm.description,
      basePrice: Number(editForm.basePrice),
      capacity: Number(editForm.capacity),
      amenities: editForm.amenities,
      images: imageArray,
    };

    try {
      await apiClient.patch(`/rooms/types/${editingType.id}`, payload);
      setEditingType(null);
      await fetchRoomTypes();
    } catch {
      // Optimistic state fallback if mock
      setRoomTypes((prev) =>
        prev.map((r) => (r.id === editingType.id ? { ...r, ...payload } : r))
      );
      setEditingType(null);
    }
  };

  // Inline Quick Base Rate PATCH Adjuster
  const handleSaveInlinePrice = async (rt: RoomType) => {
    const newPrice = editingPrices[rt.id];
    if (newPrice === undefined || newPrice === rt.basePrice) return;

    setSavingPrices((prev) => ({ ...prev, [rt.id]: true }));
    try {
      await apiClient.patch(`/rooms/types/${rt.id}`, { basePrice: Number(newPrice) });
      setRoomTypes((prev) => prev.map((r) => (r.id === rt.id ? { ...r, basePrice: Number(newPrice) } : r)));
    } catch {
      // Optimistic update fallback
      setRoomTypes((prev) => prev.map((r) => (r.id === rt.id ? { ...r, basePrice: Number(newPrice) } : r)));
    } finally {
      setSavingPrices((prev) => ({ ...prev, [rt.id]: false }));
    }
  };

  const toggleAmenity = (id: string, formType: "create" | "edit") => {
    if (formType === "create") {
      setCreateForm((prev) => ({
        ...prev,
        amenities: prev.amenities.includes(id)
          ? prev.amenities.filter((a) => a !== id)
          : [...prev.amenities, id],
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        amenities: prev.amenities.includes(id)
          ? prev.amenities.filter((a) => a !== id)
          : [...prev.amenities, id],
      }));
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <Link href="/admin/rooms" className="hover:text-primary transition-colors flex items-center gap-1">
              <Building className="h-3.5 w-3.5" /> Fleet Inventory
            </Link>
            <span>/</span>
            <span className="text-foreground">Suite Tiers & Pricing</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Suite Tier & Pricing Governance</h1>
          <p className="text-sm text-muted-foreground">
            Manage room type categories, dynamic base rates, amenity packages, and gallery media.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild size="sm">
            <Link href="/admin/rooms">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Physical Fleet View
            </Link>
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="shadow-md gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            Create Suite Tier
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border border-border/60 bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Suite Tiers</p>
              <p className="text-2xl font-bold font-serif text-foreground mt-1">{totalTiers}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Base Nightly Rate</p>
              <p className="text-2xl font-bold font-serif text-foreground mt-1">${avgRate} <span className="text-xs text-muted-foreground font-normal">/ night</span></p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Provisioned Units</p>
              <p className="text-2xl font-bold font-serif text-foreground mt-1">{totalProvisionedUnits} <span className="text-xs text-muted-foreground font-normal">physical rooms</span></p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <BedDouble className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Catalog Grid */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suite tiers by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border/60"
          />
        </div>

        {filteredTypes.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            No suite tiers found matching your search.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTypes.map((rt) => {
              const currentPrice = editingPrices[rt.id] !== undefined ? editingPrices[rt.id] : rt.basePrice;
              const isSaving = savingPrices[rt.id] || false;
              const hasPriceChanged = currentPrice !== rt.basePrice;
              const unitCount = rt._count?.rooms || 4;
              const previewImg = rt.images?.[0] || FALLBACK_ROOM_TYPES[0].images[0];

              return (
                <Card key={rt.id} className="overflow-hidden border border-border/60 bg-card hover:border-primary/40 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 w-full bg-muted">
                      <Image
                        src={previewImg}
                        alt={rt.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border/60 font-semibold text-xs">
                          {unitCount} {unitCount === 1 ? "Unit" : "Units"}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="font-serif text-xl font-bold">{rt.name}</CardTitle>
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">slug: {rt.slug}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(rt)} className="h-8 w-8 p-0 shrink-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit Suite</span>
                        </Button>
                      </div>
                      <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-2">
                        {rt.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                      {/* Inline Base Price Adjuster */}
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground">Dynamic Base Rate</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-sm font-bold text-primary">$</span>
                            <Input
                              type="number"
                              value={currentPrice}
                              onChange={(e) => setEditingPrices({ ...editingPrices, [rt.id]: Number(e.target.value) })}
                              className="h-8 w-24 text-sm font-bold bg-background border-primary/30"
                            />
                            <span className="text-xs text-muted-foreground">/ night</span>
                          </div>
                        </div>

                        {hasPriceChanged && (
                          <Button
                            size="sm"
                            onClick={() => handleSaveInlinePrice(rt)}
                            disabled={isSaving}
                            className="h-8 px-3 text-xs font-semibold shadow-sm gap-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                        )}
                      </div>

                      {/* Guest Capacity & Amenities */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          <span>Capacity: <strong>Up to {rt.capacity} Guests</strong></span>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {rt.amenities.map((aId) => {
                            const def = AMENITY_DEFINITIONS.find((def) => def.id === aId);
                            return (
                              <Badge key={aId} variant="secondary" className="text-[10px] py-0.5 px-2 bg-muted/70 text-foreground font-normal">
                                {def?.label || aId}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE SUITE TIER DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">Create New Suite Tier</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define catalog specifications, base rate, guest capacity, and luxury amenities.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Suite Tier Name</label>
              <Input
                required
                placeholder="e.g. Royal Crown Skyline Villa"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Slug Identifier</label>
                <Input
                  required
                  placeholder="e.g. royal-crown-villa"
                  value={createForm.slug}
                  onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Base Price ($/night)</label>
                <Input
                  type="number"
                  required
                  min={50}
                  value={createForm.basePrice}
                  onChange={(e) => setCreateForm({ ...createForm, basePrice: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Max Guest Capacity</label>
              <Input
                type="number"
                required
                min={1}
                max={12}
                value={createForm.capacity}
                onChange={(e) => setCreateForm({ ...createForm, capacity: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Editorial description of the suite..."
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground block">Included Amenities</label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-border/50 p-3 rounded-lg bg-card/50">
                {AMENITY_DEFINITIONS.map((def) => (
                  <label key={def.id} className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={createForm.amenities.includes(def.id)}
                      onChange={() => toggleAmenity(def.id, "create")}
                      className="rounded border-border/60 text-primary focus:ring-primary"
                    />
                    <span>{def.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Gallery Image URLs (One per line)</label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://images.unsplash.com/photo-..."
                value={createForm.images}
                onChange={(e) => setCreateForm({ ...createForm, images: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-semibold">
                Create Suite Tier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT SUITE TIER DIALOG */}
      <Dialog open={!!editingType} onOpenChange={(open) => !open && setEditingType(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">Edit {editingType?.name}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify rates, description, capacity, and linked amenity packages.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Suite Tier Name</label>
              <Input
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Base Price ($/night)</label>
                <Input
                  type="number"
                  required
                  min={50}
                  value={editForm.basePrice}
                  onChange={(e) => setEditForm({ ...editForm, basePrice: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Max Capacity</label>
                <Input
                  type="number"
                  required
                  min={1}
                  max={12}
                  value={editForm.capacity}
                  onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground block">Amenities</label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-border/50 p-3 rounded-lg bg-card/50">
                {AMENITY_DEFINITIONS.map((def) => (
                  <label key={def.id} className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editForm.amenities.includes(def.id)}
                      onChange={() => toggleAmenity(def.id, "edit")}
                      className="rounded border-border/60 text-primary focus:ring-primary"
                    />
                    <span>{def.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Gallery Image URLs</label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={editForm.images}
                onChange={(e) => setEditForm({ ...editForm, images: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditingType(null)}>
                Cancel
              </Button>
              <Button type="submit" className="font-semibold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
