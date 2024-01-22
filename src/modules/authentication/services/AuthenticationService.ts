import { injectable, inject } from "inversify";
import type { LoginModel } from "../models/LoginModel";
import { AuthenticationAPI } from "./AuthenticationAPI";
import { AuthenticationStore } from "../store/AuthenticationStore";
import { AuthenticationStorage } from "./AuthenticationStorage";
import { UserAPI } from "@/modules/user/services";

@injectable()
export class AuthenticationService {
  @inject(AuthenticationAPI) private readonly api!: AuthenticationAPI;
  @inject(UserAPI) private readonly userApi!: UserAPI;
  @inject(AuthenticationStore) private readonly store!: AuthenticationStore;
  @inject(AuthenticationStorage) private readonly storage!: AuthenticationStorage;

  async initialyze(): Promise<void> {
    this.store.load();

    if (this.store.isAuthenticated() && this.store.tokenValid()) {
      await this.refreshUserInfo();
    }
  }

  /**
   * Authenticate an user using credentials.
   * @param login
   * @returns
   */
  async authenticate(login: LoginModel): Promise<boolean> {
    const result = await this.api.login(login);
    console.log(result);
    if (!result) {
      return false;
    }

    this.store.setUser(result.user);
    this.store.setToken(result.token);

    return true;
  }

  /**
   * Logout the user from the platform.
   */
  async logout() {
    this.store.removeUser();
  }

  async refreshUserInfo() {
    const user = await this.userApi.getUserInfo();
    this.store.setUser(user);
  }
}
