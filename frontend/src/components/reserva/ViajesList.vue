<script setup lang="ts">
defineProps<{
  viajes: any[]
  selectedViaje: any
}>()

defineEmits(['select'])
</script>

<template>
  <div v-if="viajes.length" class="mb-8">
    <h2 class="text-xl font-semibold mb-4 text-zinc-100">Selecciona tu viaje</h2>

    <div class="space-y-4">
      <div
        v-for="viaje in viajes"
        :key="viaje.id"
        @click="$emit('select', viaje)"
        class="group relative cursor-pointer rounded-xl border bg-zinc-900/40 p-5 shadow-sm transition hover:shadow-md backdrop-blur-sm"
        :class="{
          'border-indigo-600 ring-2 ring-zinc-500/50 bg-zinc-800/60':
            selectedViaje?.id === viaje.id,
          'border-zinc-800/60': selectedViaje?.id !== viaje.id,
        }"
      >
        <!-- RUTA -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-lg font-bold text-zinc-100">
              {{ viaje.ruta_info.origen_nombre }}
              <span class="mx-2 text-zinc-400">→</span>
              {{ viaje.ruta_info.destino_nombre }}
            </p>
            <p class="text-sm text-zinc-400">{{ viaje.fecha_viaje }} · {{ viaje.horario_hora }}</p>
          </div>

          <!-- PRECIO -->
          <div class="text-right">
            <p class="text-xs text-zinc-500">Desde</p>
            <p class="text-2xl font-extrabold text-zinc-200">S/ {{ viaje.precio_base }}</p>
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="my-4 h-px bg-zinc-800/60"></div>

        <!-- INFO EXTRA -->
        <div class="flex items-center justify-between text-sm text-zinc-400">
          <div class="flex items-center gap-2">
            <img src="@/assets/icons/bus.svg" alt="Vehículo" />
            <p class="text-white/85">
              Placa: <span class="text-zinc-400">{{ viaje.vehiculo_placa }}</span>
            </p>
            <!-- TODO: Mostrar nombre y apellidos del conductor -->
            <p></p>
            <img src="@/assets/icons/driver.svg" alt="Conductor" />
            <p class="text-white/85">
              Conductor: <span class="text-zinc-400">{{ viaje.conductor_info.nombres }} {{ viaje.conductor_info.apellidos }}</span>
            </p>
          </div>

          <span
            v-if="selectedViaje?.id === viaje.id"
            class="rounded-full bg-indigo-700 border border-zinc-600 px-3 py-1 text-xs font-semibold text-indigo-100"
          >
            Seleccionado
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
