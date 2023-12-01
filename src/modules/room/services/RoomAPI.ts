import { injectable } from "inversify";
import type { Room } from "../models/domain/Room";
import type { NewRoom } from "../models/NewRoom";
import type { PaginatedData, PaginatedQuery } from "@/modules/infrastructure/models";

@injectable()
export abstract class RoomAPI {
  abstract create(room: NewRoom): Promise<Room>;
  abstract search(name: string): Promise<Room[]>;
  abstract exists(name: string): Promise<boolean>;
  abstract join(roomId: string): Promise<Room>;
  abstract leave(roomId: string): Promise<void>;
  abstract findById(roomId: string): Promise<Room | null>;
  abstract fetch(pagination: PaginatedQuery): Promise<PaginatedData<Room>>;
}
