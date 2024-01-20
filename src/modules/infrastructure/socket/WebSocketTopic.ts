import { inject, injectable } from "inversify";
import { WebsocketConnection } from "./WebsocketConnection";

@injectable()
export class WebSocketTopic {
  @inject(WebsocketConnection) private cnx!: WebsocketConnection;

  subscribe(topic: string, handler: (...args: any[]) => any) {
    this.cnx.emit("subscribe", {
      topic
    });
    this.cnx.on(topic, handler);
    this.cnx.on("connect", () => {
      this.cnx.emit("subscribe", {
        topic
      });
    });
  }

  unsubscribe(topic: string, handler: (...args: any[]) => any) {
    this.cnx.emit("unsubscribe", {
      topic
    });
    this.cnx.off(topic, handler);
  }
}
