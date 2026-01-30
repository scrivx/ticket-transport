<script setup lang="ts">
defineProps<{
  filters: {
    fecha: string
  }
}>()

defineEmits(['buscar'])
</script>

<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8"
  >
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Buscar viaje
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <!-- FECHA -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Fecha de viaje
        </label>
        <input
          type="date"
          v-model="filters.fecha"
          class="w-full rounded-lg border border-gray-300 px-3 py-2
                 text-gray-700 focus:border-indigo-500 focus:ring-2
                 focus:ring-indigo-200 transition"
        />
      </div>

      <!-- BOTÓN -->
      <div class="md:col-span-2 flex">
        <button
          @click="$emit('buscar')"
          class="w-full md:w-auto inline-flex items-center justify-center
                 gap-2 rounded-xl bg-indigo-600 px-6 py-3
                 font-semibold text-white shadow-sm
                 hover:bg-indigo-700 transition"
        >
          Buscar viajes
        </button>
      </div>
    </div>
  </div>
</template>
