import { injectable, inject } from "inversify";
import { StateProvider } from "@/modules/infrastructure/store/StateProvider";
import { Store } from "@/modules/infrastructure/store/Store";
import type { Message } from "@/modules/message/models/domain";
import type { MessageState } from "../models/state/MessageState";
import type { PaginationState } from "@/modules/infrastructure/models/PaginationState";

@injectable()
export class MessageStore extends Store<MessageState> {
  constructor(@inject(StateProvider) stateProvider: StateProvider) {
    super(() =>
      stateProvider.new({
        currentRoomMessages: [],
        messagesPagination: {
          page: -1,
          perPage: 20,
          total: 0
        }
      })
    );
  }

  prependMessage(message: Message) {
    this._state.mutate((s) => {
      s.currentRoomMessages.unshift(message);

      return s;
    });
  }

  appendMessage(messages: Message[]) {
    this._state.mutate((s) => {
      s.currentRoomMessages.push(...messages);

      return s;
    });
  }

  setMessagesPagination(pagination: PaginationState) {
    this._state.mutate((s) => {
      s.messagesPagination = pagination;
      return s;
    });
  }

  setUserReaction(messageId: string, emoji: string, userId: string) {
    this._state.mutate((s) => {
      const message = s.currentRoomMessages.find((msg) => msg.id === messageId);
      if (!message) {
        return s;
      }

      let emojiReaction = message.reactions.find((e) => e.emoji === emoji);

      if (!emojiReaction) {
        emojiReaction = {
          emoji,
          userReactions: []
        };

        message.reactions.push(emojiReaction);
      }

      emojiReaction.userReactions.push({ userId });

      return s;
    });
  }

  removeMessageReaction(messageId: string, emoji: string, userId: string) {
    this._state.mutate((s) => {
      const message = s.currentRoomMessages.find((msg) => msg.id === messageId);
      console.log(message);
      if (!message) {
        return s;
      }

      const idx = message.reactions.findIndex((e) => e.emoji === emoji);

      if (idx > -1) {
        const emojiReaction = message.reactions[idx];

        const userReactionIdx = emojiReaction.userReactions.findIndex((u) => u.userId === userId);

        if (userReactionIdx > -1) {
          emojiReaction.userReactions.splice(userReactionIdx, 1);
        }

        if (emojiReaction.userReactions.length === 0) {
          message.reactions.splice(idx, 1);
        }
      }
      return s;
    });
  }

  setMessages(messages: Message[]) {
    this._state.mutate((s) => {
      s.currentRoomMessages = [...messages];

      return s;
    });
  }
}
