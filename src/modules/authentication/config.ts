import type { Container } from "inversify";
import { AuthenticationAPI } from "./services/AuthenticationAPI";
import { LocalStorageAuthenticationAPI } from "./platform/local/LocalAuthenticationAPI";
import { AuthenticationStore } from "./store/AuthenticationStore";
import { AuthenticationService, AuthenticationStorage } from "./services";

export function configureAuthenticationContainer(container: Container) {
  container.bind(AuthenticationAPI).to(LocalStorageAuthenticationAPI);
  container.bind(AuthenticationStore).toSelf().inSingletonScope();
  container.bind(AuthenticationService).toSelf().inSingletonScope();
  container.bind(AuthenticationStorage).toConstantValue(new AuthenticationStorage());
}
