<script lang="ts" setup>
import { onUnmounted, watch } from "vue";
import { useRightMenuState } from "./useRightMenu";

const { hide, isShown, show } = useRightMenuState();

function onDocumentClick() {
  hide();
}

watch(isShown, (value) => {
  if (value) {
    setTimeout(() => document.addEventListener("click", onDocumentClick));
  } else {
    document.removeEventListener("click", onDocumentClick);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
});

defineExpose({
  hide,
  show
});
</script>

<template>
  <div class="right-menu" :class="{ opened: isShown }" @click.stop=""></div>
</template>

<style lang="scss" scoped>
@use "@/app/styles/var";

.right-menu {
  position: fixed;
  width: var.$layout-right-menu-width;
  height: 100vh;
  right: 0;
  top: 0;
  z-index: 10;
  background-color: white;
  transform: translatex(var.$layout-right-menu-width + 107px);
  transition: transform 0.3s ease;
  box-shadow:
    -18.6px 12.8px 16px rgba(0, 0, 0, 0.052),
    -48px 33px 107px rgba(0, 0, 0, 0.12);

  &.opened {
    transform: translatex(0);
  }
}
</style>
