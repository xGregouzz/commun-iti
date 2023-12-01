<script lang="ts" setup>
import type { RichText } from "@/modules/message/models/domain";

defineProps<{
  text: RichText;
}>();
</script>

<template>
  <div class="rich-text">
    <template v-for="(token, i) in text.tokens" :key="i">
      <div v-if="token.type === 'rich'" v-html="token.value"></div>
      <div v-else>{{ token.value }}</div>
    </template>
  </div>
</template>
<style scoped>
.rich-text {
  display: flex;

  > div {
    white-space: pre;
  }
}
</style>
@/modules/message/models/domain
