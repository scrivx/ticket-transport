<script setup lang="ts">
import { reactive } from 'vue'

defineEmits(['cerrar', 'continuar'])

const pasajero = reactive({
  nombres: '',
  apellidos: '',
  tipo_documento: 'DNI',
  numero_documento: '',
  telefono: '',
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div class="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
      <h3 class="text-xl font-semibold mb-4 text-zinc-100">Datos del pasajero</h3>

      <div class="space-y-4">
        <input
          v-model="pasajero.nombres"
          placeholder="Nombres"
          class="w-full rounded-lg bg-zinc-950/50 border border-zinc-800 px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition"
        />
        <input
          v-model="pasajero.apellidos"
          placeholder="Apellidos"
          class="w-full rounded-lg bg-zinc-950/50 border border-zinc-800 px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition"
        />
        <input
          v-model="pasajero.numero_documento"
          placeholder="DNI"
          class="w-full rounded-lg bg-zinc-950/50 border border-zinc-800 px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition"
        />
        <input
          v-model="pasajero.telefono"
          placeholder="Teléfono"
          class="w-full rounded-lg bg-zinc-950/50 border border-zinc-800 px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition"
        />
      </div>

      <div class="mt-6 flex gap-3">
        <button
          class="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 py-2 transition"
          @click="$emit('cerrar')"
        >
          Cancelar
        </button>

        <button
          class="flex-1 rounded-xl bg-zinc-100 py-2 font-semibold text-zinc-900 hover:bg-zinc-300 transition"
          @click="$emit('continuar', pasajero)"
        >
          Continuar
        </button>
      </div>
    </div>
  </div>
</template>
