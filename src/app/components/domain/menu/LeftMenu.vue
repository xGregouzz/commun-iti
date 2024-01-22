<script lang="ts" setup>
import UserProfileMenuItem from "./UserProfileMenuItem.vue";
import RoomMenuItem from "./RoomMenuItem.vue";
import RoomList from "@/app/components/domain/room/RoomList.vue";

</script>

<template>
  <div class="left-menu stretch-wh">
    <div class="left-menu-top">
      <user-profile-menu-item class="user" />
    </div>

    <h3>Salons</h3>

    <div class="left-menu-middle">
      <room-list />
    </div>

    <div class="left-menu-bottom">
      <room-menu-item />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:map";
@use "@/app/styles/var";

.left-menu {
  display: flex;
  flex-direction: column;

  .left-menu-middle {
    flex: 1;
  }

  h3 {
    color: white;
    text-align: center;
    background-color: var.$color-light;
    padding: map-get(var.$spaces, "2xs");
  }

  .left-menu-bottom {
    border-top: 1px solid var.$color-light;
  }
}
</style>
