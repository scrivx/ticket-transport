<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MainContainer from '@/components/layout/MainContainer.vue'
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800"
  >
    <AppHeader />
    <MainContainer>
      <RouterView />
    </MainContainer>
  </div>
  <AppFooter />
</template>
