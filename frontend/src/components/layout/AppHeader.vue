<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const open = ref(false)

const logout = () => {
  open.value = false
  authStore.logout()
}
</script>

<template>
  <header
    v-if="authStore.isAuthenticated"
    class="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl"
  >
    <div class="mx-auto max-w-7xl px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- BRAND -->
        <div class="flex items-center gap-3">
          <img src="@/assets/logo.png" alt="Turismo WJL" class="h-10 w-10 rounded-lg shadow-sm" />

          <span class="text-base font-semibold tracking-wide text-slate-800 italic">
            Turismo
            <span class="text-indigo-600 font-bold">W<strong class="text-red-600">J</strong>L</span>
          </span>
        </div>

        <!-- NAV DESKTOP -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          <RouterLink to="/reservar" class="nav-link">Reservas</RouterLink>
          <RouterLink to="/about" class="nav-link">Acerca</RouterLink>
        </nav>

        <!-- ACTIONS -->
        <div class="hidden md:flex items-center gap-2">
          <button @click="logout" class="btn-secondary">Cerrar sesión</button>
        </div>

        <!-- MOBILE -->
        <button
          @click="open = !open"
          class="md:hidden rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 transition"
        >
          ☰
        </button>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <transition name="fade-slide">
      <div
        v-show="open"
        class="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-lg"
      >
        <nav class="flex flex-col gap-3 px-6 py-6 text-sm font-medium">
          <RouterLink @click="open = false" to="/" class="mobile-link"> Inicio </RouterLink>
          <RouterLink @click="open = false" to="/reservar" class="mobile-link">
            Reservas
          </RouterLink>
          <RouterLink @click="open = false" to="/about" class="mobile-link"> Acerca </RouterLink>

          <button @click="logout" class="btn-secondary mt-3">Cerrar sesión</button>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.nav-link {
  @apply relative text-slate-700 hover:text-indigo-600 transition font-semibold;
}

.nav-link.router-link-active {
  @apply text-indigo-600 font-bold;
}

.nav-link.router-link-active::after {
  content: '';
  @apply absolute -bottom-2 left-0 w-full h-0.5 bg-indigo-600 rounded-full;
}

.btn-secondary {
  @apply rounded-lg border border-slate-300 px-4 py-2 text-sm
         font-medium text-slate-700 hover:bg-slate-100 transition;
}

.mobile-link {
  @apply rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 transition;
}

/* Animación suave */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
