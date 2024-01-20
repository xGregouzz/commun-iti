import { injectable } from "inversify";
import { MessageAPI } from "../../MessageAPI";
import type { PaginatedQuery, PaginatedData } from "@/modules/infrastructure/models";
import type { MessageData } from "@/modules/message/models/MessageData";
import type { NewMessage } from "@/modules/message/models/NewMessage";
import type { AxiosInstance } from "axios";
import type { MessageReactionParams } from "@/modules/message/models/NewMessageReaction";

@injectable()
export class HttpMessageAPI extends MessageAPI {
  constructor(private readonly http: AxiosInstance) {
    super();
  }

  async sendMessage(newMessage: NewMessage): Promise<MessageData> {
    const { data: message } = await this.http.post("/message", newMessage);

    return {
      id: message.id,
      roomId: message.roomId,
      author: message.author,
      text: message.text,
      creationDate: message.creationDate,
      type: "rich",
      reactions: []
    };
  }

  async reactTo(reaction: MessageReactionParams): Promise<boolean> {
    try {
      await this.http.post("/message/react", reaction);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async removeReaction(reaction: MessageReactionParams): Promise<boolean> {
    try {
      await this.http.post("/message/remove-reaction", reaction);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async fetch(roomId: string, pager: PaginatedQuery): Promise<PaginatedData<MessageData>> {
    const { data: result } = await this.http.get(
      `/message?roomId=${roomId}&page=${pager.page}&perPage=${pager.perPage}`
    );

    return {
      data: result.data,
      page: result.page,
      perPage: result.perPage,
      total: result.total
    };
  }
}
