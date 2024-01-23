<script setup lang="ts">
import { useProvider } from "@/app/platform";
import { AuthenticationStore } from "@/modules/authentication/store/AuthenticationStore";
import type { EmojiReaction } from "@/modules/message/models/domain";
import { computed } from "vue";

export interface MessageReaction extends EmojiReaction {
  userReacted: boolean;
}

const props = defineProps<{
  reactions: EmojiReaction[];
}>();

const emit = defineEmits<{
  reactionClick: [EmojiReaction];
}>();
const [authStore] = useProvider([AuthenticationStore]);

/**
 * Reactions data
 */
const messageReactions = computed<MessageReaction[]>(() => {
  const user = authStore.state.loggedUser;
  if (user) {
    return props.reactions.map((reaction) => ({
      emoji: reaction.emoji,
      userReactions: reaction.userReactions,
      userReacted: reaction.userReactions.some((r) => r.userId === user.id)
    }));
  }

  return [];
});
</script>

<template>
  <div class="message-reactions">
    <button v-for="reaction in messageReactions" :key="reaction.emoji" class="message-reaction"
      :class="{ 'user-reacted': reaction.userReacted }" @click="$emit('reactionClick', reaction)">
      <div class="message-reaction-emoji">{{ reaction.emoji }}</div>
      <div class="message-reaction-count">{{ reaction.userReactions.length }}</div>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "sass:map";
@use "@/app/styles/var";

.message-reactions {
  display: flex;
  gap: map-get(var.$spaces, "3xs");
  margin-top: map-get(var.$spaces, "3xs");
  max-width: 100%;
  flex-wrap: wrap;

  .message-reaction {
    border: 1px solid var.$color-light-gray;
    padding: 0 map-get(var.$spaces, "4xs");
    display: flex;
    border-radius: 5px;
    gap: map-get(var.$spaces, "3xs");
    justify-content: center;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;

    &.user-reacted {
      background-color: var.$color-primary-lighter;
      border-color: var.$color-primary-light;
    }

    .message-reaction-emoji {
      font-size: 18px;
    }

    .message-reaction-count {
      font-size: 14px;
    }
  }
}
</style>