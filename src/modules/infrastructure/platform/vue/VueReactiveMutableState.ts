import { reactive, type UnwrapNestedRefs } from "vue";
import { MutableState, type StateMutation } from "../../store/MutableState";

export class VueReactiveMutableState<T extends object> extends MutableState<T> {
  private reactiveValue: UnwrapNestedRefs<T>;

  constructor(defaultValue: T) {
    super(defaultValue);
    this.reactiveValue = reactive(defaultValue);
  }

  get value() {
    return this.reactiveValue as T;
  }

  set(value: T): T {
    this.mutate(() => value);
    return this.value as T;
  }

  mutate(mutation: StateMutation<T>): T {
    const mutated = mutation(this.value as T);
    Object.assign(this.reactiveValue, mutated);
    return this.value;
  }
}
