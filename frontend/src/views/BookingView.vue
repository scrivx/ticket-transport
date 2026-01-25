<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Reservar Pasaje</h2>

    <!-- Paso 1: Buscar Viajes -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 class="text-xl font-semibold mb-4">1. Buscar Viaje</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            v-model="filters.fecha"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="buscarViajes"
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>

    <!-- Resultados de Búsqueda -->
    <div v-if="viajes.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Viajes Disponibles</h3>
      <div class="grid gap-4">
        <div
          v-for="viaje in viajes"
          :key="viaje.id"
          class="border rounded-lg p-4 flex justify-between items-center bg-white hover:bg-gray-50 cursor-pointer transition"
          :class="{ 'ring-2 ring-indigo-500': selectedViaje?.id === viaje.id }"
          @click="seleccionarViaje(viaje)"
        >
          <div>
            <div class="font-bold text-lg">
              {{ viaje.ruta_info.origen_nombre }} → {{ viaje.ruta_info.destino_nombre }}
            </div>
            <div class="text-gray-600">
              Salida: {{ viaje.horario_hora }} | Vehículo: {{ viaje.vehiculo_placa }}
            </div>
          </div>
          <div class="text-xl font-bold text-indigo-600">S/ {{ viaje.precio_base }}</div>
        </div>
      </div>
    </div>

    <!-- Paso 2: Seleccionar Asiento -->
    <div v-if="selectedViaje" class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 class="text-xl font-semibold mb-4">2. Seleccionar Asiento</h3>

      <div v-if="loadingAsientos" class="text-center py-4">Cargando asientos...</div>

      <div v-else class="grid grid-cols-4 gap-4 max-w-sm mx-auto">
        <button
          v-for="asiento in asientos"
          :key="asiento.id"
          @click="seleccionarAsiento(asiento)"
          :disabled="asiento.estado !== 'DISPONIBLE'"
          class="p-4 rounded-md text-center font-bold transition relative"
          :class="{
            'bg-gray-200 text-gray-400 cursor-not-allowed': asiento.estado !== 'DISPONIBLE',
            'bg-green-100 text-green-800 hover:bg-green-200 border-2 border-green-500':
              asiento.estado === 'DISPONIBLE' && selectedAsiento?.id !== asiento.id,
            'bg-indigo-600 text-white': selectedAsiento?.id === asiento.id,
          }"
        >
          {{ asiento.numero_asiento }}
        </button>
      </div>

      <div class="mt-4 flex gap-4 justify-center text-sm">
        <div class="flex items-center">
          <span class="w-4 h-4 bg-green-100 border-2 border-green-500 rounded mr-2"></span>
          Disponible
        </div>
        <div class="flex items-center">
          <span class="w-4 h-4 bg-indigo-600 rounded mr-2"></span> Seleccionado
        </div>
        <div class="flex items-center">
          <span class="w-4 h-4 bg-gray-200 rounded mr-2"></span> Ocupado
        </div>
      </div>
    </div>

    <!-- Paso 3: Confirmar y Pagar -->
    <div v-if="selectedAsiento" class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">3. Confirmar Venta</h3>

      <div class="mb-4 p-4 bg-gray-50 rounded text-sm">
        <p>
          <strong>Viaje:</strong> {{ selectedViaje?.ruta_info.origen_nombre }} -
          {{ selectedViaje?.ruta_info.destino_nombre }}
        </p>
        <p><strong>Asiento:</strong> #{{ selectedAsiento.numero_asiento }}</p>
        <p><strong>Total a Pagar:</strong> S/ {{ selectedViaje?.precio_base }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
        <select v-model="metodoPago" class="w-full border rounded p-2">
          <option value="EFECTIVO">Efectivo</option>
          <option value="YAPE">Yape</option>
          <option value="PLIN">Plin</option>
          <option value="TARJETA">Tarjeta</option>
        </select>
      </div>

      <!-- Pasajero Fake (En prod debería seleccionarse o crearse) -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">ID Pasajero (Demo)</label>
        <input
          v-model="pasajeroId"
          type="number"
          class="w-full border rounded p-2"
          placeholder="ID del Pasajero existente"
        />
        <p class="text-xs text-gray-500 mt-1">
          Para esta demo, ingresa un ID de pasajero válido (ej: 1)
        </p>
      </div>

      <button
        @click="procesarVenta"
        :disabled="processing"
        class="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
      >
        {{ processing ? 'Procesando...' : 'Confirmar Venta' }}
      </button>

      <div
        v-if="mensaje"
        class="mt-4 p-4 rounded text-center"
        :class="SUCCESS ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
      >
        {{ mensaje }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import api from '../services/api'

const filters = reactive({
  fecha: '',
})

const viajes = ref<any[]>([])
const asientos = ref<any[]>([])
const selectedViaje = ref<any>(null)
const selectedAsiento = ref<any>(null)
const loadingAsientos = ref(false)
const processing = ref(false)
const mensaje = ref('')
const SUCCESS = ref(false)

const metodoPago = ref('EFECTIVO')
const pasajeroId = ref(1) // Hardcoded for demo

const buscarViajes = async () => {
  try {
    const params: any = {}
    if (filters.fecha) params.fecha_viaje = filters.fecha

    const response = await api.get('/viajes/', { params })
    viajes.value = response.data
    selectedViaje.value = null
    selectedAsiento.value = null
    asientos.value = []
  } catch (error) {
    console.error(error)
  }
}

const seleccionarViaje = async (viaje: any) => {
  selectedViaje.value = viaje
  selectedAsiento.value = null
  loadingAsientos.value = true
  try {
    const response = await api.get(`/asientos-viaje/?viaje=${viaje.id}`)
    asientos.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loadingAsientos.value = false
  }
}

const seleccionarAsiento = (asiento: any) => {
  if (asiento.estado === 'DISPONIBLE') {
    selectedAsiento.value = asiento
  }
}

const procesarVenta = async () => {
  if (!selectedViaje.value || !selectedAsiento.value) return

  processing.value = true
  mensaje.value = ''

  try {
    const payload = {
      viaje_id: selectedViaje.value.id,
      asiento_viaje_id: selectedAsiento.value.id,
      pasajero_id: pasajeroId.value,
      metodo_pago: metodoPago.value,
    }

    await api.post('/ventas/', payload)

    mensaje.value = '¡Venta realizada con éxito!'
    SUCCESS.value = true

    // Refrescar asientos
    await seleccionarViaje(selectedViaje.value)
  } catch (error) {
    console.error(error)
    mensaje.value = 'Error al procesar la venta'
    SUCCESS.value = false
  } finally {
    processing.value = false
  }
}
</script>
