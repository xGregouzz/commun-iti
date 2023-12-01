import type { Container } from "inversify";
import { StateProvider } from "./store/StateProvider";
import { VueReactiveStateProvider } from "./platform/vue/VueReactiveStateProvider";

export function configureInfrastructureContainer(container: Container) {
    container.bind(StateProvider).to(VueReactiveStateProvider);
}