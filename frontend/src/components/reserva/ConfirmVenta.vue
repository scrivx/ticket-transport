<script setup lang="ts">
defineProps<{
  viaje: any
  asiento: any
}>()

defineEmits(['continuar'])
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 border border-dashed border-gray-300">
    <!-- HEADER -->
    <div class="text-center mb-4">
      <h2 class="text-lg font-bold tracking-wide">🎟️ TICKET DE RESERVA</h2>
      <p class="text-xs text-gray-500">Turismo WJL</p>
    </div>

    <hr class="border-dashed mb-4" />

    <!-- INFO -->
    <div class="space-y-2 text-sm text-gray-700">
      <div class="flex justify-between">
        <span>Origen</span>
        <span class="font-medium">
          {{ viaje.ruta_info.origen_nombre }}
        </span>
      </div>

      <div class="flex justify-between">
        <span>Destino</span>
        <span class="font-medium">
          {{ viaje.ruta_info.destino_nombre }}
        </span>
      </div>

      <div class="flex justify-between">
        <span>Asiento</span>
        <span class="font-medium"> #{{ asiento.numero_asiento }} </span>
      </div>

      <div class="flex justify-between">
        <span>Hora</span>
        <span class="font-medium">
          {{ viaje.horario_hora }}
        </span>
      </div>
    </div>

    <hr class="border-dashed my-4" />

    <!-- TOTAL -->
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Total</span>
      <span class="text-2xl font-bold text-indigo-600"> S/ {{ viaje.precio_base }} </span>
    </div>

    <!-- CTA -->
    <button
      class="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 transition"
      @click="$emit('continuar')"
    >
      Continuar con el pago →
    </button>

    <!-- FOOTER -->
    <p class="mt-4 text-xs text-center text-gray-400">Presenta este ticket al abordar</p>
  </div>
</template>
