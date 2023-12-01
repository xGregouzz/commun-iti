import { injectable } from "inversify";
import type { NewMessage } from "../models/NewMessage";
import type { NewMessageReaction } from "../models/NewMessageReaction";
import type { MessageData } from "../models/MessageData";
import type { PaginatedData, PaginatedQuery } from "@/modules/infrastructure/models";
import type { EmojiReaction } from "../models/domain";

@injectable()
export abstract class MessageAPI {
  abstract sendMessage(message: NewMessage): Promise<MessageData>;
  abstract reactTo(reaction: NewMessageReaction): Promise<boolean>;
  abstract removeReaction(messageId: string, reaction: EmojiReaction): Promise<boolean>;
  abstract fetch(roomId: string, pager: PaginatedQuery): Promise<PaginatedData<MessageData>>;
}
