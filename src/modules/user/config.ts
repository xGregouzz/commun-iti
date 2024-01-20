import type { Container } from "inversify";
import { UserAPI } from "./services";
import { LocalUserAPI } from "./platform/local/LocalUserAPI";
import { HttpUserAPI } from "./platform/http/HttpUserAPI";
import type { BaseModuleConfig } from "../infrastructure/BaseModuleConfig";

export function configureUserContainer(container: Container, config: BaseModuleConfig) {
  container.bind(UserAPI).to(LocalUserAPI);
}
