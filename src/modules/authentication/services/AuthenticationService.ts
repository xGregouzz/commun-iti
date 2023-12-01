import { injectable, inject } from "inversify";
import type { LoginModel } from "../models/LoginModel";
import { AuthenticationAPI } from "./AuthenticationAPI";
import { AuthenticationStore } from "../store/AuthenticationStore";
import { AuthenticationStorage } from "./AuthenticationStorage";

@injectable()
export class AuthenticationService {
  @inject(AuthenticationAPI) private readonly api!: AuthenticationAPI;
  @inject(AuthenticationStore) private readonly store!: AuthenticationStore;
  @inject(AuthenticationStorage) private readonly storage!: AuthenticationStorage;

  initialyze() {
    this.store.load();
  }

  /**
   * Authenticate an user using credentials.
   * @param login
   * @returns
   */
  async authenticate(login: LoginModel): Promise<boolean> {
    const user = await this.api.login(login);
    if (!user) {
      return false;
    }

    this.store.setUser(user);

    return true;
  }

  /**
   * Logout the user from the platform.
   */
  async logout() {
    await this.api.logout();
    this.store.removeUser();
  }
}
