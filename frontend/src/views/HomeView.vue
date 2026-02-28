<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="relative text-center py-20">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
        <span class="block text-zinc-100">Venta de Pasajes</span>
        <span class="block text-zinc-400">Turismo WJL</span>
      </h1>

      <p class="mt-6 max-w-3xl mx-auto text-lg text-zinc-400">
        Reserva tus pasajes interprovinciales de forma rápida y segura. Elige tu asiento, paga en
        minutos y viaja tranquilo.
      </p>

      <div class="mt-10 flex justify-center gap-4">
        <RouterLink to="/reservar" class="btn-primary-lg"> Nueva reserva </RouterLink>
        <RouterLink to="/about" class="btn-outline-lg"> Conócenos </RouterLink>
      </div>
    </div>
    <!-- Sección "Cómo funciona" -->
    <div class="mt-28">
      <h2 class="text-3xl font-bold text-center mb-12 text-zinc-100">¿Cómo funciona?</h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
        <div class="step">
          <div class="step-number">1</div>
          <h3 class="text-zinc-200 font-semibold mt-4">Busca tu viaje</h3>
          <p class="text-zinc-400 mt-2">Elige destino y horario.</p>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <h3 class="text-zinc-200 font-semibold mt-4">Selecciona tu asiento</h3>
          <p class="text-zinc-400 mt-2">Mira el mapa del bus en tiempo real.</p>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <h3 class="text-zinc-200 font-semibold mt-4">Paga y viaja</h3>
          <p class="text-zinc-400 mt-2">Recibe tu ticket al instante.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-primary-lg {
  @apply rounded-xl bg-zinc-100 border border-zinc-100 px-8 py-4 text-lg font-semibold
         text-zinc-900 shadow hover:bg-zinc-300 transition;
}

.btn-outline-lg {
  @apply rounded-xl border border-zinc-700 px-8 py-4 text-lg
         font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition;
}

.card {
  @apply rounded-2xl bg-zinc-900/40 p-6 shadow-sm border border-zinc-800/60 backdrop-blur-sm;
}

.step-number {
  @apply mx-auto mb-4 flex h-12 w-12 items-center justify-center
         rounded-full bg-zinc-800 border border-zinc-700 text-zinc-100 font-bold;
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import logoWJL from '../assets/logo.png'
</script>
