import { injectable } from "inversify";
import { AuthenticationAPI, type AuthenticationResult } from "../../services/AuthenticationAPI";
import type { LoginModel } from "../../models/LoginModel";
import { TypedLocalStorage } from "@/modules/infrastructure/storage";
import { LocalUserAPI, type UserStorageData } from "@/modules/user/platform/local/LocalUserAPI";

@injectable()
export class LocalStorageAuthenticationAPI extends AuthenticationAPI {
  
  private storage = new TypedLocalStorage<UserStorageData>(LocalUserAPI.STORAGE_KEY, {
    users: []
  });

  async login(login: LoginModel): Promise<AuthenticationResult | null> {
    const data = this.storage.getValue();
    const user = data.users.find(
      (u) =>
        u.username.toLowerCase() === login.username.toLowerCase() && u.password === login.password
    );

    if (!user) {
      return null;
    }

    return {
      user,
      token: {
        bearer: "",
        expiresAt: new Date()
      }
    };
  }

  async logout(): Promise<void> {}
}
