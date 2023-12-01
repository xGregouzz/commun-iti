<script lang="ts" setup>
import Message from "@/app/components/domain/message/Message.vue";
import { useProvider, useState, useStore } from "@/app/platform";
import { MessageService } from "@/modules/message/services/MessageService";
import { MessageStore } from "@/modules/message/store";
import { watch, ref } from "vue";
import type { Room } from "@/modules/room/models/domain/Room";
import { useIntersectionObserver } from "@vueuse/core";

const props = defineProps<{ room: Room }>();
const state = useState(MessageStore);
const store = useStore(MessageStore);
const [messageSerivce] = useProvider([MessageService]);

// Element used to know if we should load more message
const top = ref<HTMLDivElement | null>(null);

// Should be use to know the size in px of all the messages displayed
const container = ref<HTMLDivElement | null>(null);

// Element that have the scrollbar
const root = ref<HTMLDivElement | null>(null);

</script>

<template>
  <div class="room stretch-wh" ref="root">
    <div class="room-container" ref="container">
      <div ref="top"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.room {
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
}
.room-container {
  display: flex;
  flex-direction: column-reverse;
}
</style>
