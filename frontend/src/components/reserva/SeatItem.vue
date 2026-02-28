<script setup lang="ts">
defineProps<{
  asiento: any
  selected: boolean
}>()

defineEmits(['select'])
</script>

<template>
  <button
    class="relative flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200"
    :disabled="asiento.estado !== 'DISPONIBLE'"
    :class="{
      'bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed':
        asiento.estado !== 'DISPONIBLE',

      'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600':
        asiento.estado === 'DISPONIBLE' && !selected,

      'bg-zinc-200 text-zinc-900 scale-105 shadow-lg': selected,
    }"
    @click="$emit('select', asiento)"
  >
    {{ asiento.numero_asiento }}
  </button>
</template>
