import type { Container } from "inversify";
import { AuthenticationAPI } from "./services/AuthenticationAPI";
import { LocalStorageAuthenticationAPI } from "./platform/local/LocalAuthenticationAPI";
import { AuthenticationStore } from "./store/AuthenticationStore";
import { AuthenticationService, AuthenticationStorage } from "./services";
import { HttpAuthenticationAPI } from "./platform/http/HttpAuthenticationAPI";
import type { BaseModuleConfig } from "../infrastructure/BaseModuleConfig";

export function configureAuthenticationContainer(container: Container, config: BaseModuleConfig) {
  container.bind(AuthenticationAPI).toConstantValue(new HttpAuthenticationAPI(config.http));
  container.bind(AuthenticationStore).toSelf().inSingletonScope();
  container.bind(AuthenticationService).toSelf().inSingletonScope();
  container.bind(AuthenticationStorage).toConstantValue(new AuthenticationStorage());
}
