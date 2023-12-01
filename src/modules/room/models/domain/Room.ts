import type { User } from "@/modules/user/models/domain/User";

export interface Room {
  id: string;
  name: string;
  creationDate: Date;
  owner: User;
}
