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

    for (const token of text.tokens) {
      if (token.type === "link") {
        const pictureMatch = pictureRegex.exec(token.value);

        if (pictureMatch) {
          attachements.push({
            type: "image",
            src: token.value
          });
        }

        const videoMatch = videoRegex.exec(token.value);

        if (videoMatch) {
          attachements.push({
            type: "video",
            src: token.value
          });
        }

        const audioMatch = audioRegex.exec(token.value);

        if (audioMatch) {
          attachements.push({
            type: "audio",
            src: token.value
          });
        }

        const youtubeMatch = youtubeRegex.exec(token.value);

        if (youtubeMatch) {
          console.log(youtubeMatch);
          attachements.push({
            type: "youtube",
            videoId: youtubeMatch[2],
            domain: "youtube.com"
          });
        }

        if (!pictureMatch && !videoMatch && !audioMatch && !youtubeMatch) {
          attachements.push({
            type: "website",
            url: token.value
          });
        }
      }
    }

    return attachements;
  }
}
