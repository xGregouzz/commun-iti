import { StateProvider, Store } from "@/modules/infrastructure/store";
import type { AuthenticationState } from "../models/state/AuthenticationState";
import type { User } from "@/modules/user/models/domain/User";
import { injectable, inject } from "inversify";
import { AuthenticationStorage } from "../services/AuthenticationStorage";
import type { AuthenticationToken } from "../models/AuthenticationToken";

@injectable()
export class AuthenticationStore extends Store<AuthenticationState> {
  @inject(AuthenticationStorage) private storage!: AuthenticationStorage;

  constructor(@inject(StateProvider) stateProvider: StateProvider) {
    super(() =>
      stateProvider.new({
        loggedUser: null
      })
    );
  }

  setUser(user: User) {
    this._state.mutate((s) => {
      s.loggedUser = user;

      return s;
    });

    this.save();
  }

  setToken(token: AuthenticationToken) {
    this._state.mutate((s) => {
      s.token = token;

      return s;
    });

    this.save();
  }

  removeUser() {
    this._state.mutate((s) => {
      s.loggedUser = null;
      s.token = undefined;
      return s;
    });

    this.save();
  }

  load() {
    const loadedState = this.storage.getValue();
    if (loadedState) {
      if (loadedState.token) {
        loadedState.token.expiresAt = new Date(loadedState.token.expiresAt);
      }
      
      this._state.set(loadedState);
    }
  }

  isAuthenticated(): boolean {
    return !!this.state.token && !!this.state.loggedUser;
  }

  tokenValid() {
    return (
      !!this.state.token?.expiresAt && this.state.token.expiresAt.getTime() > Date.now() + 10000
    );
  }

  private save() {
    this.storage.setValue(this.state);
  }
}
