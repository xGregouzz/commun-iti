import type { User } from "@/modules/user/models/domain/User";
import type { LoginModel } from "../models/LoginModel";
import { injectable } from "inversify";

@injectable()
export abstract class AuthenticationAPI {
  abstract login(login: LoginModel): Promise<User | null>;
  abstract logout(): Promise<void>;
}
