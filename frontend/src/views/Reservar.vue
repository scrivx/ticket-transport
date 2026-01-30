<script setup lang="ts">
import { ref } from 'vue'

import SearchViaje from '@/components/reserva/SearchViaje.vue'
import ViajesList from '@/components/reserva/ViajesList.vue'
import SeatSelector from '@/components/reserva/SeatSelector.vue'
import ConfirmVenta from '@/components/reserva/ConfirmVenta.vue'

import PasajeroModal from '@/components/pago/PasajeroModal.vue'
import PagoModal from '@/components/pago/PagoModal.vue'

import { useReserva } from '@/composables/useReserva'

const showPasajero = ref(false)
const showPago = ref(false)

const {
  filters,
  viajes,
  asientos,
  selectedViaje,
  selectedAsiento,
  loadingAsientos,
  buscarViajes,
  seleccionarViaje,
  seleccionarAsiento,
  procesarVenta,
} = useReserva()
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Reserva de Pasajes</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- COLUMNA IZQUIERDA -->
      <div class="lg:col-span-2 space-y-6">
        <SearchViaje :filters="filters" @buscar="buscarViajes" />

        <ViajesList :viajes="viajes" :selectedViaje="selectedViaje" @select="seleccionarViaje" />

        <SeatSelector
          v-if="selectedViaje"
          :asientos="asientos"
          :loading="loadingAsientos"
          :selectedAsiento="selectedAsiento"
          @select="seleccionarAsiento"
        />
      </div>

      <!-- COLUMNA DERECHA (TICKET) -->
      <div class="lg:sticky lg:top-24 h-fit">
        <ConfirmVenta
          v-if="selectedAsiento"
          :viaje="selectedViaje"
          :asiento="selectedAsiento"
          @continuar="showPasajero = true"
        />
      </div>
    </div>

    <!-- MODALES -->
    <PasajeroModal
      v-if="showPasajero"
      @cerrar="showPasajero = false"
      @continuar="
        () => {
          showPasajero = false
          showPago = true
        }
      "
    />

    <PagoModal v-if="showPago" @cerrar="showPago = false" @confirmarPago="procesarVenta" />
  </div>
</template>
