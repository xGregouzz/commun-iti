import { Container } from "inversify";
import { MessageAPI } from "./services/MessageAPI";
import { MessageService } from "./services/MessageService";
import { LocalStorageMessageAPI } from "./services/platform/local/LocalStorageMessageAPI";
import { MessageStore } from "./store/MessageStore";
import { MessageDataParser } from "./services/MessageDataParser";
import { HttpMessageAPI } from "./services/platform/http/HttpMessageAPI";
import { MessageSocketService } from "./services/MessageSocketService";
import type { BaseModuleConfig } from "../infrastructure/BaseModuleConfig";

export function configureMessageContainer(container: Container, config: BaseModuleConfig) {
  container.bind(MessageService).toSelf();
  container.bind(MessageDataParser).toSelf().inSingletonScope();
  container.bind(MessageStore).toSelf().inSingletonScope();
  container.bind(MessageAPI).to(LocalStorageMessageAPI);
  container.bind(MessageSocketService).toSelf().inSingletonScope();
}
