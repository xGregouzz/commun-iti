import type { Container } from "inversify";
import { HtmlOgParser } from "./HtmlOgParser";
import { SocketIoWebsocketConnection, WebSocketTopic, WebsocketConnection } from "./socket";
import { HttpOgParser } from "./HttpOgParser";
import type { BaseModuleConfig } from "./BaseModuleConfig";

export interface InfrastructureModuleConfig extends BaseModuleConfig {
  serverUrl: string;
}

export function configureInfrastructureContainer(container: Container, config: InfrastructureModuleConfig
) {
  container.bind(HtmlOgParser).toConstantValue(new HttpOgParser(config.http));
  container
    .bind(WebsocketConnection)
    .toConstantValue(new SocketIoWebsocketConnection(config.serverUrl));
  container.bind(WebSocketTopic).toSelf();
}
