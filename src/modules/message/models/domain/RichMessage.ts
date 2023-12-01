import type { MessageBase } from "./MessageBase";

export interface RichMessage extends MessageBase<"rich"> {
  attachements: MessageAttachement[];
}

export type MessageAttachement =
  | WebsiteMessageAttachement
  | YoutubeMessageAttachement
  | ImageMessageAttachement
  | VideoMessageAttachement;

export interface WebsiteMessageAttachement {
  type: "website";
  url: string;
  image: string;
  title: string;
  description: string;
}

export interface YoutubeMessageAttachement {
  type: "youtube";
  videoId: string;
}

export interface ImageMessageAttachement {
  type: "image";
  src: string;
}

export interface VideoMessageAttachement {
  type: "video";
  src: string;
}
