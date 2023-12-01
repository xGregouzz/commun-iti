import { v4 } from "uuid";
import { inject, injectable } from "inversify";
import { MessageAPI } from "../../MessageAPI";
import { TypedLocalStorage } from "@/modules/infrastructure/storage";
import { AuthenticationStore } from "@/modules/authentication/store/AuthenticationStore";
import type { PaginatedQuery, PaginatedData } from "@/modules/infrastructure/models";
import type { EmojiReaction, RichText } from "@/modules/message/models/domain";
import type { NewMessage } from "@/modules/message/models/NewMessage";
import type { NewMessageReaction } from "@/modules/message/models/NewMessageReaction";
import type { User } from "@/modules/user/models/domain/User";
import type { MessageData } from "@/modules/message/models/MessageData";

export interface StoredMessage extends MessageData {
  id: string;
  roomId: string;
  author: User;
  creationDate: Date;
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
      creationDate: new Date(),
      author: user,
      roomId: message.roomId,
      usersReaction: {}
    };

    data.messages.unshift(msg);
    this.storage.setValue(data);
    return msg;
  }

  async fetch(roomId: string, pagination: PaginatedQuery): Promise<PaginatedData<MessageData>> {
    const user = this.getUser();

    const data = this.storage.getValue();
    const messages = data.messages.filter((msg) => msg.roomId === roomId);
    const start = pagination.page * pagination.perPage;

    return {
      ...pagination,
      data: messages.slice(start, start + pagination.perPage).map((msg) => {
        msg.reactions = msg.reactions.map((reaction) => {
          if (msg.usersReaction[user.id]) {
            reaction.userReacted = !!msg.usersReaction[user.id].find((e) => e === reaction.emoji);
          } else {
            reaction.userReacted = false;
          }

          return reaction;
        });
        return msg;
      }),
      total: messages.length
    };
  }

  async reactTo(reaction: NewMessageReaction): Promise<boolean> {
    const data = this.storage.getValue();
    const msg = data.messages.find((msg) => msg.id === reaction.messageId);
    const user = this.getUser();

    if (!msg) {
      throw new Error(`Message not found`);
    }

    let emojiReaction = msg.reactions.find((e) => e.emoji === reaction.emoji);
    if (!emojiReaction) {
      emojiReaction = {
        emoji: reaction.emoji,
        userReacted: false,
        reactionCount: 0
      };

      msg.reactions.push(emojiReaction);
    }

    if (!msg.usersReaction[user.id]) {
      msg.usersReaction[user.id] = [];
    } else {
      const exists = msg.usersReaction[user.id].indexOf(reaction.emoji) > -1;

      if (exists) {
        return false;
      }
    }

    msg.usersReaction[user.id].push(reaction.emoji);

    emojiReaction.reactionCount++;

    this.storage.setValue(data);

    return true;
  }

  async removeReaction(messageId: string, reaction: EmojiReaction): Promise<boolean> {
    const user = this.getUser();
    const data = this.storage.getValue();
    const msg = data.messages.find((msg) => msg.id === messageId);

    if (!msg) {
      throw new Error(`Message not found`);
    }

    const idx = msg.reactions.findIndex((e) => e.emoji === reaction.emoji);
    if (idx < 0) {
      return false;
    }

    if (msg.usersReaction[user.id]) {
      msg.usersReaction[user.id].splice(msg.usersReaction[user.id].indexOf(reaction.emoji));
    }

    const emojiReaction = msg.reactions[idx];

    emojiReaction.reactionCount--;

    if (emojiReaction.reactionCount === 0) {
      msg.reactions.splice(idx, 1);
    }

    this.storage.setValue(data);

    return true;
  }

  private getUser() {
    const user = this.authStore.state.loggedUser;
    if (!user) {
      throw new Error("Could not create room: API did not indicate success");
    }

    return user;
  }
}
