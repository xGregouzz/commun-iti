import { WebSocketTopic } from "@/modules/infrastructure/socket";
import type { User } from "@/modules/user/models/domain/User";
import { inject, injectable } from "inversify";

export interface RoomPayload {
  id: string;
  name: string;
  user: User;
}

@injectable()
export class RoomSocketService {
  @inject(WebSocketTopic) private readonly socketToic!: WebSocketTopic;

  private roomJoinedSubscription?: (reaction: RoomPayload) => any;
  private roomLeftSubscription?: (reaction: RoomPayload) => any;

  onRoomJoined(callback: (reaction: RoomPayload) => any) {
    if (this.roomJoinedSubscription) {
      this.socketToic.unsubscribe(`room_joined`, this.roomJoinedSubscription);
    }

    this.roomJoinedSubscription = callback;
    this.socketToic.subscribe(`room_joined`, callback);
  }

  onRoomLeft(callback: (reaction: RoomPayload) => any) {
    if (this.roomLeftSubscription) {
      this.socketToic.unsubscribe(`room_left`, this.roomLeftSubscription);
    }

    this.roomLeftSubscription = callback;
    this.socketToic.subscribe(`room_left`, callback);
  }
}
