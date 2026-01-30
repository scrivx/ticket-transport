<script setup lang="ts">
defineProps<{
  viajes: any[]
  selectedViaje: any
}>()

defineEmits(['select'])
</script>

<template>
  <div v-if="viajes.length" class="mb-8">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">Selecciona tu viaje</h2>

    <div class="space-y-4">
      <div
        v-for="viaje in viajes"
        :key="viaje.id"
        @click="$emit('select', viaje)"
        class="group relative cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
        :class="{
          'border-indigo-600 ring-2 ring-indigo-500': selectedViaje?.id === viaje.id,
          'border-gray-200': selectedViaje?.id !== viaje.id,
        }"
      >
        <!-- RUTA -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-lg font-bold text-gray-900">
              {{ viaje.ruta_info.origen_nombre }}
              <span class="mx-2 text-gray-400">→</span>
              {{ viaje.ruta_info.destino_nombre }}
            </p>
            <p class="text-sm text-gray-500">{{ viaje.fecha_viaje }} · {{ viaje.horario_hora }}</p>
          </div>

          <!-- PRECIO -->
          <div class="text-right">
            <p class="text-xs text-gray-500">Desde</p>
            <p class="text-2xl font-extrabold text-indigo-600">S/ {{ viaje.precio_base }}</p>
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="my-4 h-px bg-gray-100"></div>

        <!-- INFO EXTRA -->
        <div class="flex items-center justify-between text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <img src="@/assets/icons/bus.svg" alt="Vehículo" />
            <span>Vehículo: {{ viaje.vehiculo_placa }}</span>
            <!-- TODO: Mostrar nombre y apellidos del conductor -->
            <img src="@/assets/icons/driver.svg" alt=" Conductor" />
            <span>Condutor: {{ viaje.conductor.nombres }}</span>
          </div>

          <span
            v-if="selectedViaje?.id === viaje.id"
            class="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white"
          >
            Seleccionado
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
