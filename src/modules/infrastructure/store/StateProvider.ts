import { injectable } from "inversify";
import { MutableState } from "./MutableState";

@injectable()
export abstract class StateProvider {
  abstract new<T extends object>(defaultValue: T): MutableState<T>;
}
