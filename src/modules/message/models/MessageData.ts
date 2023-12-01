import type { User } from "@/modules/user/models/domain/User";
import type { RichText } from "./domain";
import type { EmojiReaction } from "./domain/MessageBase";

export interface MessageData {
  id: string;
  roomId: string;
  author: User;
  creationDate: string;
  type: string;
  reactions: EmojiReaction[];
  text: RichText;
}
