<script lang="ts" setup>
import Message from "@/app/components/domain/message/Message.vue";
import { useProvider, useState, useStore } from "@/app/platform";
import { MessageService } from "@/modules/message/services/MessageService";
import { RoomSocketService } from "@/modules/room/services";
import { MessageStore } from "@/modules/message/store";
import { watch, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { MessageSocketService } from "@/modules/message/services/MessageSocketService";
import { AuthenticationStore } from "@/modules/authentication/store/AuthenticationStore";
import { ElNotification } from "element-plus";
import type { Room } from "@/modules/room/models/domain/Room";

const props = defineProps<{ room: Room }>();
const state = useState(MessageStore);
const authState = useState(AuthenticationStore);
const store = useStore(MessageStore);

const [messageService, messageSocket, roomSocket] = useProvider([
  MessageService,
  MessageSocketService,
  RoomSocketService
]);

const loading = ref(false);

// Element used to know if we should load more message
const top = ref<HTMLDivElement | null>(null);

// Should be use to know the size in px of all the messages displayed
const container = ref<HTMLDivElement | null>(null);

// Element that have the scrollbar
const root = ref<HTMLDivElement | null>(null);

watch(
  () => props.room,
  async (value, oldValue) => {
    if (value != oldValue) {
      store.reset();
    }
    await fetchMore();
    subscribeToIncomingMessage();
    subscribeToJoinRoom();
    subscribeToQuitRoom();
    subscribeToIncomingReaction();
  }
);

function subscribeToIncomingMessage() {
  messageSocket.onNewMessage(props.room.id, () => {
    ElNotification({ message: "Vous avez reçu un nouveau message", type: "info" })
    messageService.reloadMessages()
  }
  );
}

function subscribeToJoinRoom() {
  roomSocket.onRoomJoined((room) => {
    if (room.user.id !== authState.loggedUser?.id) {
      ElNotification({
        message: `${room.user.username} a rejoint le salon`,
        type: "info"
      });
    }
  });
}

function subscribeToQuitRoom() {
  roomSocket.onRoomLeft((room) => {
    if (room.user.id !== authState.loggedUser?.id) {
      ElNotification({
        message: `${room.user.username} a quitté le salon`,
        type: "info"
      });
    }
  });
}

function subscribeToIncomingReaction() {
  messageSocket.onReactionRemoved(() => {
    messageService.reloadMessages();
  });
  messageSocket.onNewReaction((reaction) => {
    if (reaction.message.author.id === authState.loggedUser?.id) {
      if (reaction.user.id !== authState.loggedUser?.id) {
        ElNotification({
          message: `${reaction.user.username} a réagi à votre message ${reaction.emoji}`,
          type: "info"
        });
        messageService.reloadMessages();
      }
    }
  });
}

async function fetchMore() {
  if (loading.value) {
    return;
  }

  try {
    loading.value = true;
    messageService.fetchMore(props.room.id)
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="room stretch-wh" ref="root">
    <div class="room-container" ref="container">
      <div ref="top"></div>
      <message v-for="message in state.currentRoomMessages" :key="message.id" :message="message" />
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
