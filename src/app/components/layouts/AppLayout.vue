<script lang="ts" setup>
import LeftMenu from "@/app/components/domain/menu/LeftMenu.vue";
import RightMenu from "@/app/components/domain/menu/RightMenu.vue";
import MessageInput from "@/app/components/domain/message/MessageInput.vue";
</script>
<template>
  <section class="app-layout full-wh">
    <aside>
      <left-menu />
    </aside>

    <main>
      <main>
        <!-- TODO -->
      </main>

      <footer>
        <message-input />
      </footer>
    </main>

    <right-menu />
  </section>
</template>
<style lang="scss" scoped>
@use "@/app/styles/var";

.app-layout {
  display: flex;

  > aside {
    width: var.$layout-left-menu-width;
    height: 100%;
    background-color: var.$color-primary-darker;
  }

  > main {
    flex: 1;
    display: flex;
    flex-direction: column;

    > main {
      flex: 1;
    }

    > footer {
      height: var.$layout-footer-height;
    }
  }
}
</style>
