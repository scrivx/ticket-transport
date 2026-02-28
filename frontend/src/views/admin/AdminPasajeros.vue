<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const pasajeros = ref<any[]>([])
const loading = ref(false)
const showModal = ref(false)

const form = ref({
  tipo_documento: 'DNI',
  numero_documento: '',
  nombres: '',
  apellidos: '',
  telefono: '',
})

const fetchPasajeros = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/pasajeros/')
    pasajeros.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const savePasajero = async () => {
  try {
    await api.post('/pasajeros/', form.value)
    showModal.value = false
    fetchPasajeros()
  } catch (e) {
    alert('Error al guardar el pasajero')
  }
}

onMounted(() => {
  fetchPasajeros()
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-zinc-100">Gestión de Pasajeros</h1>
      <button
        @click="showModal = true"
        class="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-xl font-semibold hover:bg-zinc-300 transition"
      >
        + Registro Manual
      </button>
    </div>

    <div
      class="bg-zinc-900/40 rounded-2xl shadow-sm border border-zinc-800/60 overflow-hidden backdrop-blur-sm"
    >
      <table class="w-full text-left">
        <thead class="bg-zinc-900/80 border-b border-zinc-800 text-zinc-300">
          <tr>
            <th class="px-6 py-4 font-semibold">Documento</th>
            <th class="px-6 py-4 font-semibold">Nombres y Apellidos</th>
            <th class="px-6 py-4 font-semibold">Teléfono</th>
            <th class="px-6 py-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
          <tr v-for="p in pasajeros" :key="p.id" class="hover:bg-zinc-800/40 transition">
            <td class="px-6 py-4">
              <span
                class="text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-md text-zinc-300 mr-2"
                >{{ p.tipo_documento }}</span
              >
              {{ p.numero_documento }}
            </td>
            <td class="px-6 py-4 font-semibold text-zinc-100">{{ p.nombres }} {{ p.apellidos }}</td>
            <td class="px-6 py-4">{{ p.telefono }}</td>
            <td class="px-6 py-4 text-right">
              <button class="text-zinc-500 hover:text-red-400 transition">ELIMINAR</button>
            </td>
          </tr>
          <tr v-if="pasajeros.length === 0 && !loading">
            <td colspan="4" class="px-6 py-8 text-center text-zinc-500">
              No hay pasajeros registrados.
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
        class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl text-zinc-100"
      >
        <h3 class="text-2xl font-bold mb-6">Nuevo Pasajero</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
          <div>
            <label class="block text-sm font-medium mb-1">Tipo Doc.</label>
            <select
              v-model="form.tipo_documento"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
            >
              <option value="DNI">DNI</option>
              <option value="CE">CE</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Número Doc.</label>
            <input
              v-model="form.numero_documento"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Nombres</label>
            <input
              v-model="form.nombres"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Apellidos</label>
            <input
              v-model="form.apellidos"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Teléfono</label>
            <input
              v-model="form.telefono"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
            />
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
            @click="savePasajero"
            class="flex-1 rounded-xl bg-zinc-100 py-3 font-bold text-zinc-900 shadow-lg hover:bg-zinc-300 transition"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
