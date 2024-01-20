import type { User } from "@/modules/user/models/domain/User";
import type { LoginModel } from "../../models/LoginModel";
import { AuthenticationAPI, type AuthenticationResult } from "../../services";
import type { AxiosInstance } from "axios";
import { injectable } from "inversify";

@injectable()
export class HttpAuthenticationAPI extends AuthenticationAPI {
  constructor(private readonly http: AxiosInstance) {
    super();
  }

  async login(login: LoginModel): Promise<AuthenticationResult | null> {
    try {
      const { data } = await this.http.post<AuthenticationData>("/auth/login", login);
      return {
        user: data.user,
        token: {
          bearer: data.bearer.token,
          expiresAt: new Date(data.bearer.expiresAt)
        }
      };
    } catch (e) {
      return null;
    }
  }

  logout(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export interface AuthenticationData {
  user: User;
  bearer: {
    token: string;
    expiresAt: string;
  };
}
