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

configureMessageContainer(rootContainer);
configureRoomContainer(rootContainer);
configureUserContainer(rootContainer);
configureAuthenticationContainer(rootContainer);

setupAuthentication(rootContainer);

const app = createApp(App);

app.use(router);
app.use(ElementPlus, { size: "large" });

app.mount("#app");
