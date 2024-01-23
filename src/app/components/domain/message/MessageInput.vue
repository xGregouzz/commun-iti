<script lang="ts" setup>
import { MessageService } from "@/modules/message/services/MessageService";
import { useProvider, useState } from "@/app/platform";
import { RoomStore } from "@/modules/room/store";
import type { RichText } from "@/modules/message/models/domain";
import RichTextEditor from "../../ui/RichTextEditor.vue";

const [messageService] = useProvider([MessageService]);
const roomState = useState(RoomStore);

function sendMessage(text: RichText) {
  messageService.sendMessage({
    text: text,
    roomId: roomState.currentRoom!.id
  })
}
</script>
<template>
  <div class="message-input stretch-wh">
    <RichTextEditor @input="sendMessage"></RichTextEditor>
  </div>
</template>
<style lang="scss" scoped>
@use "@/app/styles/var";

.message-input {
  border-top: 1px solid var.$color-light-gray;
  background-color: var.$color-light-gray;
}
</style>
