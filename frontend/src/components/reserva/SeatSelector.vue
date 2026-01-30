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
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Seleccionar asiento
    </h2>

    <div v-if="loading" class="text-center py-6 text-gray-500">
      Cargando asientos...
    </div>

    <div
      v-else
      class="relative mx-auto max-w-md rounded-3xl border
             bg-slate-50 p-6 shadow-inner"
    >
      <!-- Conductor -->
      <div class="mb-6 flex justify-end text-xs text-gray-500">
        🧑‍✈️ Conductor
      </div>

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
      <div class="mt-6 flex justify-center gap-6 text-xs text-gray-600">
        <div class="flex items-center gap-2">
          <span class="h-4 w-4 rounded bg-emerald-200 border border-emerald-400"></span>
          Disponible
        </div>
        <div class="flex items-center gap-2">
          <span class="h-4 w-4 rounded bg-indigo-600"></span>
          Seleccionado
        </div>
        <div class="flex items-center gap-2">
          <span class="h-4 w-4 rounded bg-slate-300"></span>
          Ocupado
        </div>
      </div>
    </div>
  </div>
</template>
