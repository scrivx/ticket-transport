<script setup lang="ts">
defineProps<{
  asiento: any
  selected: boolean
}>()

defineEmits(['select'])
</script>

<template>
  <button
    class="relative flex h-12 w-12 items-center justify-center rounded-xl
           text-sm font-bold transition-all duration-200"
    :disabled="asiento.estado !== 'DISPONIBLE'"
    :class="{
      'bg-slate-200 text-slate-400 cursor-not-allowed':
        asiento.estado !== 'DISPONIBLE',

      'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-2 border-emerald-400':
        asiento.estado === 'DISPONIBLE' && !selected,

      'bg-indigo-600 text-white scale-105 shadow-lg':
        selected,
    }"
    @click="$emit('select', asiento)"
  >
    {{ asiento.numero_asiento }}
  </button>
</template>
