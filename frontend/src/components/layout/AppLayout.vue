<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MainContainer from '@/components/layout/MainContainer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-zinc-950 text-zinc-200">
    <AppHeader />
    <MainContainer>
      <RouterView />
    </MainContainer>
  </div>
  <AppFooter />
</template>
