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
const isEditing = ref(false)
const isRecurring = ref(false)

// Filters
const filterFecha = ref('')
const filterRuta = ref('')

// Forms
const form = ref({
  id: null as number | null,
  ruta: '',
  horario: '',
  vehiculo: '',
  conductor: '',
  fecha_viaje: '',
  precio_base: 0,
  dias_semana: [] as number[],
  fecha_fin: '',
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

import { computed } from 'vue'

const filteredViajes = computed(() => {
  return viajes.value.filter(v => {
    const matchFecha = !filterFecha.value || v.fecha_viaje === filterFecha.value
    const matchRuta = !filterRuta.value || v.ruta === parseInt(filterRuta.value)
    return matchFecha && matchRuta
  })
})

const viajesAgrupados = computed(() => {
  const grupos = new Map<string, any[]>()
  filteredViajes.value.forEach(v => {
    if (!grupos.has(v.fecha_viaje)) {
      grupos.set(v.fecha_viaje, [])
    }
    grupos.get(v.fecha_viaje)?.push(v)
  })
  
  return Array.from(grupos.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, items]) => ({
      fecha,
      items: items.sort((a, b) => (a.horario_hora || '').localeCompare(b.horario_hora || ''))
    }))
})

const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', options)
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

const openModal = (viaje: any = null) => {
  if (viaje) {
    isEditing.value = true
    isRecurring.value = false
    form.value = { 
      id: viaje.id,
      ruta: viaje.ruta_id || viaje.ruta?.id || viaje.ruta,
      horario: viaje.horario_id || viaje.horario?.id || viaje.horario,
      vehiculo: viaje.vehiculo_id || viaje.vehiculo?.id || viaje.vehiculo,
      conductor: viaje.conductor_id || viaje.conductor?.id || viaje.conductor,
      fecha_viaje: viaje.fecha_viaje,
      precio_base: viaje.precio_base,
      dias_semana: [],
      fecha_fin: ''
    }
  } else {
    isEditing.value = false
    isRecurring.value = false
    form.value = {
      id: null,
      ruta: '',
      horario: '',
      vehiculo: '',
      conductor: '',
      fecha_viaje: '',
      precio_base: 0,
      dias_semana: [],
      fecha_fin: '',
    }
  }
  showModal.value = true
}

