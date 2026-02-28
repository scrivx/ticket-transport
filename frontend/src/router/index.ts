import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/reservar',
        name: 'reservar',
        component: () => import('../views/Reservar.vue'),
    },
    {
        path: '/admin/rutas',
        component: () => import('../views/admin/AdminRutas.vue'),
        meta: { requiresAdmin: true }
    },
    {
        path: '/admin/vehiculos',
        component: () => import('../views/admin/AdminVehiculos.vue'),
        meta: { requiresAdmin: true }
    },
    {
        path: '/admin/horarios',
        component: () => import('../views/admin/AdminHorarios.vue'),
        meta: { requiresAdmin: true }
    },
    {
        path: '/admin/pasajeros',
        component: () => import('../views/admin/AdminPasajeros.vue'),
        meta: { requiresAdmin: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
        next('/')
    } else {
        next()
    }
})

export default router
