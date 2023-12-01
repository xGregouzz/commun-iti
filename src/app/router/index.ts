import AnonymousLayout from "@/app/components/layouts/AnonymousLayout.vue";
import AppLayout from "@/app/components/layouts/AppLayout.vue";
import RegisterPage from "@/app/components/pages/RegisterPage.vue";
import LoginPage from "@/app/components/pages/LoginPage.vue";
import RoomView from "@/app/components/pages/RoomView.vue";
import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import { useProvider, useState, useStore } from "../platform";
import { AuthenticationStore } from "@/modules/authentication/store/AuthenticationStore";
import { RoomStore } from "@/modules/room/store";
import { RoomAPI } from "@/modules/room/services";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/app"
    },
    {
      path: "/register",
      component: AnonymousLayout,
      children: [
        {
          path: "",
          name: "register",
          component: RegisterPage
        }
      ]
    },
    {
      path: "/login",
      component: AnonymousLayout,
      beforeEnter: (to, from) => {
        const authState = useState(AuthenticationStore);

        if (authState.loggedUser) {
          return { path: "/app" };
        }

        return true;
      },
      children: [
        {
          path: "",
          name: "login",
          component: LoginPage
        }
      ]
    },
    {
      path: "/app",
      component: AppLayout,
      beforeEnter: (to, from) => {
        const authState = useState(AuthenticationStore);

        if (!authState.loggedUser) {
          return { path: "/login", query: { redirectPath: to.path }, hash: to.hash };
        }

        return true;
      },
      children: [
        {
          path: "room/:roomId",
          name: "room",

          beforeEnter: async (to: RouteLocationNormalized, from) => {
            const roomStore = useStore(RoomStore);
            const [roomApi] = useProvider([RoomAPI]);

            if (roomStore.state.currentRoom?.id !== to.params.roomId) {
              const room = await roomApi.findById(to.params.roomId as string);

              if (room) {
                roomStore.setCurrentRoom(room);
                return true;
              } else {
                return { path: "/app" };
              }
            }
          },
          component: RoomView
        }
      ]
    }
  ]
});

export default router;
