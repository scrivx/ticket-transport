<script setup lang="ts">
defineProps<{
  filters: {
    fecha: string
    ruta: string
  }
}>()

defineEmits(['buscar'])

import { ref, onMounted } from 'vue'
import api from '@/services/api'

const rutas = ref<any[]>([])

onMounted(async () => {
  try {
    const { data } = await api.get('/rutas/')
    rutas.value = data
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div
    class="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-6 shadow-md backdrop-blur-md mb-8"
  >
    <h2 class="text-xl font-semibold text-zinc-100 mb-4">Buscar viaje</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <!-- RUTA -->
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1"> Ruta </label>
        <select
          v-model="filters.ruta"
          class="w-full rounded-lg bg-zinc-950/50 border border-zinc-800 px-3 py-2 text-zinc-200 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600 transition"
        >
          <option value="">Todas las rutas</option>
          <option v-for="r in rutas" :key="r.id" :value="r.id">
            {{ r.origen_nombre }} - {{ r.destino_nombre }}
          </option>
        </select>
      </div>

      <!-- FECHA -->
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1"> Fecha de viaje </label>
        <input
          type="date"
          v-model="filters.fecha"
          class="w-full rounded-lg bg-zinc-950/50 border border-zinc-800 px-3 py-2 text-zinc-200 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-600 transition"
        />
      </div>

      <!-- BOTÓN -->
      <div class="md:col-span-2 flex">
        <button
          @click="$emit('buscar')"
          class="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 font-semibold text-zinc-900 shadow-sm hover:bg-zinc-300 transition"
        >
          Buscar viajes
        </button>
      </div>
    </div>
  </div>
</template>
