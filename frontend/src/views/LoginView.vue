<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div
      class="w-full max-w-md md:max-w-lg lg:max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      <!-- Lado izquierdo con logo y fondo -->
      <div class="hidden lg:flex bg-black items-center justify-center p-0">
        <!-- Logo a pantalla completa en la columna -->
        <img :src="logoWJL" alt="Logo Turismo WJL" class="w-full h-full object-contain" />
      </div>

      <!-- Formulario -->
      <div class="p-8 md:p-12 flex flex-col justify-center">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center text-gray-800">
          Iniciar Sesión
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Usuario -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Usuario</label>
            <input v-model="username" id="username" type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 px-3 py-2"
              required />
          </div>

          <!-- Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input v-model="password" id="password" type="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 px-3 py-2"
              required />
          </div>

          <!-- Error -->
          <div v-if="error" class="text-red-500 text-sm text-center font-medium">
            {{ error }}
          </div>

          <!-- Botón -->
          <button type="submit"
            class="w-full bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 rounded-md shadow-md transition transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400"
            :disabled="loading">
            {{ loading ? 'Cargando...' : 'Ingresar' }}
          </button>

          <!-- Enlace extra -->
          <div class="text-center text-sm text-gray-500 mt-4">
            <a href="#" class="hover:text-blue-600 transition">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import logoWJL from '../assets/logo.png'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(username.value, password.value)
  } catch (e) {
    error.value = 'Credenciales inválidas o error de conexión'
  } finally {
    loading.value = false
  }
}
</script>