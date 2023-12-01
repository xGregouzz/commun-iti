import { injectable, inject } from "inversify";
import { MessageAPI } from "./MessageAPI";
import { MessageStore } from "../store";
import { MessageDataParser } from "./MessageDataParser";
import type { NewMessage } from "../models/NewMessage";
import type { EmojiReaction, Message } from "../models/domain";
import { AuthenticationStore } from "@/modules/authentication/store/AuthenticationStore";

@injectable()
export class MessageService {
  @inject(MessageAPI) private readonly api!: MessageAPI;
  @inject(MessageStore) private readonly store!: MessageStore;
  @inject(MessageDataParser) private readonly parser!: MessageDataParser;
  @inject(AuthenticationStore) private readonly authStore!: AuthenticationStore;

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

      this.store.setMessageReaction(message, emoji);
    }
  }

  async removeReaction(reaction: EmojiReaction, message: Message) {
    const success = await this.api.removeReaction(message.id, reaction);

    if (success) {
      const user = this.authStore.state.loggedUser;

      if (!user) {
        throw new Error("User should be logged in");
      }

      this.store.removeMessageReaction(message, reaction.emoji);
    }
  }

  async fetchMore(roomId: string): Promise<void> {
    const messagesPagination = this.store.state.messagesPagination;

    const paginatedData = await this.api.fetch(roomId, {
      page: messagesPagination.page + 1,
      perPage: messagesPagination.perPage
    });

    const messages = paginatedData.data.map((m) => this.parser.parse(m));
    this.store.appendMessage(messages);

    this.store.setMessagesPagination({
      page: paginatedData.page,
      perPage: paginatedData.perPage,
      total: paginatedData.total
    });
  }
}
