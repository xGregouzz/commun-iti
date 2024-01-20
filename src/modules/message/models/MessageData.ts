import type { User } from "@/modules/user/models/domain/User";
import type { EmojiReaction, RichText } from "./domain";

export interface MessageData {
  id: string;
  roomId: string;
  author: User;
  creationDate: string;
  type: string;
  reactions: EmojiReaction[];
  text: RichText;
}
