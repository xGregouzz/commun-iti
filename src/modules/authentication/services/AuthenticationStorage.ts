import { TypedLocalStorage } from "@/modules/infrastructure/storage";
import { injectable } from "inversify";
import type { AuthenticationState } from "../models/state/AuthenticationState";

@injectable()
export class AuthenticationStorage extends TypedLocalStorage<AuthenticationState | null> {
  public static readonly STORAGE_KEY = "iti.authentication";

  constructor() {
    super(AuthenticationStorage.STORAGE_KEY, null);
  }
}
