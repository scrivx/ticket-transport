<script setup lang="ts">
defineProps<{
  viaje: any
  asiento: any
}>()

defineEmits(['continuar'])
</script>

<template>
  <div class="relative bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-800 backdrop-blur-md overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-zinc-800/20 before:to-transparent before:pointer-events-none">
    
    <!-- Cutouts -->
    <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-950 rounded-full border-r border-zinc-800"></div>
    <div class="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-950 rounded-full border-l border-zinc-800"></div>

    <!-- UPPER HALF -->
    <div class="p-8 pb-10 border-b-2 border-dashed border-zinc-800 relative">
      <div class="flex justify-between items-start mb-8">
        <div>
          <span class="bg-zinc-100 text-zinc-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Pase de abordar</span>
          <p class="text-zinc-500 text-xs mt-3 uppercase tracking-widest font-bold">Turismo WJL</p>
        </div>
        <div class="text-right">
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Fecha</p>
          <p class="text-zinc-200 font-medium">{{ formatDate(viaje.fecha_viaje) }}</p>
        </div>
      </div>

      <div class="flex items-center justify-between mb-8">
        <div class="flex-1">
          <p class="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Origen</p>
          <p class="text-2xl font-black text-zinc-100 tracking-tight">{{ viaje.ruta_info.origen_nombre }}</p>
        </div>
        
        <!-- Arrow separator -->
        <div class="flex-1 flex justify-center text-zinc-600">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </div>
        
        <div class="flex-1 text-right">
          <p class="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Destino</p>
          <p class="text-2xl font-black text-zinc-100 tracking-tight">{{ viaje.ruta_info.destino_nombre }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/80">
        <div>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Hora Salida</p>
          <p class="text-xl font-bold text-zinc-200">{{ viaje.horario_hora }}</p>
        </div>
        <div>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Asiento</p>
          <p class="text-xl font-bold text-emerald-400">#{{ asiento.numero_asiento }}</p>
        </div>
      </div>
    </div>

    <!-- BOTTOM HALF -->
    <div class="p-8 pt-10 bg-zinc-900/80">
      <div class="flex justify-between items-end mb-8">
        <div>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Importe a Pagar</p>
          <p class="text-4xl font-black text-zinc-100 tracking-tighter">
            <span class="text-2xl text-zinc-500 font-medium mr-1">S/</span>{{ viaje.precio_base }}
          </p>
        </div>
        
        <div class="text-right">
          <p class="text-xs text-zinc-500">Bus: <span class="font-bold text-zinc-300">{{ viaje.vehiculo_placa }}</span></p>
        </div>
      </div>

      <button
        class="w-full relative overflow-hidden group rounded-2xl bg-zinc-100 px-6 py-4 font-bold text-zinc-900 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
        @click="$emit('continuar')"
      >
        <span class="relative z-10 flex items-center justify-center gap-2 tracking-wide">
          CONTINUAR CON EL PAGO
          <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </span>
      </button>

      <p class="mt-6 text-[10px] text-center text-zinc-500 uppercase tracking-widest font-bold">Presenta este comprobante al abordar</p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    formatDate(dateStr: string) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(parseInt(parts[0] || '0'), parseInt(parts[1] || '1') - 1, parseInt(parts[2] || '1')).toLocaleDateString('es-ES', opts);
    }
  }
}
</script>
