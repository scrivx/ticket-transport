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
    class="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl mb-12"
  >
    <div class="flex items-center gap-3 mb-8">
      <div class="h-8 w-1 bg-zinc-100 rounded-full"></div>
      <h2 class="text-2xl font-bold text-zinc-100 tracking-tight">Buscar viaje</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
      <!-- RUTA -->
      <div class="md:col-span-4 relative group">
        <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1"
          >Origen - Destino</label
        >
        <select
          v-model="filters.ruta"
          class="w-full appearance-none rounded-2xl bg-zinc-950/50 border border-zinc-800/80 px-4 py-4 text-zinc-200 focus:border-zinc-500 focus:ring-0 transition outline-none cursor-pointer group-hover:bg-zinc-900"
        >
          <option value="" disabled selected>Selecciona tu ruta</option>
          <option v-for="r in rutas" :key="r.id" :value="r.id">
            {{ r.origen_nombre }} → {{ r.destino_nombre }}
          </option>
        </select>
        <div
          class="absolute right-4 bottom-4 pointer-events-none text-zinc-500 group-hover:text-zinc-300 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- FECHA -->
      <div class="md:col-span-4 relative group">
        <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1"
          >Fecha de salida</label
        >
        <input
          type="date"
          v-model="filters.fecha"
          class="w-full rounded-2xl bg-zinc-950/50 border border-zinc-800/80 px-4 py-4 text-zinc-200 focus:border-zinc-500 focus:ring-0 transition outline-none cursor-pointer group-hover:bg-zinc-900 [color-scheme:dark]"
        />
      </div>

      <!-- BOTÓN -->
      <div class="md:col-span-4 flex">
        <button
          @click="$emit('buscar')"
          class="w-full relative overflow-hidden group rounded-2xl bg-zinc-100 px-6 py-4 font-bold text-zinc-900 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div class="absolute inset-0 w-full h-full bg-zinc-200"></div>
          <div class="relative flex items-center justify-center gap-3">
            <span class="tracking-wide font-bold">Buscar</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
