import { ref, reactive } from 'vue'
import api from '@/services/api'

export function useReserva() {
  const filters = reactive({
    fecha: '',
  })

  const viajes = ref<any[]>([])
  const asientos = ref<any[]>([])

  const selectedViaje = ref<any | null>(null)
  const selectedAsiento = ref<any | null>(null)

  const loadingAsientos = ref(false)
  const processing = ref(false)

  const mensaje = ref('')
  const SUCCESS = ref(false)

  // demo
  const pasajeroId = ref(1)
  const metodoPago = ref('EFECTIVO')

  const buscarViajes = async () => {
    const params: any = {}
    if (filters.fecha) params.fecha_viaje = filters.fecha

    const { data } = await api.get('/viajes/', { params })
    viajes.value = data

    selectedViaje.value = null
    selectedAsiento.value = null
    asientos.value = []
  }

  const seleccionarViaje = async (viaje: any) => {
    selectedViaje.value = viaje
    selectedAsiento.value = null
    loadingAsientos.value = true

    const { data } = await api.get(`/asientos-viaje/?viaje=${viaje.id}`)
    asientos.value = data

    loadingAsientos.value = false
  }

  const seleccionarAsiento = (asiento: any) => {
    if (asiento.estado === 'DISPONIBLE') {
      selectedAsiento.value = asiento
    }
  }

  const procesarVenta = async () => {
    processing.value = true
    mensaje.value = ''
    SUCCESS.value = false

    try {
      await api.post('/ventas/', {
        viaje_id: selectedViaje.value.id,
        asiento_viaje_id: selectedAsiento.value.id,
        pasajero_id: pasajeroId.value,
        metodo_pago: metodoPago.value,
      })

      mensaje.value = '✅ Venta realizada con éxito'
      SUCCESS.value = true

      await seleccionarViaje(selectedViaje.value)
    } catch (error) {
      mensaje.value = '❌ Error al procesar la venta'
    } finally {
      processing.value = false
    }
  }

  return {
    filters,
    viajes,
    asientos,
    selectedViaje,
    selectedAsiento,
    loadingAsientos,
    processing,
    mensaje,
    SUCCESS,
    metodoPago,
    pasajeroId,
    buscarViajes,
    seleccionarViaje,
    seleccionarAsiento,
    procesarVenta,
  }
}
