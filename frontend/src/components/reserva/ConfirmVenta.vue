<script setup lang="ts">
defineProps<{
  viaje: any
  asiento: any
}>()

defineEmits(['continuar'])
</script>

<template>
  <div
    class="bg-zinc-900/60 rounded-2xl shadow-xl p-6 border border-dashed border-zinc-700 backdrop-blur-md"
  >
    <!-- HEADER -->
    <div class="text-center mb-4 text-zinc-100">
      <h2 class="text-lg font-bold tracking-wide">TICKET DE RESERVA</h2>
      <p class="text-xs text-zinc-500">Empresa de Turismo</p>
    </div>

    <hr class="border-dashed border-zinc-700 mb-4" />

    <!-- INFO -->
    <div class="space-y-2 text-sm text-zinc-300">
      <div class="flex justify-between">
        <span>Origen</span>
        <span class="font-medium text-zinc-100">
          {{ viaje.ruta_info.origen_nombre }}
        </span>
      </div>

      <div class="flex justify-between">
        <span>Destino</span>
        <span class="font-medium text-zinc-100">
          {{ viaje.ruta_info.destino_nombre }}
        </span>
      </div>

      <div class="flex justify-between">
        <span>Asiento</span>
        <span class="font-medium text-zinc-100"> #{{ asiento.numero_asiento }} </span>
      </div>

      <div class="flex justify-between">
        <span>Hora</span>
        <span class="font-medium text-zinc-100">
          {{ viaje.horario_hora }}
        </span>
      </div>
    </div>

    <hr class="border-dashed border-zinc-700 my-4" />

    <!-- TOTAL -->
    <div class="flex justify-between items-center text-zinc-200">
      <span class="text-sm text-zinc-400">Total</span>
      <span class="text-2xl font-bold text-blue-500"> S/ {{ viaje.precio_base }} </span>
    </div>

    <!-- CTA -->
    <button
      class="mt-6 w-full rounded-xl bg-zinc-100 py-3 text-zinc-900 font-semibold hover:bg-zinc-300 transition"
      @click="$emit('continuar')"
    >
      Continuar con el pago →
    </button>

    <!-- FOOTER -->
    <p class="mt-4 text-xs text-center text-zinc-500">Presenta este ticket al abordar</p>
  </div>
</template>
