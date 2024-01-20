import { injectable } from "inversify";
import { WebsocketConnection } from "./WebsocketConnection";
import { io, Socket } from "socket.io-client";

@injectable()
export class SocketIoWebsocketConnection extends WebsocketConnection {
  socket: Socket | null = null;
  subscriptions: [string, (...args: any[]) => any][] = [];
  events: [string, any[]][] = [];

  constructor(private serverUrl: string) {
    super();
  }

  connect(accessToken: string) {
    const socket = io(this.serverUrl, {
      auth: {
        accessToken
      }
    });

    socket.on("connect", () => {
      this.socket = socket;
      console.log(socket.id);

      this.events.forEach(([event, args]) => {
        socket.emit(event, ...args);
      });

      this.subscriptions.forEach(([event, handler]) => {
        socket.on(event, handler);
      });
    });

    socket.on("disconnect", () => {
      this.socket = null;
      this.subscriptions = [];
      this.events = [];
    });

    socket.on("error", (e: Error) => {
      throw e;
    });
  }

  on(event: string, handler: (...args: any[]) => any): void {
    if (this.socket) {
      this.socket.on(event, handler);
    } else {
      this.subscriptions.push([event, handler]);
    }
  }

  off(event: string, handler: (...args: any[]) => any): void {
    if (this.socket) {
      this.socket.off(event, handler);
    }
    const idx = this.subscriptions.findIndex(([e, h]) => event === e && handler === h);
    if (idx > -1) {
      this.subscriptions.splice(idx, 1);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (this.socket) {
      this.socket.emit(event, ...args);
    } else {
      this.events.push([event, args]);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  close(): void {}
}
