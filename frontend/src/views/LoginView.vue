<template>
  <div
    class="min-h-screen flex items-center justify-center"
  >
    <!-- Card -->
    <div
      class="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8"
    >
      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <img
          :src="logoWJL"
          alt="Turismo WJL"
          class="w-24 h-24 object-contain mb-4"
        />
        <h1 class="text-2xl font-bold text-gray-800">
          Turismo WJL
        </h1>
        <p class="text-sm text-gray-500">
          Sistema de reservas
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Usuario -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            v-model="username"
            type="text"
            placeholder="Ingresa tu usuario"
            :disabled="loading || blocked"
            class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3
                   focus:border-blue-600 focus:ring-blue-600
                   disabled:bg-gray-100"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Contraseña
          </label>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :disabled="loading || blocked"
              class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 pr-12
                     focus:border-blue-600 focus:ring-blue-600
                     disabled:bg-gray-100"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-4 text-gray-400 hover:text-gray-600"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center"
        >
          {{ error }}
        </div>

        <!-- Block -->
        <div
          v-if="blocked"
          class="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm p-3 rounded-lg text-center"
        >
          Demasiados intentos. Intenta en {{ timeLeft }}s
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg
                 transition disabled:opacity-50"
          :disabled="loading || blocked"
        >
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <!-- Link -->
        <div class="text-center text-sm text-gray-500">
          <a href="#" class="hover:text-blue-600 transition">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import logoWJL from '@/assets/logo.png'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const showPassword = ref(false)

// 🔐 Control de intentos
const attempts = ref(0)
const blocked = ref(false)
const timeLeft = ref(0)
let timer: any = null

const MAX_ATTEMPTS = 3
const BLOCK_TIME = 30 // segundos

const startBlock = () => {
  blocked.value = true
  timeLeft.value = BLOCK_TIME

  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      blocked.value = false
      attempts.value = 0
      clearInterval(timer)
    }
  }, 1000)
}

const handleLogin = async () => {
  if (blocked.value) return

  loading.value = true
  error.value = ''

  try {
    await authStore.login(username.value, password.value)
  } catch (e) {
    attempts.value++

    if (attempts.value >= MAX_ATTEMPTS) {
      startBlock()
      error.value = 'Has excedido el número de intentos'
    } else {
      error.value = 'Usuario o contraseña incorrectos'
    }
  } finally {
    loading.value = false
  }
}
</script>
