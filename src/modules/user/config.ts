import type { Container } from "inversify";
import { UserAPI } from "./services";
import { LocalUserAPI } from "./platform/local/LocalUserAPI";

export function configureUserContainer(container: Container) {
  container.bind(UserAPI).to(LocalUserAPI);
}
