<script setup lang="ts">
defineEmits(['cerrar', 'confirmarPago'])
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <!-- Modal Container -->
    <div class="relative w-full max-w-[400px] rounded-[2.5rem] bg-zinc-900 border border-zinc-800 p-8 shadow-2xl overflow-hidden text-center">
      <!-- Glow effect en el background -->
      <div class="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>

      <!-- Icono superior -->
      <div class="mx-auto w-16 h-16 rounded-3xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-6 shadow-inner relative z-10">
         <svg class="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
      </div>

      <div class="mb-8 relative z-10">
        <h3 class="text-2xl font-bold text-zinc-100 tracking-tight">Casi listo</h3>
        <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Completa tu pago con Yape o Plin</p>
      </div>

      <div class="space-y-6 relative z-10">
        <div class="bg-zinc-950/50 rounded-3xl p-6 border border-zinc-800/80 inline-block text-center shadow-inner">
           <!-- Placeholder para QR -->
           <img src="@/assets/QR-YAPE.png" alt="QR Yape" class="w-40 h-40 object-cover rounded-2xl mx-auto shadow-sm" />
        </div>

        <div>
          <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">O transfiere al número</p>
          <div class="inline-flex items-center justify-center gap-3 bg-zinc-800/50 rounded-2xl px-6 py-3 border border-zinc-700/50">
             <span class="text-2xl font-black text-zinc-100 tracking-wider">999 888 777</span>
             <button class="text-zinc-400 hover:text-zinc-200 transition" title="Copiar número">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
             </button>
          </div>
        </div>

        <p class="text-xs text-zinc-400 px-4">Al enviar el voucher, tu asiento quedará <strong>temporalmente bloqueado</strong> (Reservado) hasta que validemos el abono.</p>

        <a
          href="https://wa.me/+51914909703"
          target="_blank"
          @click="$emit('confirmarPago')"
          class="flex items-center justify-center gap-3 w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-6 py-4 font-bold text-emerald-400 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Enviar voucher y Reservar Asiento
        </a>
      </div>

      <button
        class="mt-6 w-full rounded-2xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 py-4 font-bold transition-colors"
        @click="$emit('cerrar')"
      >
        Cancelar Reserva
      </button>
    </div>
  </div>
</template>
