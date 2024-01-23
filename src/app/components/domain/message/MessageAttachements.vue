<script setup lang="ts">
import ImageAttachement from "./attachements/ImageAttachement.vue";
import YoutubeAttachement from "./attachements/YoutubeAttachement.vue";
import VideoAttachement from "./attachements/VideoAttachement.vue";
import WebsiteAttachement from "./attachements/WebsiteAttachement.vue";
import {
  type ImageMessageAttachement,
  type VideoMessageAttachement,
  type MessageAttachement,
  type YoutubeMessageAttachement,
  type WebsiteMessageAttachement
} from "@/modules/message/models/domain";

defineProps<{
  attachements: MessageAttachement[];
}>();
</script>

<template>
  <div class="message-attachements">
    <template v-for="(attachement, i) in attachements" :key="i">
      <website-attachement v-show="attachement.type === 'website'"
        :attachement="attachement as WebsiteMessageAttachement" />
      <image-attachement v-show="attachement.type === 'image'" :src="(attachement as ImageMessageAttachement)?.src" />
      <youtube-attachement v-show="attachement.type === 'youtube'"
        :attachement="attachement as YoutubeMessageAttachement" />
      <video-attachement v-show="attachement.type === 'video'" :src="(attachement as VideoMessageAttachement).src" />
    </template>
  </div>
</template>
<style lang="scss">
@use "sass:map";
@use "@/app/styles/var";

.message-attachements {
  padding-top: map-get(var.$spaces, "2xs");
  display: flex;
  flex-wrap: wrap;
  gap: map-get(var.$spaces, "2xs");
}
</style>