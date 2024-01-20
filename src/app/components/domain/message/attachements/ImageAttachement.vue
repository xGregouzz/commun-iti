<script lang="ts" setup>
defineProps({
  src: {
    type: String,
    required: true
  }
});
</script>
<template>
  <div class="image-attachement light-card">
    <!-- TODO -->
  </div>
</template>
<style lang="scss" scoped>
@use "@/app/styles/var";
@use "sass:map";
.image-attachement {
  max-width: 350px;
  max-height: 400px;

  img {
    width: 100%;
    display: block;
  }
}
</style>
