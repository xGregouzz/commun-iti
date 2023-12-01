import { Container } from "inversify";
import { MessageAPI } from "./services/MessageAPI";
import { MessageService } from "./services/MessageService";
import { LocalStorageMessageAPI } from "./services/platform/local/LocalStorageMessageAPI";
import { MessageStore } from "./store/MessageStore";
import { MessageDataParser } from "./services/MessageDataParser";

export function configureMessageContainer(container: Container) {
  container.bind(MessageService).toSelf();
  container.bind(MessageDataParser).toSelf().inSingletonScope();
  container.bind(MessageStore).toSelf().inSingletonScope();
  container.bind(MessageAPI).to(LocalStorageMessageAPI);
}
