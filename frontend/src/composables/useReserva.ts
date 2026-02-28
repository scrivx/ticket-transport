import { ref, reactive } from 'vue'
import api from '@/services/api'

export function useReserva() {
  const filters = ref({
    fecha: '',
    ruta: ''
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
    if (filters.value.fecha) params.fecha_viaje = filters.value.fecha
    if (filters.value.ruta) params.ruta = filters.value.ruta

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

  const procesarVenta = async (pasajeroData: any) => {
    processing.value = true
    mensaje.value = ''
    SUCCESS.value = false

    try {
      // 1. Registrar pasajero (como invitado o nuevo)
      // Si el pasajero ya existe, el backend devolvería un error por el DNI único.
      // En un flujo real, buscarías por DNI primero. 
      // Por simplicidad para este requerimiento:
      let finalPasajeroId;
      try {
        const { data: pData } = await api.post('/pasajeros/', pasajeroData)
        finalPasajeroId = pData.id
      } catch (e: any) {
        if (e.response?.status === 400) {
            // Probablemente ya existe, en un sistema real buscaríamos el ID.
            // Para propósitos de este ejercicio, asumiremos que si falla es porque ya existe
            // y el usuario debería poder continuar. Pero necesitamos el ID.
            // Vamos a intentar obtenerlo si el error indica duplicado.
            // Por ahora, lanzaremos el error para que el usuario sepa.
            throw new Error('El pasajero ya está registrado o hay un error en los datos.');
        }
        throw e;
      }

      // 2. Procesar venta
      await api.post('/ventas/', {
        viaje_id: selectedViaje.value.id,
        asiento_viaje_id: selectedAsiento.value.id,
        pasajero_id: finalPasajeroId,
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
    buscarViajes,
    seleccionarViaje,
    seleccionarAsiento,
    procesarVenta,
  }
}
