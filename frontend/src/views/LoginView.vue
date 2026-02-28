<template>
  <div class="min-h-screen flex items-center justify-center">
    <!-- Card -->
    <div
      class="w-full max-w-md bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-xl rounded-2xl shadow-xl p-8"
    >
      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <h1 class="text-2xl font-bold text-zinc-100">Empresa de Turismo</h1>
        <p class="text-sm text-zinc-500">Sistema de reservas</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Usuario -->
        <div>
          <label class="text-sm font-medium text-zinc-300"> Usuario </label>
          <input
            v-model="username"
            type="text"
            placeholder="Ingresa tu usuario"
            :disabled="loading || blocked"
            class="mt-1 w-full rounded-lg bg-zinc-950/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:ring-zinc-600 disabled:bg-zinc-900 disabled:text-zinc-500"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="text-sm font-medium text-zinc-300"> Contraseña </label>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :disabled="loading || blocked"
              class="mt-1 w-full rounded-lg bg-zinc-950/50 border border-zinc-800 px-4 py-3 pr-12 text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:ring-zinc-600 disabled:bg-zinc-900 disabled:text-zinc-500"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-4 text-zinc-500 hover:text-zinc-300"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="bg-red-950/30 border border-red-900/50 text-red-400 text-sm p-3 rounded-lg text-center"
        >
          {{ error }}
        </div>

        <!-- Block -->
        <div
          v-if="blocked"
          class="bg-yellow-950/30 border border-yellow-900/50 text-yellow-500 text-sm p-3 rounded-lg text-center"
        >
          Demasiados intentos. Intenta en {{ timeLeft }}s
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-zinc-100 hover:bg-zinc-300 text-zinc-900 font-semibold py-3 rounded-lg transition disabled:opacity-50"
          :disabled="loading || blocked"
        >
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <!-- Link -->
        <div class="text-center text-sm text-zinc-500">
          <a href="#" class="hover:text-zinc-300 transition"> ¿Olvidaste tu contraseña? </a>
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
