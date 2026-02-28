<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const vehiculos = ref<any[]>([])
const loading = ref(false)
const showModal = ref(false)

const form = ref({
  placa: '',
  tipo: 'BUS',
  capacidad: 40,
  marca: '',
  modelo: '',
})

const fetchVehiculos = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/vehiculos/')
    vehiculos.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const saveVehiculo = async () => {
  try {
    await api.post('/vehiculos/', form.value)
    showModal.value = false
    fetchVehiculos()
  } catch (e) {
    alert('Error al guardar el vehículo')
  }
}

onMounted(() => {
  fetchVehiculos()
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-zinc-100">Gestión de Vehículos</h1>
      <button
        @click="showModal = true"
        class="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-xl font-semibold hover:bg-zinc-300 transition"
      >
        + Nuevo Vehículo
      </button>
    </div>

    <div
      class="bg-zinc-900/40 rounded-2xl shadow-sm border border-zinc-800/60 overflow-hidden backdrop-blur-sm"
    >
      <table class="w-full text-left">
        <thead class="bg-zinc-900/80 border-b border-zinc-800">
          <tr>
            <th class="px-6 py-4 font-semibold text-zinc-300">Placa</th>
            <th class="px-6 py-4 font-semibold text-zinc-300">Tipo</th>
            <th class="px-6 py-4 font-semibold text-zinc-300">Capacidad</th>
            <th class="px-6 py-4 font-semibold text-zinc-300">Marca/Modelo</th>
            <th class="px-6 py-4 font-semibold text-zinc-300 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
          <tr v-for="v in vehiculos" :key="v.id" class="hover:bg-zinc-800/40 transition">
            <td class="px-6 py-4 font-bold text-zinc-100">{{ v.placa }}</td>
            <td class="px-6 py-4">{{ v.tipo }}</td>
            <td class="px-6 py-4">{{ v.capacidad }}</td>
            <td class="px-6 py-4 text-zinc-400">{{ v.marca }} {{ v.modelo }}</td>
            <td class="px-6 py-4 text-right">
              <button class="text-zinc-500 hover:text-red-400 transition">ELIMINAR</button>
            </td>
          </tr>
          <tr v-if="vehiculos.length === 0 && !loading">
            <td colspan="5" class="px-6 py-8 text-center text-zinc-500">
              No hay vehículos registrados.
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
      <div
        class="bg-zinc-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-zinc-800 text-zinc-100"
      >
        <h3 class="text-2xl font-bold mb-6">Nuevo Vehículo</h3>

        <div class="space-y-4 text-zinc-300">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Placa</label>
              <input
                v-model="form.placa"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
                placeholder="ABC-123"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tipo</label>
              <select
                v-model="form.tipo"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
              >
                <option value="BUS">Bus</option>
                <option value="COMBI">Combi</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Capacidad (Asientos)</label>
            <input
              type="number"
              v-model="form.capacidad"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Marca</label>
              <input
                v-model="form.marca"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Modelo</label>
              <input
                v-model="form.modelo"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 flex gap-3">
          <button
            @click="showModal = false"
            class="flex-1 rounded-xl border border-zinc-700 py-3 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
          >
            Cancelar
          </button>
          <button
            @click="saveVehiculo"
            class="flex-1 rounded-xl bg-zinc-100 py-3 font-bold text-zinc-900 hover:bg-zinc-300 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
