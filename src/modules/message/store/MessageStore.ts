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

  setMessageReaction(message: Message, emoji: string) {
    this._state.mutate((s) => {
      let emojiReaction = message.reactions.find((e) => e.emoji === emoji);

      if (!emojiReaction) {
        emojiReaction = {
          emoji,
          userReacted: true,
          reactionCount: 0
        };

        message.reactions.push(emojiReaction);
      }

      emojiReaction.userReacted = true;
      emojiReaction.reactionCount++;

      return s;
    });
  }

  removeMessageReaction(message: Message, emoji: string) {
    this._state.mutate((s) => {
      const idx = message.reactions.findIndex((e) => e.emoji === emoji);

      if (idx > -1) {
        const emojiReaction = message.reactions[idx];

        emojiReaction.userReacted = false;
        emojiReaction.reactionCount--;

        if (emojiReaction.reactionCount === 0) {
          message.reactions.splice(idx, 1);
        }
      }

      return s;
    });
  }
}
