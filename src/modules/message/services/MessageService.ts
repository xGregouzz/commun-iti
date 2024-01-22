import { injectable, inject } from "inversify";
import { MessageAPI } from "./MessageAPI";
import { MessageStore } from "../store";
import { MessageDataParser } from "./MessageDataParser";
import type { NewMessage } from "../models/NewMessage";
import type { Message } from "../models/domain";
import { AuthenticationStore } from "@/modules/authentication/store/AuthenticationStore";
import { RoomStore } from "@/modules/room/store";
import type { PaginatedQuery } from "@/modules/infrastructure/models";

@injectable()
export class MessageService {
  @inject(MessageAPI) private readonly api!: MessageAPI;
  @inject(MessageStore) private readonly store!: MessageStore;
  @inject(MessageDataParser) private readonly parser!: MessageDataParser;
  @inject(AuthenticationStore) private readonly authStore!: AuthenticationStore;
  @inject(RoomStore) private readonly roomStore!: RoomStore;
  
  async sendMessage(newMessage: NewMessage) {
    const messageData = await this.api.sendMessage(newMessage);
    const message = this.parser.parse(messageData);

    this.store.prependMessage(message);
  }

  async reactTo(emoji: string, message: Message) {
    const success = await this.api.reactTo({
      emoji,
      messageId: message.id
    });

    if (success) {
      const user = this.authStore.state.loggedUser;

      if (!user) {
        throw new Error("User should be logged in");
      }

      this.store.setUserReaction(message.id, emoji, user.id);
    }
  }

  async removeReaction(emoji: string, message: Message) {
    const success = await this.api.removeReaction({
      emoji: emoji,
      messageId: message.id
    });

    if (success) {
      const user = this.authStore.state.loggedUser;

      if (!user) {
        throw new Error("User should be logged in");
      }

      this.store.removeMessageReaction(message.id, emoji, user.id);
    }
  }

  async fetchMore(roomId: string): Promise<void> {
    const messagesPagination = this.store.state.messagesPagination;

    return this.fetch(
      roomId,
      {
        page: messagesPagination.page + 1,
        perPage: messagesPagination.perPage
      },
      true
    );
  }

  async reloadMessages() {
    if (this.roomStore.state.currentRoom) {
      const messagesPagination = this.store.state.messagesPagination;

      await this.fetch(
        this.roomStore.state.currentRoom.id,
        {
          page: 0,
          perPage: messagesPagination.perPage
        },
        false
      );
    }
  }

  private async fetch(roomId: string, pagination: PaginatedQuery, append: boolean) {
    const paginatedData = await this.api.fetch(roomId, pagination);
    const messages = paginatedData.data.map((m) => this.parser.parse(m));

    if (append) {
      this.store.appendMessage(messages);
    } else {
      this.store.setMessages(messages);
    }

    this.store.setMessagesPagination({
      page: paginatedData.page,
      perPage: paginatedData.perPage,
      total: paginatedData.total
    });
  }
}
