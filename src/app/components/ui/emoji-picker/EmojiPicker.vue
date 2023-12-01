<script lang="ts" setup>
import EmojiPickerRoot from "./EmojiPickerRoot.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useElementBounding } from "@vueuse/core";
import { useEmojiPicker } from ".";

const emojiPickerSize = 350;

const emit = defineEmits<{
  pick: [emoji: string];
}>();

const rootElement = ref<HTMLDivElement | null>(null);
const { top } = useElementBounding(rootElement);

const {
  hide: hidePicker,
  show: showPicker,
  onEmojiPicked,
  offEmojiPicked,
  rootSetup
} = useEmojiPicker();

function show() {
  if (!rootElement.value) {
    console.warn("Picker element not yet ready");
    return;
  }

  if (emojiPickerSize + top.value > window.innerHeight) {
    showPicker(rootElement.value, {
      y: top.value - emojiPickerSize - 10
    });
  } else {
    showPicker(rootElement.value, {
      y: top.value + 35
    });
  }
}

function hide() {
  hidePicker();
}

function emitEmojiPicked(emoji: string) {
  emit("pick", emoji);
}

onMounted(() => {
  onEmojiPicked(rootElement.value!, emitEmojiPicked);
});

onUnmounted(() => {
  offEmojiPicked(rootElement.value!);
});

defineExpose({
  show,
  hide
});
</script>

<template>
  <div class="iti-emoji-picker" ref="rootElement">
    <teleport to="body" v-if="!rootSetup.isSetuped" :disabled="rootSetup.isSetuped">
      <emoji-picker-root />
    </teleport>
  </div>
</template>
