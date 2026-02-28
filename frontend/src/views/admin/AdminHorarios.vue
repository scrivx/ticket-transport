<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const viajes = ref<any[]>([])
const rutas = ref<any[]>([])
const horarios = ref<any[]>([])
const vehiculos = ref<any[]>([])
const conductores = ref<any[]>([])

const loading = ref(false)
const showModal = ref(false)

// Forms
const form = ref({
  ruta: '',
  horario: '',
  vehiculo: '',
  conductor: '',
  fecha_viaje: '',
  precio_base: 0,
})

// Quick creation forms
const showHorarioModal = ref(false)
const horarioForm = ref({ hora_salida: '', hora_llegada_estimada: '' })

const fetchViajes = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/viajes/')
    viajes.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchData = async () => {
  try {
    const [rRes, hRes, vRes, cRes] = await Promise.all([
      api.get('/rutas/'),
      api.get('/horarios/'),
      api.get('/vehiculos/'),
      api.get('/conductores/'),
    ])
    rutas.value = rRes.data
    horarios.value = hRes.data
    vehiculos.value = vRes.data
    conductores.value = cRes.data
  } catch (e) {
    console.error(e)
  }
}

const saveViaje = async () => {
  try {
    await api.post('/viajes/', form.value)
    showModal.value = false
    fetchViajes()
    // Reset form
    form.value = {
      ruta: '',
      horario: '',
      vehiculo: '',
      conductor: '',
      fecha_viaje: '',
      precio_base: 0,
    }
  } catch (e) {
    alert('Error al guardar el viaje/programación')
  }
}

const saveHorario = async () => {
  try {
    await api.post('/horarios/', horarioForm.value)
    showHorarioModal.value = false
    horarioForm.value = { hora_salida: '', hora_llegada_estimada: '' }
    const { data } = await api.get('/horarios/')
    horarios.value = data
  } catch (e) {
    alert('Error al guardar horario')
  }
}

const deleteViaje = async (id: number) => {
  if (!confirm('¿Eliminar esta programación?')) return
  try {
    await api.delete(`/viajes/${id}/`)
    fetchViajes()
  } catch (e) {
    alert('Error al eliminar')
  }
}

onMounted(() => {
  fetchViajes()
  fetchData()
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-zinc-100">Programación de Viajes</h1>
      <button
        @click="showModal = true"
        class="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-xl font-semibold hover:bg-zinc-300 transition"
      >
        + Programar Viaje
      </button>
    </div>

    <div
      class="bg-zinc-900/40 rounded-2xl shadow-sm border border-zinc-800/60 overflow-hidden backdrop-blur-sm"
    >
      <table class="w-full text-left">
        <thead class="bg-zinc-900/80 border-b border-zinc-800 text-zinc-300">
          <tr>
            <th class="px-6 py-4 font-semibold">Fecha</th>
            <th class="px-6 py-4 font-semibold">Hora</th>
            <th class="px-6 py-4 font-semibold">Ruta</th>
            <th class="px-6 py-4 font-semibold">Vehículo</th>
            <th class="px-6 py-4 font-semibold">Conductor</th>
            <th class="px-6 py-4 font-semibold">Precio</th>
            <th class="px-6 py-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
          <tr v-for="v in viajes" :key="v.id" class="hover:bg-zinc-800/40 transition">
            <td class="px-6 py-4">{{ v.fecha_viaje }}</td>
            <td class="px-6 py-4 font-bold text-zinc-100">{{ v.horario_hora }}</td>
            <td class="px-6 py-4">
              {{ v.ruta_info.origen_nombre }} - {{ v.ruta_info.destino_nombre }}
            </td>
            <td class="px-6 py-4">
              <span
                class="bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-1 rounded text-xs font-bold"
                >{{ v.vehiculo_placa }}</span
              >
            </td>
            <td class="px-6 py-4 text-sm">{{ v.conductor_info?.nombres }}</td>
            <td class="px-6 py-4 font-bold text-zinc-100">S/ {{ v.precio_base }}</td>
            <td class="px-6 py-4 text-right">
              <button
                @click="deleteViaje(v.id)"
                class="text-zinc-500 hover:text-red-400 transition"
              >
                ELIMINAR
              </button>
            </td>
          </tr>
          <tr v-if="viajes.length === 0 && !loading">
            <td colspan="7" class="px-6 py-8 text-center text-zinc-500">
              No hay viajes programados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL PRINCIPAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div
        class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-2xl font-bold mb-6">Programar Nuevo Viaje</h3>

        <div class="space-y-4 text-zinc-300">
          <div>
            <label class="block text-sm font-medium mb-1">Ruta</label>
            <select
              v-model="form.ruta"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 px-4 py-2 text-zinc-200"
            >
              <option value="">Seleccione Ruta</option>
              <option v-for="r in rutas" :key="r.id" :value="r.id">
                {{ r.origen_nombre }} - {{ r.destino_nombre }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                v-model="form.fecha_viaje"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Horario</label>
              <div class="flex gap-2">
                <select
                  v-model="form.horario"
                  class="flex-1 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
                >
                  <option value="">Hora</option>
                  <option v-for="h in horarios" :key="h.id" :value="h.id">
                    {{ h.hora_salida }}
                  </option>
                </select>
                <button
                  @click="showHorarioModal = true"
                  class="px-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Vehículo</label>
              <select
                v-model="form.vehiculo"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
              >
                <option value="">Placa</option>
                <option v-for="ve in vehiculos" :key="ve.id" :value="ve.id">
                  {{ ve.placa }} ({{ ve.tipo }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Conductor</label>
              <select
                v-model="form.conductor"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
              >
                <option value="">Conductor</option>
                <option v-for="c in conductores" :key="c.id" :value="c.id">
                  {{ c.nombres }} {{ c.apellidos }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Precio Base</label>
            <input
              type="number"
              step="0.50"
              v-model="form.precio_base"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
            />
          </div>
        </div>

        <div class="mt-8 flex gap-3">
          <button
            @click="showModal = false"
            class="flex-1 rounded-xl border border-zinc-700 py-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            Cancelar
          </button>
          <button
            @click="saveViaje"
            class="flex-1 rounded-xl bg-zinc-100 py-3 font-bold text-zinc-900 shadow-lg hover:bg-zinc-300 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL HORARIO -->
    <div
      v-if="showHorarioModal"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div
        class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-zinc-100"
      >
        <h3 class="text-xl font-bold mb-4">Nuevo Horario</h3>
        <div class="space-y-4 text-zinc-300">
          <div>
            <label class="block text-sm font-medium mb-1">Hora Salida</label>
            <input
              type="time"
              v-model="horarioForm.hora_salida"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 px-4 py-2 text-zinc-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Hora Llegada Est.</label>
            <input
              type="time"
              v-model="horarioForm.hora_llegada_estimada"
              class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 px-4 py-2 text-zinc-200"
            />
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <button
            @click="showHorarioModal = false"
            class="flex-1 rounded-xl border border-zinc-700 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            Cancelar
          </button>
          <button
            @click="saveHorario"
            class="flex-1 rounded-xl bg-zinc-100 py-2 font-bold text-zinc-900 hover:bg-zinc-300 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
