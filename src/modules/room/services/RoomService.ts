import { inject, injectable } from "inversify";
import { RoomAPI } from "./RoomAPI";
import { RoomStore } from "../store";
import type { NewRoom } from "../models/NewRoom";
import type { Room } from "../models/domain/Room";
import type { PaginatedQuery } from "@/modules/infrastructure/models";

@injectable()
export class RoomService {
  @inject(RoomAPI) api!: RoomAPI;
  @inject(RoomStore) store!: RoomStore;

  async create(newRoom: NewRoom): Promise<Room> {
    const room = await this.api.create(newRoom);
    this.store.appendRoom(room);
    return room;
  }

  async join(roomId: string): Promise<void> {
    const room = await this.api.join(roomId);
    this.store.appendRoom(room);
  }

  async fetchMore(): Promise<void> {
    const roomsPagination = this.store.state.roomsPagination;

    const paginatedData = await this.api.fetch({
      page: roomsPagination.page + 1,
      perPage: roomsPagination.perPage
    });

    this.store.appendRoom(...paginatedData.data);

    this.store.setRoomPagination({
      page: paginatedData.page,
      perPage: paginatedData.perPage,
      total: paginatedData.total
    });
  }

  async reloadRooms() {
    const roomsPagination = this.store.state.roomsPagination;

    await this.fetch(
      {
        page: 0,
        perPage: roomsPagination.perPage
      },
      false
    );
  }

  private async fetch(pagination: PaginatedQuery, append: boolean) {
    const paginatedData = await this.api.fetch(pagination);

    if (append) {
      this.store.appendRoom(...paginatedData.data);
    } else {
      this.store.setRooms(paginatedData.data);
    }

    this.store.setRoomPagination({
      page: paginatedData.page,
      perPage: paginatedData.perPage,
      total: paginatedData.total
    });
  }
}
