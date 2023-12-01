import { injectable } from "inversify";
import type { Message, MessageAttachement, RichText } from "../models/domain";
import type { MessageData } from "../models/MessageData";

@injectable()
export class MessageDataParser {
  parse(message: MessageData): Message {
    message.text = this.replaceNewLines(message.text);

    return {
      id: message.id,
      roomId: message.roomId,
      author: message.author,
      creationDate: new Date(message.creationDate),
      reactions: message.reactions,
      text: message.text,
      type: message.type as "rich",
      attachements: []
    };
  }

  private replaceNewLines(text: RichText) {
    return text; // TODO
  }
}
