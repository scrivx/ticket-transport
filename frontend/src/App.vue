<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const open = ref(false)

const logout = () => {
  open.value = false
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">

    <!-- HEADER -->
    <header
      v-if="authStore.isAuthenticated"
      class="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl"
    >
      <div class="mx-auto max-w-7xl px-4">
        <div class="flex h-16 items-center justify-between">

          <!-- BRAND -->
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md"
            >
              WJL
            </div>
            <span class="text-lg font-semibold tracking-tight">
              Transportes CRM
            </span>
          </div>

          <!-- NAV DESKTOP -->
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
            <RouterLink
              to="/"
              class="text-slate-600 hover:text-indigo-600 transition"
              active-class="text-indigo-600 font-semibold"
            >
              Inicio
            </RouterLink>

            <RouterLink
              to="/reservar"
              class="text-slate-600 hover:text-indigo-600 transition"
              active-class="text-indigo-600 font-semibold"
            >
              Reservas
            </RouterLink>

            <RouterLink
              to="/about"
              class="text-slate-600 hover:text-indigo-600 transition"
              active-class="text-indigo-600 font-semibold"
            >
              Acerca
            </RouterLink>
          </nav>

          <!-- ACTIONS -->
          <div class="hidden md:flex items-center gap-3">
            <button
              @click="logout"
              class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
            >
              Cerrar sesión
            </button>
          </div>

          <!-- MOBILE BUTTON -->
          <button
            @click="open = !open"
            class="md:hidden rounded-xl border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>
      </div>

      <!-- MOBILE MENU -->
      <div
        v-show="open"
        class="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl"
      >
        <nav class="flex flex-col gap-4 px-4 py-6 text-sm font-medium">
          <RouterLink
            @click="open = false"
            to="/"
            class="text-slate-600 hover:text-indigo-600 transition"
          >
            Inicio
          </RouterLink>

          <RouterLink
            @click="open = false"
            to="/reservar"
            class="text-slate-600 hover:text-indigo-600 transition"
          >
            Reservas
          </RouterLink>

          <RouterLink
            @click="open = false"
            to="/about"
            class="text-slate-600 hover:text-indigo-600 transition"
          >
            Acerca
          </RouterLink>

          <button
            @click="logout"
            class="mt-2 rounded-xl bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 transition"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>

    <!-- MAIN -->
    <main class="flex-1 mx-auto w-full max-w-7xl px-4 py-8">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-900 text-slate-400">
      <div class="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 class="text-white font-semibold text-lg">Transportes WJL</h3>
          <p class="mt-2 text-sm">
            Transporte interprovincial, pasajeros y encomiendas con gestión moderna.
          </p>
        </div>

        <div class="flex flex-col gap-2 text-sm">
          <a href="/about" class="hover:text-white transition">Acerca</a>
          <a href="/contact" class="hover:text-white transition">Contacto</a>
          <a href="/privacy" class="hover:text-white transition">Privacidad</a>
        </div>

        <div class="flex gap-4 md:justify-end text-sm">
          <a href="#" class="hover:text-white transition">Facebook</a>
          <a href="#" class="hover:text-white transition">WhatsApp</a>
          <a href="#" class="hover:text-white transition">Instagram</a>
        </div>
      </div>

      <div class="border-t border-slate-800 py-4 text-center text-xs">
        © 2024 Transportes WJL — Todos los derechos reservados
      </div>
    </footer>

  </div>
</template>
