<template>
  <div class="anonymous-layout">
    <aside>
      <h1>Commun <span>Iti</span></h1>
    </aside>
    
    <main>
      <router-view> </router-view>
    </main>
  </div>
</template>
<style scoped lang="scss">
@use "@/app/styles/var";

.anonymous-layout {
  height: 100vh;
  display: flex;

  aside {
    height: 100vh;
    background-color: var.$color-primary;
    flex: 1;
    max-width: 600px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  main {
    height: 100vh;
    flex: 1;
  }
}
</style>
