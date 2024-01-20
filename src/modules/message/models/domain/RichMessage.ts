import type { MessageBase } from "./MessageBase";

export interface RichMessage extends MessageBase<"rich"> {
  attachements: MessageAttachement[];
}

export type MessageAttachement =
  | WebsiteMessageAttachement
  | YoutubeMessageAttachement
  | ImageMessageAttachement
  | AudioMessageAttachement
  | VideoMessageAttachement
  ;

export interface WebsiteMessageAttachement {
  type: "website";
  url: string;
}

export interface YoutubeMessageAttachement {
  type: "youtube";
  videoId: string;
  domain: string;
}

export interface ImageMessageAttachement {
  type: "image";
  src: string;
}

export interface VideoMessageAttachement {
  type: "video";
  src: string;
}

export interface AudioMessageAttachement {
  type: "audio";
  src: string;
}
