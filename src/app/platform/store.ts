import type { Class } from "utility-types";
import { Store } from "@/modules/infrastructure/store";
import { rootContainer } from "../config/container";

export function useStore<T extends Store<any>>(storeClass: Class<T>): T {
  return rootContainer.get(storeClass);
}

export function useState<
  TStore extends Store<TState>,
  TState = TStore extends Store<infer T> ? T : unknown
>(store: Class<TStore>): TState {
  return useStore(store).state as TState;
}
