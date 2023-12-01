import { injectable } from "inversify";
import type { MutableState } from "./MutableState";

@injectable()
export abstract class Store<T> {
  protected _state: MutableState<T>;
  private defaultStateFn: ()=> MutableState<T>;

  constructor(defaultStateFn: ()=> MutableState<T>) {
    this.defaultStateFn = defaultStateFn;
    this._state = defaultStateFn();
  }

  get state() {
    return this._state.value;
  }

  reset() {
    this._state.mutate(() => {
      return this.defaultStateFn().value as T;
    });
  }
}
