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
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
      <h3 class="text-xl font-semibold mb-4">Datos del pasajero</h3>

      <div class="space-y-4">
        <input
          v-model="pasajero.nombres"
          placeholder="Nombres"
          class="w-full rounded-lg border px-3 py-2"
        />
        <input
          v-model="pasajero.apellidos"
          placeholder="Apellidos"
          class="w-full rounded-lg border px-3 py-2"
        />
        <input
          v-model="pasajero.numero_documento"
          placeholder="DNI"
          class="w-full rounded-lg border px-3 py-2"
        />
        <input
          v-model="pasajero.telefono"
          placeholder="Teléfono"
          class="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div class="mt-6 flex gap-3">
        <button class="flex-1 rounded-xl border py-2" @click="$emit('cerrar')">Cancelar</button>

        <button
          class="flex-1 rounded-xl bg-indigo-600 py-2 font-semibold text-white"
          @click="$emit('continuar', pasajero)"
        >
          Continuar
        </button>
      </div>
    </div>
  </div>
</template>
