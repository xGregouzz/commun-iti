<script lang="ts" setup>
import Room from "@/app/components/domain/room/Room.vue";
import RoomHeader from "@/app/components/domain/room/RoomHeader.vue";
import { useProvider, useState, useStore } from "@/app/platform";
import { RoomAPI } from "@/modules/room/services";
import { RoomStore } from "@/modules/room/store";
import { watch } from "vue";
import { useRoute } from "vue-router";

const state = useState(RoomStore);
const route = useRoute();
const roomStore = useStore(RoomStore);
const [roomApi] = useProvider([RoomAPI]);

watch(
  () => route.params.roomId as string,
  async (roomId: string) => {
    if (roomStore.state.currentRoom?.id !== roomId) {
      const room = await roomApi.findById(roomId);

      if (room) {
        roomStore.setCurrentRoom(room);
        return true;
      } else {
        return { path: "/app" };
      }
    }
  }
);
</script>
<template>
  <section class="room-view stretch-wh">
    <header>
      <room-header />
    </header>

    <main>
      <room v-if="state.currentRoom" :room="state.currentRoom" />
    </main>
  </section>
</template>
<style lang="scss" scoped>
@use "@/app/styles/var";

.room-view {
  display: flex;
  flex-direction: column;

  > header {
    height: var.$layout-top-menu-height;
  }
  > main {
    flex: 1;
    max-height: calc(100vh - (var.$layout-top-menu-height + var.$layout-footer-height));
    overflow-y: auto;
    flex-direction: column-reverse;
    display: flex;
  }
}
</style>
