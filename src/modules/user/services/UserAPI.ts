import { injectable } from "inversify";
import type { UserRegistrationModel } from "../models";
import type { UpdateUserModel } from "../models";
import type { User } from "../models/domain/User";

@injectable()
export abstract class UserAPI {
  /**
   * Register a new User to the system
   * @param user 
   */
  abstract register(user: UserRegistrationModel): Promise<User>;

  /**
   * Check if the given username is already taken or not
   * @param userName 
   */
  abstract exists(userName: string): Promise<boolean>;

  abstract update(user: UpdateUserModel): Promise<void>;

  abstract getUserInfo(): Promise<User>;
}
