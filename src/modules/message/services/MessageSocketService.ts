import { inject, injectable } from "inversify";
import { WebSocketTopic } from "@/modules/infrastructure/socket";
import { MessageDataParser } from "./MessageDataParser";
import type { MessageData } from "../models/MessageData";
import type { User } from "@/modules/user/models/domain/User";
import type { Message } from "../models/domain";

export interface MessageReactionRemovedPayload {
  messageId: string;
  roomId: string;
  user: User;
  emoji: string;
}

export interface MessageReactionPayload {
  message: MessageData;
  user: User;
  emoji: string;
}

@injectable()
export class MessageSocketService {
  @inject(WebSocketTopic) private readonly socketToic!: WebSocketTopic;
  @inject(MessageDataParser) private readonly parser!: MessageDataParser;

  private newMessageSubscription?: [string, (post: MessageData) => any];
  private newReactionSubscription?: (reaction: MessageReactionPayload) => any;
  private removeReactionSubscription?: (reaction: MessageReactionRemovedPayload) => any;
  
  /**
   * Subscribe to messages
   * @param roomId 
   * @param callback 
   */
  onNewMessage(roomId: string, callback: (post: Message) => any) {
    if (this.newMessageSubscription) {
      this.socketToic.unsubscribe(
        `room_${this.newMessageSubscription[0]}_new_message`,
        this.newMessageSubscription[1]
      );
    }

    const cb = (post: MessageData) => {
      return callback(this.parser.parse(post));
    };

    this.newMessageSubscription = [roomId, cb];
    this.socketToic.subscribe(`room_${roomId}_new_message`, cb);
  }

  /**
   * Subscribe to new message reactions
   * @param callback 
   */
  onNewReaction(callback: (reaction: MessageReactionPayload) => any) {
    if (this.newReactionSubscription) {
      this.socketToic.unsubscribe(`message_reaction`, this.newReactionSubscription);
    }

    this.newReactionSubscription = callback;
    this.socketToic.subscribe(`message_reaction`, callback);
  }

  /**
   * Subscribe to reaction deletion
   * @param callback 
   */
  onReactionRemoved(callback: (reaction: MessageReactionRemovedPayload) => any) {
    if (this.removeReactionSubscription) {
      this.socketToic.unsubscribe(`message_reaction_removed`, this.removeReactionSubscription);
    }

    this.removeReactionSubscription = callback;
    this.socketToic.subscribe(`message_reaction_removed`, callback);
  }
}
