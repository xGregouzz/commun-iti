import type { AxiosInstance } from "axios";
import type { UpdateUserModel, UserRegistrationModel } from "../../models";
import type { User } from "../../models/domain/User";
import { UserAPI } from "../../services";
import { injectable } from "inversify";

@injectable()
export class HttpUserAPI extends UserAPI {
  constructor(private readonly http: AxiosInstance) {
    super();
  }

  async register(user: UserRegistrationModel): Promise<User> {
    const resonse = await this.http.post("/user", user);
    return resonse.data;
  }

  async exists(userName: string): Promise<boolean> {
    const response = await this.http.get(`/user/exists?username=${userName}`);
    return response.data;
  }

  async update(user: UpdateUserModel): Promise<void> {
    const formData = new FormData();
    formData.append("username", user.username);
    if (user.picture) {
      formData.append("picture", user.picture);
    }

    await this.http.put("user", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }

  async getUserInfo(): Promise<User> {
    const response = await this.http.get("/user");
    return response.data;
  }
}
