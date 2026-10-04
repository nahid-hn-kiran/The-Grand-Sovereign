export interface HousekeepingTask {
  id: string;
  roomId: string;
  room?: {
    roomNumber: string;
    floor: number;
  };
  assignedToId?: string | null;
  priority: number;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
}
