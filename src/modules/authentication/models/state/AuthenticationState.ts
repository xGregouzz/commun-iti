import type { User } from "@/modules/user/models/domain/User";
import type { AuthenticationToken } from "../AuthenticationToken";

export interface AuthenticationState {
  loggedUser: User | null;
  token?: AuthenticationToken;
}
