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
  <header class="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- BRAND -->
        <RouterLink to="/" class="flex items-center gap-3">
          <img src="@/assets/logo.png" alt="Turismo WJL" class="h-10 w-10 rounded-lg shadow-sm" />

          <span class="text-base font-semibold tracking-wide text-zinc-100 italic">
            Turismo
            <span class="text-zinc-300 font-bold">W<strong class="text-zinc-500">J</strong>L</span>
          </span>
        </RouterLink>

        <!-- NAV DESKTOP -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          <RouterLink to="/reservar" class="nav-link">Reservas</RouterLink>

          <template v-if="authStore.isAdmin">
            <RouterLink to="/admin/rutas" class="nav-link">Rutas</RouterLink>
            <RouterLink to="/admin/vehiculos" class="nav-link">Vehículos</RouterLink>
            <RouterLink to="/admin/horarios" class="nav-link">Programación</RouterLink>
            <RouterLink to="/admin/pasajeros" class="nav-link">Pasajeros</RouterLink>
          </template>

          <RouterLink to="/about" class="nav-link">Acerca</RouterLink>
        </nav>

        <!-- ACTIONS -->
        <div class="hidden md:flex items-center gap-2">
          <template v-if="authStore.isAuthenticated">
            <span class="text-sm text-zinc-400 mr-2">Hola, {{ authStore.user?.username }}</span>
            <button @click="logout" class="btn-secondary">Cerrar sesión</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="btn-primary">Iniciar sesión</RouterLink>
          </template>
        </div>

        <!-- MOBILE -->
        <button
          @click="open = !open"
          class="md:hidden rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-800/60 transition"
        >
          ☰
        </button>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <transition name="fade-slide">
      <div
        v-show="open"
        class="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-lg"
      >
        <nav class="flex flex-col gap-3 px-6 py-6 text-sm font-medium">
          <RouterLink @click="open = false" to="/" class="mobile-link"> Inicio </RouterLink>
          <RouterLink @click="open = false" to="/reservar" class="mobile-link">
            Reservas
          </RouterLink>

          <template v-if="authStore.isAdmin">
            <RouterLink @click="open = false" to="/admin/rutas" class="mobile-link"
              >Rutas</RouterLink
            >
            <RouterLink @click="open = false" to="/admin/vehiculos" class="mobile-link"
              >Vehículos</RouterLink
            >
            <RouterLink @click="open = false" to="/admin/horarios" class="mobile-link"
              >Programación</RouterLink
            >
            <RouterLink @click="open = false" to="/admin/pasajeros" class="mobile-link"
              >Pasajeros</RouterLink
            >
          </template>

          <RouterLink @click="open = false" to="/about" class="mobile-link"> Acerca </RouterLink>

          <div class="border-t border-zinc-800/60 pt-3">
            <button v-if="authStore.isAuthenticated" @click="logout" class="btn-secondary w-full">
              Cerrar sesión
            </button>
            <RouterLink v-else @click="open = false" to="/login" class="btn-primary-mobile"
              >Iniciar sesión</RouterLink
            >
          </div>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.nav-link {
  @apply relative text-zinc-400 hover:text-zinc-100 transition font-medium;
}

.nav-link.router-link-active {
  @apply text-zinc-100 font-bold;
}

.nav-link.router-link-active::after {
  content: '';
  @apply absolute -bottom-2 left-0 w-full h-0.5 bg-zinc-400 rounded-full;
}

.btn-secondary {
  @apply rounded-lg border border-zinc-700 px-4 py-2 text-sm
         font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition;
}

.btn-primary {
  @apply rounded-lg bg-zinc-100 border border-zinc-100 px-4 py-2 text-sm
         font-medium text-zinc-900 hover:bg-zinc-200 transition;
}

.btn-primary-mobile {
  @apply block w-full text-center rounded-lg bg-zinc-100 border border-zinc-100 px-4 py-2 text-sm
         font-medium text-zinc-900 hover:bg-zinc-200 transition;
}

.mobile-link {
  @apply rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100 transition;
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
