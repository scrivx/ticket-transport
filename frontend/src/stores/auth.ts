import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access_token') || '')
  const refreshToken = ref(localStorage.getItem('refresh_token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user_info') || 'null'))

  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.is_staff || user.value?.is_superuser)

  async function login(username: string, password: string) {
    try {
      const response = await api.post('/token/', { username, password })

      accessToken.value = response.data.access
      refreshToken.value = response.data.refresh

      user.value = {
        username: response.data.username,
        is_staff: response.data.is_staff,
        is_superuser: response.data.is_superuser,
      }

      localStorage.setItem('access_token', accessToken.value)
      localStorage.setItem('refresh_token', refreshToken.value)
      localStorage.setItem('user_info', JSON.stringify(user.value))

      router.push('/')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  function logout() {
    accessToken.value = ''
    refreshToken.value = ''
    user.value = null

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')

    router.push('/login')
  }

  return { accessToken, user, isAuthenticated, isAdmin, login, logout }
})
