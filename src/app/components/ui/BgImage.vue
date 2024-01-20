<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  src: {
    type: String,
  },
  shape: {
    type: String,
    default: "square",
    validator: (value: string) => ["circle", "square"].includes(value)
  }
});

const classes = computed(() => [`background-image-${props.shape}`]);
</script>

<template>
  <div class="background-image" :class="classes" :style="{ backgroundImage: 'url(' + src + ')' }">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.background-image {
  flex-shrink: 0;
  background-color: gray;
}
.background-image-circle {
  border-radius: 50%;
}

.background-image-square {
  border-radius: 5px;
}
</style>
