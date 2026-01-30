<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="relative text-center py-20">
      <img
        src="../assets/logo.png"
        class="absolute inset-x-0 top-0 mx-auto w-96 opacity-10 pointer-events-none"
      />

      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
        <span class="block text-slate-900">Venta de Pasajes</span>
        <span class="block text-indigo-600">Turismo WJL</span>
      </h1>

      <p class="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
        Reserva tus pasajes interprovinciales de forma rápida y segura. Elige tu asiento, paga en
        minutos y viaja tranquilo.
      </p>

      <div class="mt-10 flex justify-center gap-4">
        <RouterLink to="/reservar" class="btn-primary-lg"> Nueva reserva </RouterLink>

        <RouterLink to="/about" class="btn-outline-lg"> Conócenos </RouterLink>
      </div>
    </div>

    <div class="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
      <div class="card">
        <h3 class="text-xl font-semibold">Viajes seguros</h3>
        <p class="mt-2 text-slate-600">Flota moderna y conductores certificados.</p>
      </div>

      <div class="card">
        <h3 class="text-xl font-semibold">Pagos fáciles</h3>
        <p class="mt-2 text-slate-600">Yape, Plin y tarjeta.</p>
      </div>

      <div class="card">
        <h3 class="text-xl font-semibold">Atención directa</h3>
        <p class="mt-2 text-slate-600">Soporte rápido para tus reservas.</p>
      </div>
    </div>

    <!-- Sección "Cómo funciona" -->
    <div class="mt-28">
      <h2 class="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Busca tu viaje</h3>
          <p>Elige destino y horario.</p>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <h3>Selecciona tu asiento</h3>
          <p>Mira el mapa del bus en tiempo real.</p>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <h3>Paga y viaja</h3>
          <p>Recibe tu ticket al instante.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-primary-lg {
  @apply rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold
         text-white shadow hover:bg-indigo-700 transition;
}

.btn-outline-lg {
  @apply rounded-xl border border-slate-300 px-8 py-4 text-lg
         font-semibold text-slate-700 hover:bg-slate-100 transition;
}

.card {
  @apply rounded-2xl bg-white p-6 shadow-sm border border-slate-200;
}

.step-number {
  @apply mx-auto mb-4 flex h-12 w-12 items-center justify-center
         rounded-full bg-indigo-600 text-white font-bold;
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import logoWJL from '../assets/logo.png'
</script>
