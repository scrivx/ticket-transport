<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        <span class="block">Sistema de Ventas</span>
        <span class="block text-indigo-600">Transportes CRM</span>
      </h1>
      <p
        class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
      >
        Gestione sus pasajes de forma rápida y segura. Busque viajes, seleccione sus asientos y
        complete su compra en segundos.
      </p>
      <div class="mt-10 flex justify-center gap-x-6">
        <RouterLink
          to="/reservar"
          class="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 shadow-md transition"
        >
          Nueva Reserva
        </RouterLink>
        <RouterLink
          to="/about"
          class="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 shadow-md transition"
        >
          Información
        </RouterLink>
      </div>
    </div>

    <div class="mt-20">
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">¿Cómo funciona?</h2>
      <div class="grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0 text-center">
        <div>
          <div
            class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4"
          >
            <span class="font-bold">1</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Buscar</h3>
          <p class="mt-2 text-base text-gray-500">
            Encuentre el viaje que mejor se adapte a su horario y destino.
          </p>
        </div>
        <div>
          <div
            class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4"
          >
            <span class="font-bold">2</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Elegir</h3>
          <p class="mt-2 text-base text-gray-500">
            Seleccione su asiento preferido directamente desde el mapa del vehículo.
          </p>
        </div>
        <div>
          <div
            class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4"
          >
            <span class="font-bold">3</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Pagar</h3>
          <p class="mt-2 text-base text-gray-500">
            Pague mediante Yape, Plin o Tarjeta y reciba su ticket al instante.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
