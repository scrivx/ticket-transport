<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const rutas = ref<any[]>([])
const ciudades = ref<any[]>([])
const loading = ref(false)
const showModal = ref(false)

const form = ref({
  origen: '',
  destino: '',
  distancia_km: 0,
})

const fetchRutas = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/rutas/')
    rutas.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchCiudades = async () => {
  try {
    const { data } = await api.get('/ciudades/')
    ciudades.value = data
  } catch (e) {
    console.error(e)
  }
}

const saveRuta = async () => {
  try {
    await api.post('/rutas/', form.value)
    showModal.value = false
    fetchRutas()
  } catch (e) {
    alert('Error al guardar la ruta')
  }
}

const cityForm = ref({
  nombre: '',
  departamento: '',
})
const showCityModal = ref(false)

const saveCity = async () => {
  try {
    await api.post('/ciudades/', cityForm.value)
    showCityModal.value = false
    cityForm.value = { nombre: '', departamento: '' }
    fetchCiudades()
  } catch (e) {
    alert('Error al guardar la ciudad')
  }
}

onMounted(() => {
  fetchRutas()
  fetchCiudades()
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-zinc-100">Gestión de Rutas</h1>
      <button
        @click="showModal = true"
        class="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-xl font-semibold hover:bg-zinc-300 transition"
      >
        + Nueva Ruta
      </button>
    </div>

    <div
      class="bg-zinc-900/40 rounded-2xl shadow-sm border border-zinc-800/60 overflow-hidden backdrop-blur-sm"
    >
      <table class="w-full text-left">
        <thead class="bg-zinc-900/80 border-b border-zinc-800">
          <tr>
            <th class="px-6 py-4 font-semibold text-zinc-300">Origen</th>
            <th class="px-6 py-4 font-semibold text-zinc-300">Destino</th>
            <th class="px-6 py-4 font-semibold text-zinc-300">Distancia (km)</th>
            <th class="px-6 py-4 font-semibold text-zinc-300 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
          <tr v-for="ruta in rutas" :key="ruta.id" class="hover:bg-zinc-800/40 transition">
            <td class="px-6 py-4">{{ ruta.origen_nombre }}</td>
            <td class="px-6 py-4">{{ ruta.destino_nombre }}</td>
            <td class="px-6 py-4">{{ ruta.distancia_km }}</td>
            <td class="px-6 py-4 text-right">
              <button class="text-zinc-500 hover:text-red-400 transition">ELIMINAR</button>
            </td>
          </tr>
          <tr v-if="rutas.length === 0 && !loading">
            <td colspan="4" class="px-6 py-8 text-center text-zinc-500">
              No hay rutas registradas.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h3 class="text-2xl font-bold mb-6 text-zinc-100">Nueva Ruta</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Origen</label>
            <div class="flex gap-2">
              <select
                v-model="form.origen"
                class="flex-1 rounded-xl bg-zinc-950/50 border border-zinc-800 px-4 py-2 text-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-600 transition"
              >
                <option value="">Seleccione origen</option>
                <option v-for="c in ciudades" :key="c.id" :value="c.id">{{ c.nombre }}</option>
              </select>
              <button
                @click="showCityModal = true"
                class="px-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Destino</label>
            <div class="flex gap-2">
              <select
                v-model="form.destino"
                class="flex-1 rounded-xl bg-zinc-950/50 border border-zinc-800 px-4 py-2 text-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-600 transition"
              >
                <option value="">Seleccione destino</option>
                <option v-for="c in ciudades" :key="c.id" :value="c.id">{{ c.nombre }}</option>
              </select>
              <button
                @click="showCityModal = true"
                class="px-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Distancia (km)</label>
            <input
              type="number"
              v-model="form.distancia_km"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2 shadow-sm focus:ring-2 focus:ring-zinc-600 transition"
            />
          </div>
        </div>

        <div class="mt-8 flex gap-3">
          <button
            @click="showModal = false"
            class="flex-1 rounded-xl border border-zinc-700 py-3 font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
          >
            Cancelar
          </button>
          <button
            @click="saveRuta"
            class="flex-1 rounded-xl bg-zinc-100 py-3 font-bold text-zinc-900 shadow-lg hover:bg-zinc-300 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
    <!-- MODAL CIUDAD -->
    <div
      v-if="showCityModal"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="text-xl font-bold mb-4 text-zinc-100">Nueva Ciudad</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Nombre</label>
            <input
              v-model="cityForm.nombre"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
              placeholder="Ej. Arequipa"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Departamento</label>
            <input
              v-model="cityForm.departamento"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
              placeholder="Ej. Arequipa"
            />
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <button
            @click="showCityModal = false"
            class="flex-1 rounded-xl border border-zinc-700 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            Cancelar
          </button>
          <button
            @click="saveCity"
            class="flex-1 rounded-xl bg-zinc-100 py-2 font-bold text-zinc-900 hover:bg-zinc-300 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
