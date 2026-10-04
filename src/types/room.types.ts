export type RoomStatus = "VACANT_CLEAN" | "VACANT_DIRTY" | "OCCUPIED" | "OUT_OF_SERVICE";

export interface RoomType {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  capacity: number;
  amenities: string[];
  images: string[];
  _count?: {
    rooms: number;
  };
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  roomTypeId: string;
  roomType?: RoomType;
}
