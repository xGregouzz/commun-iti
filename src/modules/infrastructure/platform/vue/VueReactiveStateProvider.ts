import { injectable } from "inversify";
import { StateProvider } from "../../store/StateProvider";
import { VueReactiveMutableState } from "./VueReactiveMutableState";
import { MutableState } from "../../store/MutableState";

@injectable()
export class VueReactiveStateProvider extends StateProvider {
  new<T extends object>(defaultValue: T): MutableState<T> {
    return new VueReactiveMutableState(defaultValue);
  }
}