const saveViaje = async () => {
  try {
    if (isEditing.value && form.value.id) {
       await api.put(`/viajes/${form.value.id}/`, form.value)
    } else if (isRecurring.value) {
       await api.post('/viajes/programar_recurrente/', {
          ruta: form.value.ruta,
          vehiculo: form.value.vehiculo,
          conductor: form.value.conductor,
          horario: form.value.horario,
          precio_base: form.value.precio_base,
          fecha_inicio: form.value.fecha_viaje,
          fecha_fin: form.value.fecha_fin,
          dias_semana: form.value.dias_semana,
       })
    } else {
       await api.post('/viajes/', form.value)
    }
    
    showModal.value = false
    fetchViajes()
    
    form.value = {
      id: null,
      ruta: '',
      horario: '',
      vehiculo: '',
      conductor: '',
      fecha_viaje: '',
      precio_base: 0,
      dias_semana: [],
      fecha_fin: ''
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
      <div>
        <h1 class="text-3xl font-bold text-zinc-100">Programación de Viajes</h1>
        <p class="text-zinc-500 text-sm mt-1">Gestiona las salidas, rutas y conductores asignados.</p>
      </div>
      <button
        @click="openModal()"
        class="bg-zinc-100 text-zinc-900 px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-300 transition shadow-lg shadow-zinc-100/10 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Programar Viaje
      </button>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="relative">
        <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">Filtrar por Fecha</label>
        <input 
          type="date" 
          v-model="filterFecha"
          class="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-200 px-4 py-2.5 focus:ring-2 focus:ring-zinc-700 transition outline-none"
        />
      </div>
      <div>
        <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">Filtrar por Ruta</label>
        <select 
          v-model="filterRuta"
          class="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-200 px-4 py-2.5 focus:ring-2 focus:ring-zinc-700 transition outline-none"
        >
          <option value="">Todas las rutas</option>
          <option v-for="r in rutas" :key="r.id" :value="r.id">{{ r.origen_nombre }} - {{ r.destino_nombre }}</option>
        </select>
      </div>
      <div class="flex items-end">
        <button 
          @click="filterFecha = ''; filterRuta = ''"
          class="text-zinc-500 hover:text-zinc-300 text-sm font-medium mb-3 ml-2 transition underline underline-offset-4"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-400"></div>
    </div>

    <div v-else class="space-y-8">
      <div v-for="grupo in viajesAgrupados" :key="grupo.fecha" class="space-y-3">
        <h2 class="text-zinc-400 font-bold text-sm uppercase tracking-widest flex items-center gap-3 ml-1">
          <span class="p-1 px-2 border border-zinc-800 bg-zinc-900/50 rounded-lg text-zinc-300">{{ formatDate(grupo.fecha).split(',')[0] }}</span>
          {{ formatDate(grupo.fecha).split(',').slice(1).join(',') }}
        </h2>
        
        <div class="bg-zinc-900/40 rounded-2xl shadow-sm border border-zinc-800/60 overflow-hidden backdrop-blur-sm">
          <table class="w-full text-left border-collapse">
            <thead class="bg-zinc-900/80 border-b border-zinc-800 text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th class="px-6 py-3">Hora</th>
                <th class="px-6 py-3">Ruta</th>
                <th class="px-6 py-3">Vehículo / Conductor</th>
                <th class="px-6 py-3">Precio</th>
                <th class="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
              <tr v-for="v in grupo.items" :key="v.id" class="hover:bg-zinc-800/40 transition">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="text-zinc-100 font-bold text-lg">{{ v.horario_hora }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-zinc-200 font-semibold">{{ v.ruta_info.origen_nombre }} → {{ v.ruta_info.destino_nombre }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span class="bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded text-[10px] font-bold">{{ v.vehiculo_placa }}</span>
                      <span class="text-xs text-zinc-500">{{ v.vehiculo_tipo }}</span>
                    </div>
                    <span class="text-sm text-zinc-300 font-medium">{{ v.conductor_info?.nombres }} {{ v.conductor_info?.apellidos }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-zinc-100 font-bold">S/ {{ v.precio_base }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-3">
                    <button
                      @click="openModal(v)"
                      class="p-2 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition"
                      title="Editar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteViaje(v.id)"
                      class="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition"
                      title="Eliminar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-if="viajesAgrupados.length === 0" class="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
        <svg class="w-16 h-16 text-zinc-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-zinc-500 font-medium text-lg">No se encontraron programaciones</p>
        <p class="text-zinc-600 text-sm mt-1">Intenta con otros filtros o programa un nuevo viaje.</p>
      </div>
    </div>

    <!-- MODAL PRINCIPAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div
        class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-2xl font-bold mb-6">{{ isEditing ? 'Editar Viaje' : 'Programar Nuevo Viaje' }}</h3>

        <div class="space-y-4 text-zinc-300">
          <div v-if="!isEditing" class="flex items-center gap-2 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/80">
            <input type="checkbox" v-model="isRecurring" id="chkRecur" class="w-4 h-4 bg-zinc-900 border-zinc-700 rounded focus:ring-zinc-600" />
            <label for="chkRecur" class="text-sm font-semibold select-none cursor-pointer">Programación Recurrente (Varios Días)</label>
          </div>

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
            <div v-if="!isRecurring">
              <label class="block text-sm font-medium mb-1">Fecha de Viaje</label>
              <input
                type="date"
                v-model="form.fecha_viaje"
                class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"
              />
            </div>
            
            <template v-else>
              <div>
                <label class="block text-sm font-medium mb-1">Fecha Inicio</label>
                <input type="date" v-model="form.fecha_viaje" class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"/>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Fecha Fin (Max 30 días)</label>
                <input type="date" v-model="form.fecha_fin" class="w-full rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 px-4 py-2"/>
              </div>

              <div class="col-span-2">
                 <label class="block text-sm font-medium mb-2">Días a repetir en el intervalo:</label>
                 <div class="flex flex-wrap gap-4 text-sm mt-1">
                    <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" :value="0" v-model="form.dias_semana"> Lun</label>
                    <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" :value="1" v-model="form.dias_semana"> Mar</label>
                    <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" :value="2" v-model="form.dias_semana"> Mié</label>
                    <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" :value="3" v-model="form.dias_semana"> Jue</label>
                    <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" :value="4" v-model="form.dias_semana"> Vie</label>
                    <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" :value="5" v-model="form.dias_semana"> Sáb</label>
                    <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" :value="6" v-model="form.dias_semana"> Dom</label>
                 </div>
              </div>
            </template>

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
