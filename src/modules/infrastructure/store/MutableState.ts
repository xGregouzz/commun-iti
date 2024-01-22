export type StateMutation<T> = (current: T) => T;

export abstract class MutableState<T> {
  protected _defaultValue: T;

  abstract get value(): T;

  constructor(defaultValue: T) {
    this._defaultValue = defaultValue;
  }

  abstract set(value: T): T;

  abstract mutate(mutation: StateMutation<T>): T;

  protected reset() {
    this.set(this._defaultValue);
    return this.value;
  }
}
