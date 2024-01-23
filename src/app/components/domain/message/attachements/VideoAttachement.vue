<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="video-attachement light-card">
    <video controls width="250">
      <source :src="src" type="video/webm" />
    </video>
  </div>
</template>

<style lang="scss" scoped>
@use "@/app/styles/var";
@use "sass:map";

.video-attachement {
  max-width: 350px;

  video {
    width: 100%;
    display: block;
  }
}
</style>