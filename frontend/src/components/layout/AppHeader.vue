<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const open = ref(false)
const adminOpen = ref(false)
const adminDropdown = ref(false)

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
          <img
            src="@/assets/icons/bus.svg"
            alt="Turismo WJL"
            class="h-7 w-7 rounded-lg shadow-sm"
          />
          <span class="block">
            <span class="inline text-blue-400">Ticket</span>
            <span class="inline text-red-400">Way</span>
          </span>
        </RouterLink>

        <!-- NAV DESKTOP -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
          <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          <RouterLink to="/reservar" class="nav-link">Reservas</RouterLink>

          <!-- Dropdown Admin Desktop -->
          <div
            v-if="authStore.isAdmin"
            class="relative"
            @mouseenter="adminDropdown = true"
            @mouseleave="adminDropdown = false"
          >
            <button class="nav-link flex items-center gap-1">
              Administración
              <svg
                class="w-3.5 h-3.5 transition-transform duration-200"
                :class="{ 'rotate-180': adminDropdown }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <transition name="fade-slide">
              <div
                v-show="adminDropdown"
                class="absolute top-full left-0 mt-2 w-44 rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-xl py-1 flex flex-col"
              >
                <RouterLink to="/admin/ventas" class="dropdown-link">Reservas</RouterLink>
                <RouterLink to="/admin/rutas" class="dropdown-link">Rutas</RouterLink>
                <RouterLink to="/admin/vehiculos" class="dropdown-link">Vehículos</RouterLink>
                <RouterLink to="/admin/conductores" class="dropdown-link">Conductores</RouterLink>
                <RouterLink to="/admin/horarios" class="dropdown-link">Programación</RouterLink>
                <RouterLink to="/admin/pasajeros" class="dropdown-link">Pasajeros</RouterLink>
              </div>
            </transition>
          </div>

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

        <!-- MOBILE TOGGLE -->
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
        <nav class="flex flex-col gap-1 px-6 py-6 text-sm font-medium">
          <RouterLink @click="open = false" to="/" class="mobile-link">Inicio</RouterLink>
          <RouterLink @click="open = false" to="/reservar" class="mobile-link">Reservas</RouterLink>

          <!-- Acordeón Admin Mobile -->
          <div v-if="authStore.isAdmin">
            <button
              @click="adminOpen = !adminOpen"
              class="mobile-link flex items-center justify-between w-full"
            >
              <span>Administración</span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': adminOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <transition name="accordion">
              <div
                v-show="adminOpen"
                class="pl-3 mt-1 flex flex-col gap-1 border-l border-zinc-700 ml-3"
              >
                <RouterLink @click="open = false" to="/admin/ventas" class="mobile-link text-sm"
                  >Reservas</RouterLink
                >
                <RouterLink @click="open = false" to="/admin/rutas" class="mobile-link text-sm"
                  >Rutas</RouterLink
                >
                <RouterLink @click="open = false" to="/admin/vehiculos" class="mobile-link text-sm"
                  >Vehículos</RouterLink
                >
                <RouterLink
                  @click="open = false"
                  to="/admin/conductores"
                  class="mobile-link text-sm"
                  >Conductores</RouterLink
                >
                <RouterLink @click="open = false" to="/admin/horarios" class="mobile-link text-sm"
                  >Programación</RouterLink
                >
                <RouterLink @click="open = false" to="/admin/pasajeros" class="mobile-link text-sm"
                  >Pasajeros</RouterLink
                >
              </div>
            </transition>
          </div>

          <RouterLink @click="open = false" to="/about" class="mobile-link">Acerca</RouterLink>

          <div class="border-t border-zinc-800/60 pt-3 mt-2">
            <button v-if="authStore.isAuthenticated" @click="logout" class="btn-secondary w-full">
              Cerrar sesión
            </button>
            <RouterLink v-else @click="open = false" to="/login" class="btn-primary-mobile">
              Iniciar sesión
            </RouterLink>
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

.dropdown-link {
  @apply px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100 transition;
}

.dropdown-link.router-link-active {
  @apply text-zinc-100 font-semibold bg-zinc-800/40;
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

/* Menu mobile */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Acordeón */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
