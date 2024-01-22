import { Container } from "inversify";
import { RoomStore } from "./store";
import { LocalRoomAPI } from "./platform/local/LocalRoomAPI";
import { RoomAPI } from "./services/RoomAPI";
import { RoomService } from "./services/RoomService";
import { RoomSocketService } from "./services/RoomSocketService";
import { HttpRoomAPI } from "./platform/http/HttpRoomAPI";
import type { BaseModuleConfig } from "../infrastructure/BaseModuleConfig";

export function configureRoomContainer(container: Container, config: BaseModuleConfig) {
  container.bind(RoomStore).toSelf().inSingletonScope();
  container.bind(RoomService).toSelf().inSingletonScope();
  container.bind(RoomAPI).to(LocalRoomAPI).inSingletonScope();
  container.bind(RoomSocketService).toSelf().inSingletonScope();
}
