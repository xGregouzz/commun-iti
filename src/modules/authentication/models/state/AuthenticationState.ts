import type { User } from "@/modules/user/models/domain/User";

export interface AuthenticationState {
  loggedUser: User | null;
}
