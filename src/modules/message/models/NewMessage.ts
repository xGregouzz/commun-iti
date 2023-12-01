import type { RichText } from "./domain/MessageBase";

export interface NewMessage {
  text: RichText;
  roomId: string;
  repliesTo?: string;
}

export interface NewFileMessage extends NewMessage {
  file: File;
}
