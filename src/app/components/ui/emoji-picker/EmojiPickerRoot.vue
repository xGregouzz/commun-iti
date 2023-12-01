<script lang="ts" setup>
import { computed, onUnmounted } from "vue";
import { useEmojiPicker } from ".";

const { isRootRendered, rootSetup, position, isShown, hide, fireEmojiPicked } = useEmojiPicker();

const styles = computed(() => {
  let computedStyles: any = {};

  if (position.value.x) {
    computedStyles.left = position.value.x + "px";
  }

  if (position.value.y) {
    computedStyles.top = position.value.y + "px";
  }

  return computedStyles;
});

function onEmojiPicked(e: CustomEvent) {
  fireEmojiPicked(e.detail.unicode);
  hide();
}

rootSetup.isSetuped = true;

onUnmounted(() => {
  rootSetup.isSetuped = false;
  isRootRendered.value = false;
});
</script>

<template>
  <div class="emoji-picker-root" ref="rootElement">
    <div v-if="isRootRendered" v-show="isShown" class="emoji-picker-overlay" @click="hide()">
      <emoji-picker ref="emojiPicker" @emoji-click="onEmojiPicked" @click.stop="" :style="styles" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$emoji-picker-size: 350px;

.emoji-picker-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

emoji-picker {
  position: relative;
  z-index: 100;
  width: $emoji-picker-size;
  height: $emoji-picker-size;
  left: calc(100% - $emoji-picker-size - 15px);
}
</style>
