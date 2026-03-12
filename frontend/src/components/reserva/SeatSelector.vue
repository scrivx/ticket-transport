<script setup lang="ts">
import SeatItem from './SeatItem.vue'

defineProps<{
  asientos: any[]
  loading: boolean
  selectedAsiento: any
}>()

defineEmits(['select'])
</script>

<template>
  <div class="mb-12">
    <div class="flex items-center gap-3 mb-6">
      <div class="h-8 w-1 bg-zinc-500 rounded-full"></div>
      <h2 class="text-2xl font-bold text-zinc-100 tracking-tight">Seleccionar asiento</h2>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-400 mb-4"></div>
      <p class="text-zinc-500 font-medium">Cargando distribución del bus...</p>
    </div>

    <div
      v-else
      class="relative mx-auto w-full max-w-[320px] rounded-[3rem] border-8 border-zinc-800/80 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl"
    >
      <!-- Detalles visuales del bus (parabrisas delantero) -->
      <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-zinc-800/50 rounded-t-full blur-[2px]"></div>

      <!-- Conductor -->
      <div class="mb-10 flex justify-end text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-4">
        <div class="flex flex-col items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700">
            <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
          </div>
          <span>Timón</span>
        </div>
      </div>

      <!-- Bus layout -->
      <div class="grid grid-cols-5 gap-y-6 gap-x-2">
        <template v-for="(asiento, index) in asientos" :key="asiento.id">
          <!-- Izquierda -->
          <SeatItem
            v-if="index % 4 < 2"
            :asiento="asiento"
            :selected="selectedAsiento?.id === asiento.id"
            @select="$emit('select', asiento)"
          />

          <!-- Pasillo -->
          <div v-if="index % 4 === 2" class="flex justify-center flex-col items-center relative">
             <div class="w-px h-full bg-zinc-800/30"></div>
          </div>

          <!-- Derecha -->
          <SeatItem
            v-if="index % 4 === 3"
            :asiento="asiento"
            :selected="selectedAsiento?.id === asiento.id"
            @select="$emit('select', asiento)"
          />
        </template>
      </div>

      <!-- Detalles visuales del bus (parabrisas trasero) -->
      <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-zinc-800/50 rounded-b-full blur-[2px]"></div>
    </div>

    <!-- Leyenda -->
    <div v-if="!loading" class="mt-10 mx-auto max-w-lg flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-zinc-500 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50">
      <div class="flex items-center gap-3">
        <span class="h-6 w-6 rounded-lg bg-zinc-500 border-b-2 border-zinc-700 shadow-sm flex items-center justify-center"></span>
        <span>Libre</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="h-6 w-6 rounded-lg bg-emerald-400 shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)] flex items-center justify-center"></span>
        <span class="text-zinc-300">Tu Asiento</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="h-6 w-6 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center opacity-60">
           <svg class="w-3 h-3 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </span>
        <span>Ocupado</span>
      </div>
    </div>
  </div>
</template>
