import type { User } from "@/modules/user/models/domain/User";
import type { LoginModel } from "../models/LoginModel";
import { injectable } from "inversify";
import type { AuthenticationToken } from "../models/AuthenticationToken";

@injectable()
export abstract class AuthenticationAPI {
  abstract login(login: LoginModel): Promise<AuthenticationResult | null>;
  abstract logout(): Promise<void>;
}

export interface AuthenticationResult {
  user: User;
  token: AuthenticationToken;
}
