import type { Container } from "inversify";
import { AuthenticationService } from "./services";
import type { AxiosInstance } from "axios";
import { AuthenticationStore } from "./store/AuthenticationStore";

export async function setupAuthentication(container: Container, http: AxiosInstance) {
  const store = container.get(AuthenticationStore);

  http.interceptors.request.use((request) => {
    if (store.isAuthenticated() && store.tokenValid()) {
      request.headers.Authorization = `Bearer ${store.state?.token?.bearer}`;
      return request;
    }

    return request;
  });

  const authService = container.get(AuthenticationService);
  await authService.initialyze();
}
