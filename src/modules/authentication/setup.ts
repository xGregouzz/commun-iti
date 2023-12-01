import type { Container } from "inversify";
import { AuthenticationService } from "./services";

export function setupAuthentication(container: Container) {
  const authService = container.get(AuthenticationService);
  authService.initialyze();
}
