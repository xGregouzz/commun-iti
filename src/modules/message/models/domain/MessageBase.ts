import type { User } from "@/modules/user/models/domain/User";

export interface MessageBase<T> {
  id: string;
  author: User;
  creationDate: Date;
  type: T;
  reactions: EmojiReaction[];
  text: RichText;
  roomId: string;
}

export interface EmojiReaction {
  emoji: string;
  userReactions: {
    userId: string;
  }[];
}

export interface RichText {
  tokens: RichTextToken[];
}

export interface RichTextToken {
  value: string;
  type: "rich" | "link" | "mention";
}
