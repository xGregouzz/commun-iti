<script lang="ts" setup>
import RichText from "@/app/components/ui/RichText.vue";
import BgImage from "../../ui/BgImage.vue";
import ItiEmojiPicker from "../../ui/emoji-picker/EmojiPicker.vue";
import EmojiIcon from "../../ui/icons/EmojiIcon.vue";
import MessageAttachements from "./MessageAttachements.vue";
import { useProvider, useState } from "@/app/platform";
import { MessageService } from "@/modules/message/services/MessageService";
import { DateTime } from "luxon";
import MessageReactions, { type MessageReaction } from "./MessageReactions.vue";
import { type EmojiReaction, type Message } from "@/modules/message/models/domain";
import { AuthenticationStore } from "@/modules/authentication/store/AuthenticationStore";

const props = defineProps<{
  message: Message;
}>();

const authState = useState(AuthenticationStore);

const [messageService] = useProvider([MessageService]);

function onEmojiPicked(emoji: string) {
  if (emoji) {
    messageService.reactTo(emoji, props.message);
  }
}

function handleReactionClick(emoji: EmojiReaction) {
  if (emoji.userReactions.some(reaction => reaction.userId === authState.loggedUser?.id)){
    messageService.removeReaction(emoji.emoji, props.message);
  } else {
    messageService.reactTo(emoji.emoji, props.message);
  }
}
</script>

<template>
  <div class="message">
    <div class="message-actions">
      <iti-emoji-picker ref="emojiPicker" @pick="onEmojiPicked" />
      <el-button :icon="EmojiIcon" circle size="small" @click="($refs.emojiPicker as typeof ItiEmojiPicker).show()" />
    </div>
    <bg-image class="message-user-photo" :src="props.message.author.pictureUrl" />
    <div class="message-content">
      <div class="message-title">
        <span> {{ props.message.author.username + " " }} </span>
        <small class="message-date">
          {{ props.message.creationDate.getDate() }}
          {{ props.message.creationDate.toLocaleString("default", { month: "long" }) }}
          {{ props.message.creationDate.getFullYear() }}
        </small>
        <rich-text :text="props.message.text" />
      </div>
      <message-attachements v-show="props.message.attachements.length > 0" :attachements="props.message.attachements" />
      <message-reactions :reactions="props.message.reactions" @reactionClick="handleReactionClick"/>
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:map";
@use "@/app/styles/var";

.message {
  margin: 0;
  padding: map-get(var.$spaces, "xs") map-get(var.$spaces, "s");
  display: flex;
  align-items: center;
  position: relative;

  &:hover {
    background-color: var.$color-lighter-gray;

    .message-actions {
      display: block;
    }
  }

  .message-actions {
    position: absolute;
    display: none;
    top: 0;
    right: 0;
    padding: map-get(var.$spaces, "xs") map-get(var.$spaces, "s");
    z-index: 10;
  }

  .message-user-photo {
    height: 40px;
    width: 40px;
    align-self: flex-start;
  }

  .message-title {
    font-weight: bold;

    .message-date {
      font-weight: normal;
      font-size: 12px;
    }
  }

  .message-content {
    padding-left: map-get(var.$spaces, "xs");
  }
}
</style>