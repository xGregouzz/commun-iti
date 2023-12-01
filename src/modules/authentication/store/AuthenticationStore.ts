import { StateProvider, Store } from "@/modules/infrastructure/store";
import type { AuthenticationState } from "../models/state/AuthenticationState";
import type { User } from "@/modules/user/models/domain/User";
import { injectable, inject } from "inversify";
import { AuthenticationStorage } from "../services/AuthenticationStorage";

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

  removeUser() {
    this._state.mutate((s) => {
      s.loggedUser = null;

      return s;
    });

    this.save();
  }

  load() {
    const loadedState = this.storage.getValue();
    if (loadedState) {
      this._state.set(loadedState);
    }
  }

  private save() {
    this.storage.setValue(this.state);
  }
}
