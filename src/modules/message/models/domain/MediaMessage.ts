import type { MessageBase } from "./MessageBase";

export interface MediaMessage<T> extends MessageBase<T> {
  src: string;
}

export interface PictureMessage extends MediaMessage<"picture"> {}

export interface VideoMessage extends MediaMessage<"video"> {}

export interface AudioMessage extends MediaMessage<"audio"> {}
