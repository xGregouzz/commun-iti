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
        <!-- TODO -->
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
