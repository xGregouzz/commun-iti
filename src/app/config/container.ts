import { VueReactiveStateProvider } from "@/modules/infrastructure/platform/vue/VueReactiveStateProvider";
import { StateProvider } from "@/modules/infrastructure/store";
import { Container } from "inversify";

export const rootContainer = new Container();
rootContainer.bind(StateProvider).to(VueReactiveStateProvider).inSingletonScope();