import { injectable } from "inversify";
import { RoomAPI } from "../../services";
import type { PaginatedQuery, PaginatedData } from "@/modules/infrastructure/models";
import type { NewRoom } from "../../models/NewRoom";
import type { Room } from "../../models/domain/Room";
import type { AxiosInstance } from "axios";

@injectable()
export class HttpRoomAPI extends RoomAPI {
  constructor(private readonly http: AxiosInstance) {
    super();
  }

  async create(newRoom: NewRoom): Promise<Room> {
    const { data: room } = await this.http.post("/room", newRoom);

    return {
      id: room.id,
      name: room.name,
      owner: room.creator,
      creationDate: new Date(room.creationDate)
    };
  }

  async search(name: string): Promise<Room[]> {
    const response = await this.http.get(`/room/search?name=${encodeURIComponent(name)}`);
    return response.data;
  }

  async exists(name: string): Promise<boolean> {
    const response = await this.http.get(`/room/exists?name=${encodeURIComponent(name)}`);
    return response.data;
  }

  async join(roomId: string): Promise<Room> {
    const { data: room } = await this.http.post("/room/join", {
      roomId
    });

    return {
      id: room.id,
      name: room.name,
      owner: room.creator,
      creationDate: new Date(room.creationDate)
    };
  }

  async leave(roomId: string): Promise<void> {
    await this.http.post("/room/leave", {
      roomId
    });
  }

  async findById(roomId: string): Promise<Room | null> {
    const response = await this.http.get(`/room/${roomId}`);
    return response.data;
  }

  async fetch(pagination: PaginatedQuery): Promise<PaginatedData<Room>> {
    const { data: result } = await this.http.get(
      `/room?page=${pagination.page}&perPage=${pagination.perPage}`
    );

    return {
      data: result.data,
      page: result.page,
      perPage: result.perPage,
      total: result.total
    };
  }
}
