import { inject, injectable } from "inversify";
import type {
  Message,
  MessageAttachement,
  RichText,
} from "../models/domain";
import type { MessageData } from "../models/MessageData";
import { HtmlOgParser } from "@/modules/infrastructure/HtmlOgParser";

@injectable()
export class MessageDataParser {
  @inject(HtmlOgParser) ogParser!: HtmlOgParser;

  parse(message: MessageData): Message {
    message.text = this.replaceNewLines(message.text);
    const attachements = this.extractAttachements(message.text);

    return {
      id: message.id,
      roomId: message.roomId,
      author: message.author,
      creationDate: new Date(message.creationDate),
      reactions: message.reactions,
      text: message.text,
      type: message.type as "rich",
      attachements
    };
  }

  private replaceNewLines(text: RichText) {
    return text; // TODO
  }

  extractAttachements(text: RichText): MessageAttachement[] {
    const pictureRegex = /http[s]?:\/\/.+\.(jpeg|png|jpg|gif)/im;
    const videoRegex = /http[s]?:\/\/.+\.(mp4|wmv|flv|avi|wav)/im;
    const audioRegex = /http[s]?:\/\/.+\.(mp3|ogg|wav)/im;
    const youtubeRegex =
      /(http[s]?:\/\/)?www\.(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/im;

    const attachements: MessageAttachement[] = [];
    // TODO
    return attachements;
  }
}
