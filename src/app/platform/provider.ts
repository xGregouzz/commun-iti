import { rootContainer } from "../config/container";

export type Constructor<T> = Function & { prototype: T };

export function useProvider<T1, T2, T3, T4, T5>(
  services: [Constructor<T1>, Constructor<T2>, Constructor<T3>, Constructor<T4>, Constructor<T5>]
): [T1, T2, T3, T4, T5];
export function useProvider<T1, T2, T3, T4>(
  services: [Constructor<T1>, Constructor<T2>, Constructor<T3>, Constructor<T4>]
): [T1, T2, T3, T4];
export function useProvider<T1, T2, T3>(
  services: [Constructor<T1>, Constructor<T2>, Constructor<T3>]
): [T1, T2, T3];
export function useProvider<T1, T2>(services: [Constructor<T1>, Constructor<T2>]): [T1, T2];
export function useProvider<T1>(services: [Constructor<T1>]): [T1];
export function useProvider(services: Constructor<any>[]) {
  return services.map((s) => rootContainer.get(s));
}
