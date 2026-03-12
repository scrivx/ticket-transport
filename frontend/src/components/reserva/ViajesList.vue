<script setup lang="ts">
defineProps<{
  viajes: any[]
  selectedViaje: any
}>()

defineEmits(['select'])
</script>

<template>
  <div v-if="viajes.length" class="mb-12">
    <div class="flex items-center gap-3 mb-6">
      <div class="h-8 w-1 bg-zinc-500 rounded-full"></div>
      <h2 class="text-2xl font-bold text-zinc-100 tracking-tight">Opciones de salida</h2>
    </div>

    <div class="space-y-4">
      <div
        v-for="viaje in viajes"
        :key="viaje.id"
        @click="$emit('select', viaje)"
        class="group relative cursor-pointer overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-zinc-600/50 hover:-translate-y-1 backdrop-blur-md"
        :class="{
          'border-zinc-300/50 ring-1 ring-zinc-300 shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] bg-zinc-800/80':
            selectedViaje?.id === viaje.id,
        }"
      >
        <!-- RUTA & TIEMPO -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-6">
            <div class="flex flex-col">
              <span class="text-3xl font-black text-zinc-100 tracking-tighter">{{ viaje.horario_hora }}</span>
              <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Salida</span>
            </div>
            
            <div class="flex items-center gap-4 text-zinc-400 font-medium">
              <span class="text-lg">{{ viaje.ruta_info.origen_nombre }}</span>
              <div class="flex items-center gap-1 text-zinc-600">
                <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                <div class="w-8 h-[1px] bg-current"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
              </div>
              <span class="text-lg">{{ viaje.ruta_info.destino_nombre }}</span>
            </div>
          </div>

          <!-- PRECIO -->
          <div class="text-left md:text-right">
            <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Precio x Pasaje</p>
            <p class="text-3xl font-black text-zinc-100 flex items-start justify-start md:justify-end gap-1">
              <span class="text-sm font-medium text-zinc-500 mt-1">S/</span>
              {{ viaje.precio_base }}
            </p>
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="my-5 h-px bg-gradient-to-r from-zinc-800/0 via-zinc-800 to-zinc-800/0"></div>

        <!-- INFO EXTRA -->
        <div class="flex items-center justify-between text-xs font-medium text-zinc-500">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>{{ formatDate(viaje.fecha_viaje) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <span>Bus: <span class="text-zinc-300">{{ viaje.vehiculo_placa }}</span></span>
            </div>
            <div class="hidden sm:flex items-center gap-2">
              <svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>Conductor: <span class="text-zinc-300">{{ viaje.conductor_info.nombres }}</span></span>
            </div>
          </div>

          <div
            class="transition-all duration-300 opacity-0 transform translate-x-4"
            :class="{'opacity-100 translate-x-0': selectedViaje?.id === viaje.id}"
          >
            <span class="flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-1 font-bold text-zinc-700 shadow-sm">
              Seleccionado
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    formatDate(dateStr?: string) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
      return new Date(parseInt(parts[0] || '0'), parseInt(parts[1] || '1') - 1, parseInt(parts[2] || '1')).toLocaleDateString('es-ES', opts);
    }
  }
}
</script>
