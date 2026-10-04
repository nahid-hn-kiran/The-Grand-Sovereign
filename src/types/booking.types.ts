import { Room } from "./room.types";

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

export interface BookingPayment {
  id: string;
  amount: number;
  provider: string;
  transactionId: string;
  status: string;
  createdAt?: string;
}

export interface BookingGuest {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: BookingStatus;
  room?: Room;
  guest?: BookingGuest;
  payments?: BookingPayment[];
  createdAt: string;
  updatedAt?: string;
}

export interface AvailabilityResult {
  availableCount: number;
  rooms: Room[];
}

export interface CreateBookingPayload {
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount?: number;
}
