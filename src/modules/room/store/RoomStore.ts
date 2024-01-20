import { injectable, inject } from "inversify";
import { StateProvider } from "@/modules/infrastructure/store/StateProvider";
import { Store } from "@/modules/infrastructure/store/Store";
import type { RoomState } from "../models/state/RoomState";
import type { Room } from "../models/domain/Room";
import type { PaginationState } from "@/modules/infrastructure/models/PaginationState";

@injectable()
export class RoomStore extends Store<RoomState> {
  constructor(@inject(StateProvider) stateProvider: StateProvider) {
    super(() =>
      stateProvider.new({
        rooms: [],
        roomsPagination: {
          page: -1,
          perPage: 100,
          total: 0
        }
      })
    );
  }

  setCurrentRoom(room: Room) {
    this._state.mutate((s) => {
      s.currentRoom = room;
      return s;
    });
  }

  appendRoom(...room: Room[]) {
    this._state.mutate((s) => {
      s.rooms.push(...room);
      return s;
    });
  }

  setRooms(rooms: Room[]) {
    this._state.mutate((s) => {
      s.rooms = [...rooms];
      return s;
    });
  }

  setRoomPagination(pagination: PaginationState) {
    this._state.mutate((s) => {
      s.roomsPagination = pagination;
      return s;
    });
  }
}
