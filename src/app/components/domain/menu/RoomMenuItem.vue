<script lang="ts" setup>
import RoomSearchModal from "@/app/components/domain/room/RoomSearchModal.vue";
import { useProvider, useState } from "@/app/platform";
import { RoomService } from "@/modules/room/services/RoomService";
import { RoomStore } from "@/modules/room/store";
import { Plus, Search } from "@element-plus/icons-vue";
import { onMounted } from "vue";
import RoomCreationModal from "../room/RoomCreationModal.vue";

const state = useState(RoomStore);
const [roomService] = useProvider([RoomService]);
onMounted(() => {
  if (state.rooms.length === 0) {
    roomService.fetchMore();
  }
});

</script>

<template>
  <div class="room-menu-item">
    <div class="room-menu-title">Salon actuel</div>
    <div class="room-menu-main">
      <div class="room-menu-name">{{ state.currentRoom?.name }}</div>
      <div class="room-menu-actions">
        <room-creation-modal ref="creationModal"></room-creation-modal>
        <el-button :icon="Plus" size="default" circle
          @click="($refs.creationModal as InstanceType<typeof RoomCreationModal>).show()" />
        <room-search-modal ref="searchModal"></room-search-modal>
        <el-button :icon="Search" size="default" circle
          @click="($refs.searchModal as InstanceType<typeof RoomSearchModal>).show()" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/app/styles/var";

.room-menu-item {
  padding: map-get(var.$spaces, "xs");
  color: white;

  .room-menu-title {
    font-size: 70%;
    color: rgba(255, 255, 255, 0.7);
  }

  .room-menu-main {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .room-menu-actions {
      display: flex;
      gap: map-get(var.$spaces, "2xs");
    }
  }
}
</style>
