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
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <!-- Modal Container -->
    <div class="relative w-full max-w-lg rounded-[2.5rem] bg-zinc-900 border border-zinc-800 p-8 shadow-2xl overflow-hidden">
      <!-- Decorativos luminosos -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-50"></div>
      
      <div class="mb-8">
        <h3 class="text-2xl font-bold text-zinc-100 tracking-tight">Datos del pasajero</h3>
        <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2 mt-1">Información para el boleto de viaje</p>
      </div>

      <div class="space-y-5">
        <div class="grid grid-cols-2 gap-5">
          <div class="relative group">
            <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Nombres</label>
            <input
              v-model="pasajero.nombres"
              placeholder="Juan Luis"
              class="w-full rounded-2xl bg-zinc-950/50 border border-zinc-800/80 px-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 focus:ring-0 transition outline-none group-hover:bg-zinc-900"
            />
          </div>
          <div class="relative group">
            <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Apellidos</label>
            <input
              v-model="pasajero.apellidos"
              placeholder="Pérez Sánchez"
              class="w-full rounded-2xl bg-zinc-950/50 border border-zinc-800/80 px-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 focus:ring-0 transition outline-none group-hover:bg-zinc-900"
            />
          </div>
        </div>

        <div class="grid grid-cols-5 gap-5">
          <div class="relative group col-span-2">
             <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Documento</label>
             <select
                v-model="pasajero.tipo_documento"
                class="w-full appearance-none rounded-2xl bg-zinc-950/50 border border-zinc-800/80 px-4 py-3.5 text-zinc-200 focus:border-zinc-500 focus:ring-0 transition outline-none cursor-pointer group-hover:bg-zinc-900"
              >
                <option value="DNI">DNI</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="CE">C.E.</option>
              </select>
              <div class="absolute right-3.5 bottom-3.5 pointer-events-none text-zinc-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
          </div>
          
          <div class="relative group col-span-3">
            <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Número</label>
            <input
              v-model="pasajero.numero_documento"
              placeholder="70014023"
              class="w-full rounded-2xl bg-zinc-950/50 border border-zinc-800/80 px-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 focus:ring-0 transition outline-none group-hover:bg-zinc-900"
            />
          </div>
        </div>

        <div class="relative group">
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Teléfono</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="text-zinc-500 font-bold">+51</span>
            </div>
            <input
              v-model="pasajero.telefono"
              placeholder="987 654 321"
              class="w-full rounded-2xl bg-zinc-950/50 border border-zinc-800/80 pl-14 pr-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 focus:ring-0 transition outline-none group-hover:bg-zinc-900"
            />
          </div>
        </div>
      </div>

      <div class="mt-10 flex gap-4">
        <button
          class="flex-[0.4] rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          @click="$emit('cerrar')"
        >
          Cancelar
        </button>

        <button
          class="flex-1 rounded-2xl bg-zinc-100 px-6 py-4 font-bold tracking-wide text-zinc-900 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          @click="$emit('continuar', pasajero)"
        >
          Guardar y continuar
        </button>
      </div>
    </div>
  </div>
</template>
