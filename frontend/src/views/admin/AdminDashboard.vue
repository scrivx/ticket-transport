<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const stats = ref({
  viajes_hoy: 0,
  ventas_totales: 0,
  pasajeros: 0,
  proximos_viajes: 0,
})
const recentSales = ref<any[]>([])
const loading = ref(true)

const fetchDashboardData = async () => {
  try {
    const { data } = await api.get('/stats/')
    stats.value = data.stats
    recentSales.value = data.recent_sales
  } catch (e) {
    console.error('Error al cargar dashboard', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboardData)
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-8">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-zinc-100">Panel de Control</h1>
        <p class="text-zinc-500">Resumen global del sistema de transportes.</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-sm font-medium text-emerald-400">Sistema en línea</span>
      </div>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stat-card">
        <span class="stat-label">Ventas Totales</span>
        <div class="flex items-end justify-between">
          <span class="stat-value">S/ {{ stats.ventas_totales }}</span>
          <div class="stat-icon bg-emerald-500/10 text-emerald-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <span class="stat-label">Viajes Hoy</span>
        <div class="flex items-end justify-between">
          <span class="stat-value">{{ stats.viajes_hoy }}</span>
          <div class="stat-icon bg-blue-500/10 text-blue-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <span class="stat-label">Pasajeros</span>
        <div class="flex items-end justify-between">
          <span class="stat-value">{{ stats.pasajeros }}</span>
          <div class="stat-icon bg-zinc-500/10 text-zinc-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <span class="stat-label">Próximos Viajes</span>
        <div class="flex items-end justify-between">
          <span class="stat-value font-bold text-zinc-100">{{ stats.proximos_viajes }}</span>
          <div class="stat-icon bg-zinc-100/10 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Quick Actions -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm">
          <h2 class="text-xl font-bold text-zinc-100 mb-6">Acciones Rápidas</h2>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <RouterLink to="/admin/ventas" class="action-btn">
              <div class="action-icon bg-indigo-500 text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <span>Reservas</span>
            </RouterLink>
            <RouterLink to="/admin/horarios" class="action-btn">
              <div class="action-icon border border-zinc-700 text-zinc-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span>Programar</span>
            </RouterLink>
            <RouterLink to="/admin/conductores" class="action-btn">
              <div class="action-icon border border-zinc-700 text-zinc-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span>Conductores</span>
            </RouterLink>
            <RouterLink to="/admin/vehiculos" class="action-btn">
              <div class="action-icon border border-zinc-700 text-zinc-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              </div>
              <span>Buses</span>
            </RouterLink>
            <RouterLink to="/admin/rutas" class="action-btn">
              <div class="action-icon border border-zinc-700 text-zinc-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.106-1.789L9 2l5 2.5L20 2v8.764a2 2 0 01-1.106 1.789L14 15.5l-5 4.5z"
                  />
                </svg>
              </div>
              <span>Rutas</span>
            </RouterLink>
          </div>
        </div>

        <!-- Recent Sales Table Simplified -->
        <div
          class="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm overflow-hidden"
        >
          <h2 class="text-xl font-bold text-zinc-100 mb-6">Últimos Ingresos</h2>
          <div v-if="recentSales.length > 0" class="flow-root">
            <ul class="-my-5 space-y-4">
              <li
                v-for="sale in recentSales"
                :key="sale.id"
                class="flex items-center justify-between py-4 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/10 px-2 rounded-xl transition"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold"
                  >
                    #{{ sale.id }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-zinc-200">
                      {{ sale.metodo === 'yape' ? 'Yape' : 'Tarjeta' }}
                    </p>
                    <p class="text-xs text-zinc-500">{{ new Date(sale.fecha).toLocaleString() }}</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-zinc-100">+ S/ {{ sale.total }}</span>
              </li>
            </ul>
          </div>
          <p v-else class="text-zinc-600 text-center py-10 italic">No hay ventas registradas.</p>
        </div>
      </div>

      <!-- Right Column: Sidebar info/stats -->
      <div class="space-y-6">
        <div
          class="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-3xl border border-zinc-700 shadow-xl relative overflow-hidden group"
        >
          <div
            class="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition"
          ></div>
          <h3 class="font-bold text-zinc-100 mb-2 relative z-10">Optimización de Rutas</h3>
          <p class="text-sm text-zinc-400 relative z-10">
            Recuerda actualizar la programación semanal para maximizar la ocupación de los
            vehículos.
          </p>
          <button
            class="mt-4 text-xs font-bold text-white underline underline-offset-4 relative z-10"
          >
            Ver consejos
          </button>
        </div>

        <div class="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm">
          <h3 class="font-bold text-zinc-100 mb-4">Estado Flota</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-zinc-400">Total Buses</span>
              <span class="text-xs font-bold bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700"
                >ACTIVO</span
              >
            </div>
            <div class="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div class="bg-zinc-100 h-full w-[85%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  @apply bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm hover:border-zinc-700 transition cursor-default;
}
.stat-label {
  @apply block text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-2;
}
.stat-value {
  @apply text-2xl font-bold text-zinc-100;
}
.stat-icon {
  @apply p-2 rounded-2xl;
}
.action-btn {
  @apply flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-zinc-800/40 transition group;
}
.action-btn span {
  @apply text-[10px] uppercase font-bold text-zinc-500 group-hover:text-zinc-300 tracking-wider;
}
.action-icon {
  @apply h-12 w-12 flex items-center justify-center rounded-2xl transition shadow-lg group-hover:scale-110;
}
</style>
