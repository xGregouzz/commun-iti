<script setup lang="ts">
import { useProvider } from "@/app/platform";
import { ref } from "vue";
import { HtmlOgParser } from "@/modules/infrastructure/HtmlOgParser";
import type { WebsiteMessageAttachement } from "@/modules/message/models/domain";

interface WebsiteMetadata {
  domain: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

const [ogParser] = useProvider([HtmlOgParser]);
const data = ref<WebsiteMetadata | null>(null);

const props = defineProps<{
  attachement: WebsiteMessageAttachement;
}>();

const fetchData = () =>
  ogParser.parse(props.attachement.url).then((res) => {
    data.value = res;
  });

fetchData();
</script>
<template>
  <div class="website-attachement light-card">
    <div class="website-attachement-domain">{{ data?.domain }}</div>
    <div class="website-attachement-title">{{ data?.title }}</div>
    <div class="website-attachement-description">{{ data?.description }}</div>
    <div class="website-attachement-image"><img :src="data?.imageUrl" /></div>
  </div>
</template>
<style lang="scss" scoped>
@use "sass:map";
@use "@/app/styles/var";

.website-attachement {
  max-width: 450px;
  .website-attachement-domain {
    font-size: 14px;
    color: var.$color-dark-gray;
  }
  .website-attachement-image {
    max-width: 350px;
    margin-top: map-get(var.$spaces, "2xs");
    img {
      width: 100%;
      display: block;
    }
  }
}
</style>