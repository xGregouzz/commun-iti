import type { PaginationState } from "@/modules/infrastructure/models/PaginationState";
import type { Room } from "../domain/Room";

export interface RoomState {
  currentRoom?: Room;
  rooms: Room[];
  roomsPagination: PaginationState;
}
