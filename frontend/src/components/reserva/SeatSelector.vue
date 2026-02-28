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
  <div class="mb-8">
    <h2 class="text-xl font-semibold text-zinc-100 mb-4">Seleccionar asiento</h2>

    <div v-if="loading" class="text-center py-6 text-zinc-500">Cargando asientos...</div>

    <div
      v-else
      class="relative mx-auto max-w-md rounded-3xl border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-inner backdrop-blur-sm"
    >
      <!-- Conductor -->
      <div class="mb-6 flex justify-end text-xs text-zinc-400">🧑‍✈️ Conductor</div>

      <!-- Bus layout -->
      <div class="grid grid-cols-5 gap-y-4 gap-x-3">
        <template v-for="(asiento, index) in asientos" :key="asiento.id">
          <!-- Izquierda -->
          <SeatItem
            v-if="index % 4 < 2"
            :asiento="asiento"
            :selected="selectedAsiento?.id === asiento.id"
            @select="$emit('select', asiento)"
          />

          <!-- Pasillo -->
          <div v-if="index % 4 === 2" />

          <!-- Derecha -->
          <SeatItem
            v-if="index % 4 === 3"
            :asiento="asiento"
            :selected="selectedAsiento?.id === asiento.id"
            @select="$emit('select', asiento)"
          />
        </template>
      </div>

      <!-- Leyenda -->
      <div class="mt-6 flex justify-center gap-6 text-xs text-zinc-400">
        <div class="flex items-center gap-2">
          <span class="h-4 w-4 rounded bg-zinc-800 border border-zinc-600"></span>
          Disponible
        </div>
        <div class="flex items-center gap-2">
          <span class="h-4 w-4 rounded bg-zinc-200"></span>
          Seleccionado
        </div>
        <div class="flex items-center gap-2">
          <span class="h-4 w-4 rounded bg-zinc-950 border border-zinc-800"></span>
          Ocupado
        </div>
      </div>
    </div>
  </div>
</template>
