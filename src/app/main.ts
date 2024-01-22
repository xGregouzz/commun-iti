import "reflect-metadata";
import "./styles/main.scss";
import "./styles/element/index.scss";
import "quill/dist/quill.core.css";
import "emoji-picker-element";

import ElementPlus from "element-plus";
import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { rootContainer } from "./config/container";
import { configureMessageContainer } from "@/modules/message/config";
import { configureRoomContainer } from "@/modules/room/config";
import { configureUserContainer } from "@/modules/user/config";
import { configureAuthenticationContainer } from "@/modules/authentication/config";
import { setupAuthentication } from "@/modules/authentication/setup";
import { configureInfrastructureContainer } from "@/modules/infrastructure/config";
import { DEFAULT_HTTP } from "./config/http";
import { APP_CONFIG } from "./config/env";

configureMessageContainer(rootContainer, {
  http: DEFAULT_HTTP
});
configureRoomContainer(rootContainer, {
  http: DEFAULT_HTTP
});
configureUserContainer(rootContainer, {
  http: DEFAULT_HTTP
});
configureAuthenticationContainer(rootContainer, {
  http: DEFAULT_HTTP
});
configureInfrastructureContainer(rootContainer, {
  serverUrl: APP_CONFIG.serverUrl,
  http: DEFAULT_HTTP
});

setupAuthentication(rootContainer, DEFAULT_HTTP).then(() => {
  const app = createApp(App);

  app.use(router);
  app.use(ElementPlus, { size: "large" });

  app.mount("#app");
});
