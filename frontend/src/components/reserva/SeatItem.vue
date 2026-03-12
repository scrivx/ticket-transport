<script setup lang="ts">
defineProps<{
  asiento: any
  selected: boolean
}>()

defineEmits(['select'])
</script>

<template>
  <button
    class="relative flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm"
    :disabled="asiento.estado !== 'DISPONIBLE'"
    :class="{
      'bg-zinc-950 text-zinc-700 border border-zinc-900 cursor-not-allowed opacity-60':
        asiento.estado !== 'DISPONIBLE',

      'bg-zinc-500 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-200 border-b-4 border-zinc-700 hover:border-zinc-600':
        asiento.estado === 'DISPONIBLE' && !selected,

      'bg-emerald-400 text-zinc-900 border-b-4 border-zinc-400 scale-[1.05] shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)]': selected,
    }"
    @click="$emit('select', asiento)"
  >
    <span v-if="asiento.estado !== 'DISPONIBLE'">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
    </span>
    <span v-else>{{ asiento.numero_asiento }}</span>
  </button>
</template>
