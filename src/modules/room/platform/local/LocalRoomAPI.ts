import { inject, injectable } from "inversify";
import { RoomAPI } from "../../services/RoomAPI";
import type { PaginatedQuery, PaginatedData } from "@/modules/infrastructure/models";
import type { NewRoom } from "../../models/NewRoom";
import type { Room } from "../../models/domain/Room";
import { TypedLocalStorage } from "@/modules/infrastructure/storage";
import { v4 } from "uuid";
import { AuthenticationStore } from "@/modules/authentication/store/AuthenticationStore";

export interface RoomData extends Room {
  users: Record<string, boolean>;
}

export interface RoomStorageData {
  rooms: RoomData[];
}

@injectable()
export class LocalRoomAPI extends RoomAPI {
  static STORAGE_KEY = "iti.rooms";

  @inject(AuthenticationStore) private authStore!: AuthenticationStore;

  public storage = new TypedLocalStorage<RoomStorageData>(LocalRoomAPI.STORAGE_KEY, {
    rooms: [
      {
        id: v4(),
        creationDate: new Date(),
        name: "Général",
        owner: {
          id: v4(),
          pictureUrl: "",
          username: "system"
        },
        users: {}
      }
    ]
  });

  async create(newRoom: NewRoom): Promise<Room> {
    const user = this.authStore.state.loggedUser;
    if (!user) {
      throw new Error("Could not create room: API did not indicate success");
    }

    const data = this.storage.getValue();
    const room: Room = {
      creationDate: new Date(),
      name: newRoom.name,
      id: v4(),
      owner: user
    };
    data.rooms.push({
      ...room,
      users: {
        [user.id]: true
      }
    });

    this.storage.setValue(data);

    return room;
  }

  async exists(name: string): Promise<boolean> {
    const data = this.storage.getValue();
    const room = data.rooms.find((r) => r.name.toLocaleLowerCase() === name.toLocaleLowerCase());

    return !!room;
  }

  async search(name: string): Promise<Room[]> {
    const user = this.authStore.state.loggedUser;
    if (!user) {
      throw new Error("Could not create room: API did not indicate success");
    }

    const data = this.storage.getValue();
    return data.rooms.filter(
      (r) => !r.users[user.id] && r.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    );
  }

  async join(roomId: string): Promise<Room> {
    const user = this.authStore.state.loggedUser;
    if (!user) {
      throw new Error("Could not join room: API did not indicate success");
    }

    const data = this.storage.getValue();
    const room = data.rooms.find((r) => r.id === roomId);
    if (!room) {
      throw new Error("Could not join room: API did not indicate success");
    }

    room.users[user.id] = true;

    this.storage.setValue(data);
    return room;
  }

  async leave(roomId: string): Promise<void> {
    const user = this.authStore.state.loggedUser;
    if (!user) {
      throw new Error("Could not leave room: API did not indicate success");
    }

    const data = this.storage.getValue();
    const room = data.rooms.find((r) => r.id === roomId);
    if (!room) {
      throw new Error("Could not leave room: API did not indicate success");
    }

    delete room.users[user.id];
    this.storage.setValue(data);
  }

  async fetch(pagination: PaginatedQuery): Promise<PaginatedData<Room>> {
    const user = this.authStore.state.loggedUser;
    if (!user) {
      throw new Error("Could not fetch rooms: API did not indicate success");
    }

    const data = this.storage.getValue();
    const userRooms = data.rooms.filter((r) => r.users[user.id]);
    const start = pagination.page * pagination.perPage;

    return {
      ...pagination,
      data: userRooms.slice(start, start + pagination.perPage),
      total: userRooms.length
    };
  }

  async findById(roomId: string): Promise<Room | null> {
    const data = this.storage.getValue();

    const room = data.rooms.find((r) => r.id === roomId);

    return room ?? null;
  }
}
