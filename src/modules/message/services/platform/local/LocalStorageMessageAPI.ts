import { v4 } from "uuid";
import { inject, injectable } from "inversify";
import { MessageAPI } from "../../MessageAPI";
import { TypedLocalStorage } from "@/modules/infrastructure/storage";
import { AuthenticationStore } from "@/modules/authentication/store/AuthenticationStore";
import type { PaginatedQuery, PaginatedData } from "@/modules/infrastructure/models";
import type { EmojiReaction, RichText } from "@/modules/message/models/domain";
import type { NewMessage } from "@/modules/message/models/NewMessage";
import type { User } from "@/modules/user/models/domain/User";
import type { MessageData } from "@/modules/message/models/MessageData";
import type { MessageReactionParams } from "@/modules/message/models/NewMessageReaction";

export interface StoredMessage extends MessageData {
  id: string;
  roomId: string;
  author: User;
  type: string;
  reactions: EmojiReaction[];
  text: RichText;
  usersReaction: Record<string, string[]>;
}

export interface MessagesStorageData {
  messages: StoredMessage[];
}

@injectable()
export class LocalStorageMessageAPI extends MessageAPI {
  static STORAGE_KEY = "iti.messages";
  @inject(AuthenticationStore) private authStore!: AuthenticationStore;

  private storage = new TypedLocalStorage<MessagesStorageData>(LocalStorageMessageAPI.STORAGE_KEY, {
    messages: []
  });

  async sendMessage(message: NewMessage): Promise<MessageData> {
    const user = this.getUser();

    const data = this.storage.getValue();
    const msg: StoredMessage = {
      id: v4(),
      type: "rich" as const,
      text: message.text,
      reactions: [],
      creationDate: new Date().toISOString(),
      author: user,
      roomId: message.roomId,
      usersReaction: {}
    };

    data.messages.unshift(msg);
    this.storage.setValue(data);
    return msg;
  }

  async fetch(roomId: string, pagination: PaginatedQuery): Promise<PaginatedData<MessageData>> {
    const data = this.storage.getValue();
    const messages = data.messages.filter((msg) => msg.roomId === roomId);

    return {
      ...pagination,
      data: messages,
      total: messages.length
    };
  }

  async reactTo(reaction: MessageReactionParams): Promise<boolean> {
    throw new Error("Not implemented");
  }

  async removeReaction(reaction: MessageReactionParams): Promise<boolean> {
    throw new Error("Not implemented");
  }

  private getUser() {
    const user = this.authStore.state.loggedUser;
    if (!user) {
      throw new Error("Could not create room: API did not indicate success");
    }

    return user;
  }
}
