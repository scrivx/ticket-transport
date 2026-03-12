<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const conductores = ref<any[]>([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)

const form = ref({
  id: null as number | null,
  nombres: '',
  apellidos: '',
  licencia: '',
  telefono: '',
  estado: true
})

const fetchConductores = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/conductores/')
    conductores.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const openModal = (conductor: any = null) => {
  if (conductor) {
    isEditing.value = true
    form.value = { ...conductor }
  } else {
    isEditing.value = false
    form.value = {
      id: null,
      nombres: '',
      apellidos: '',
      licencia: '',
      telefono: '',
      estado: true
    }
  }
  showModal.value = true
}

const saveConductor = async () => {
  try {
    if (isEditing.value && form.value.id) {
      await api.put(`/conductores/${form.value.id}/`, form.value)
    } else {
      await api.post('/conductores/', form.value)
    }
    showModal.value = false
    fetchConductores()
  } catch (e) {
    alert('Error al guardar el conductor')
  }
}

const deleteConductor = async (id: number) => {
  if (!confirm('¿Seguro que desea eliminar a este conductor?')) return
  try {
    await api.delete(`/conductores/${id}/`)
    fetchConductores()
  } catch (e) {
    alert('Error al eliminar el conductor')
  }
}

onMounted(() => {
  fetchConductores()
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-zinc-100">Gestión de Conductores</h1>
      <button
        @click="openModal()"
        class="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-xl font-semibold hover:bg-zinc-300 transition"
      >
        + Nuevo Conductor
      </button>
    </div>

    <div
      class="bg-zinc-900/40 rounded-2xl shadow-sm border border-zinc-800/60 overflow-hidden backdrop-blur-sm"
    >
      <table class="w-full text-left">
        <thead class="bg-zinc-900/80 border-b border-zinc-800">
          <tr>
            <th class="px-6 py-4 font-semibold text-zinc-300">Nombres</th>
            <th class="px-6 py-4 font-semibold text-zinc-300">Apellidos</th>
            <th class="px-6 py-4 font-semibold text-zinc-300">Licencia</th>
            <th class="px-6 py-4 font-semibold text-zinc-300">Teléfono</th>
            <th class="px-6 py-4 font-semibold text-zinc-300 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
          <tr v-for="c in conductores" :key="c.id" class="hover:bg-zinc-800/40 transition">
            <td class="px-6 py-4 font-bold text-zinc-100">{{ c.nombres }}</td>
            <td class="px-6 py-4 text-zinc-400">{{ c.apellidos }}</td>
            <td class="px-6 py-4">{{ c.licencia }}</td>
            <td class="px-6 py-4">{{ c.telefono }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="openModal(c)" class="text-indigo-400 hover:text-indigo-300 transition mr-4">EDITAR</button>
              <button @click="deleteConductor(c.id)" class="text-zinc-500 hover:text-red-400 transition">ELIMINAR</button>
            </td>
          </tr>
          <tr v-if="conductores.length === 0 && !loading">
            <td colspan="5" class="px-6 py-8 text-center text-zinc-500">
              No hay conductores registrados.
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
        <h3 class="text-2xl font-bold mb-6">{{ isEditing ? 'Editar Conductor' : 'Nuevo Conductor' }}</h3>

        <div class="space-y-4 text-zinc-300">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombres</label>
              <input
                v-model="form.nombres"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
                placeholder="Juan"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Apellidos</label>
              <input
                v-model="form.apellidos"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
                placeholder="Pérez"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Licencia</label>
            <input
              v-model="form.licencia"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
            />
          </div>
          <div>
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
            @click="saveConductor"
            class="flex-1 rounded-xl bg-zinc-100 py-3 font-bold text-zinc-900 hover:bg-zinc-300 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
