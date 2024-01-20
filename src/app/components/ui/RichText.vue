<script lang="ts" setup>
import type { RichText } from "@/modules/message/models/domain";

defineProps<{
  text: RichText;
}>();
</script>

<template>
  <div class="rich-text">
    <template v-for="(token, i) in text.tokens" :key="i">
      <span v-if="token.type === 'rich'" v-html="token.value"></span>
      <span v-else>{{ token.value }}</span>
    </template>
  </div>
</template>
<style scoped>
.rich-text {
  > div {
    white-space: pre-wrap;
  }
}
</style>
