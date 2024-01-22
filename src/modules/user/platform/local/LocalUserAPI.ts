import { TypedLocalStorage } from "@/modules/infrastructure/storage";
import type { UpdateUserModel, UserRegistrationModel } from "../../models";
import type { User } from "../../models/domain/User";
import { UserAPI } from "../../services/UserAPI";
import { v4 } from "uuid";
import { RoomAPI } from "@/modules/room/services";
import { inject, injectable } from "inversify";
import { LocalRoomAPI } from "@/modules/room/platform/local/LocalRoomAPI";
import { AuthenticationStorage } from "@/modules/authentication/services";

export interface UserData extends UserRegistrationModel {
  id: string;
  pictureUrl: string;
}

export interface UserStorageData {
  users: UserData[];
}

@injectable()
export class LocalUserAPI extends UserAPI {
  static STORAGE_KEY = "iti.users";

  private storage = new TypedLocalStorage<UserStorageData>(LocalUserAPI.STORAGE_KEY, {
    users: []
  });

  @inject(RoomAPI) roomApi!: LocalRoomAPI;
  @inject(AuthenticationStorage) authStorage!: AuthenticationStorage;

  async register(user: UserRegistrationModel): Promise<User> {
    const usernameExists = await this.exists(user.username);
    if (usernameExists) {
      throw new Error("Username already in taken");
    }

    const userNameRegex = /^(\w+)$/i;
    if (!user.username.match(userNameRegex)) {
      throw new Error("Invalid username");
    }

    const userData: UserData = {
      ...user,
      pictureUrl: "https://api.slingacademy.com/public/sample-users/6.png",
      id: v4()
    };

    const data = this.storage.getValue();
    data.users.push(userData);
    this.storage.setValue(data);
    if (this.roomApi instanceof LocalRoomAPI) {
      const rooms = this.roomApi.storage.getValue();
      const defaultRoom = rooms.rooms[0];

      if (defaultRoom) {
        defaultRoom.users[userData.id] = true;
        this.roomApi.storage.setValue(rooms);
      }
    }

    return {
      id: userData.id,
      pictureUrl: userData.pictureUrl,
      username: userData.username
    };
  }

  async exists(userName: string): Promise<boolean> {
    const user = this.storage
      .getValue()
      .users.find((u) => u.username.toLowerCase() === userName.toLowerCase());
    return !!user;
  }

  update(user: UpdateUserModel): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getUserInfo(): Promise<User> {
    const user = this.authStorage.getValue();
    return user?.loggedUser as User;
  }
}
