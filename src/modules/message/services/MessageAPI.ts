import { injectable } from "inversify";
import type { NewMessage } from "../models/NewMessage";
import type { MessageReactionParams } from "../models/NewMessageReaction";
import type { MessageData } from "../models/MessageData";
import type { PaginatedData, PaginatedQuery } from "@/modules/infrastructure/models";

@injectable()
export abstract class MessageAPI {
  abstract sendMessage(message: NewMessage): Promise<MessageData>;
  abstract reactTo(reaction: MessageReactionParams): Promise<boolean>;
  abstract removeReaction(reaction: MessageReactionParams): Promise<boolean>;
  abstract fetch(roomId: string, pager: PaginatedQuery): Promise<PaginatedData<MessageData>>;
}
