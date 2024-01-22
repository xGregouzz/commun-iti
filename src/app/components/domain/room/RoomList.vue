<script lang="ts" setup>
import { RoomStore } from "@/modules/room/store";
import { useState, useStore } from "@/app/platform";
import type { Room } from "@/modules/room/models/domain/Room";
import router from "@/app/router";
import { RouterLink } from "vue-router";
const state = useState(RoomStore);
const store = useStore(RoomStore);

function selectRoom(room: Room) {
  store.setCurrentRoom(room);
}
</script>

<template>
  <nav class="room-list">
    <ul v-for="room in state.rooms" :key="room.id">
      <li>
        <router-link :to="{ path: `/app/room/${room.id}` }" @click="selectRoom(room)">{{ room.name }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
@use "sass:map";
@use "@/app/styles/var";

.room-list {
  padding-top: 1px;

  >ul {
    margin: 0;
    list-style-type: none;
    padding-inline: 0;

    >li {
      margin: 0;
      text-decoration: none;
      display: block;

      a {
        color: var.$color-lighter;
        text-decoration: none;
        display: block;
        padding: map-get(var.$spaces, "2xs") map-get(var.$spaces, "xs");

        &:hover {
          background-color: var.$color-light;
        }

        &.router-link-active {
          color: #ffffff;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
