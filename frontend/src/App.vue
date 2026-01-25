<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header v-if="authStore.isAuthenticated" class="bg-indigo-600 text-white shadow-md">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold tracking-tight">Transportes CRM</h1>
        <nav class="space-x-4">
          <RouterLink to="/" class="hover:text-indigo-200 transition">Inicio</RouterLink>
          <RouterLink to="/reservar" class="hover:text-indigo-200 transition">Reservar</RouterLink>
          <RouterLink to="/about" class="hover:text-indigo-200 transition">Acerca de</RouterLink>
          <button
            @click="authStore.logout()"
            class="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded transition"
          >
            Salir
          </button>
        </nav>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <footer class="bg-gray-800 text-gray-400 text-center py-4 text-sm mt-auto">
      &copy; 2024 Transportes CRM. Todos los derechos reservados.
    </footer>
  </div>
</template>

<style scoped></style>
