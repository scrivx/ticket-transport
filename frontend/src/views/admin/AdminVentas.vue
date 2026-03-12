<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const ventas = ref<any[]>([])
const loading = ref(true)
const activeTab = ref<'PENDIENTES' | 'COMPLETADAS'>('PENDIENTES')

const fetchVentas = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/ventas/')
    // API returns paginated or direct array depending on drf settings, assuming array for now based on other views
    ventas.value = Array.isArray(data) ? data : data.results || []
  } catch (error) {
    console.error('Error fetching ventas:', error)
  } finally {
    loading.value = false
  }
}

const ventasFiltradas = computed(() => {
  if (activeTab.value === 'PENDIENTES') {
    return ventas.value.filter(v => v.estado === 'PENDIENTE')
  }
  return ventas.value.filter(v => v.estado === 'PAGADA')
})

const confirmingId = ref<number | null>(null)

const confirmarPago = async (venta: any) => {
  if (!confirm('¿Seguro que deseas confirmar el pago para esta reserva?')) return
  
  confirmingId.value = venta.id
  try {
    await api.post(`/ventas/${venta.id}/confirmar_pago/`)
    
    // Refresh list
    await fetchVentas()
    
    // Generate WhatsApp link
    enviarTicketWhatsApp(venta)
    
    alert('Pago confirmado y asiento asegurado.')
  } catch (error: any) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al confirmar el pago.')
  } finally {
    confirmingId.value = null
  }
}

const enviarTicketWhatsApp = (venta: any) => {
  if (!venta.tickets_info || venta.tickets_info.length === 0) return
  
  const ticket = venta.tickets_info[0]
  // Asegurate de limpiar el telefono para el formato internacional
  let telefonoUrl = venta.telefono.replace(/\s+/g, '')
  if (!telefonoUrl.startsWith('+')) {
    telefonoUrl = '+51' + telefonoUrl
  }

  const mensaje = `Hola *${venta.pasajero}*, recibimos tu pago con éxito. 🎉\n\n🛫 *Detalles de tu viaje:*\nOrigen: ${venta.origen}\nDestino: ${venta.destino}\nFecha: ${venta.viaje_fecha}\nAsiento: #${ticket.asiento_viaje}\n\n🎫 *Tu Código de Boleto:* ${ticket.codigo}\n\n¡Gracias por preferir Transportes WJL! Preséntate 15 minutos antes con este mensaje.`

  const encodedMsg = encodeURIComponent(mensaje)
  const waLink = `https://wa.me/${telefonoUrl}?text=${encodedMsg}`
  
  // Open in new tab
  window.open(waLink, '_blank')
}

onMounted(() => {
  fetchVentas()
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-8">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-zinc-100">Reservas y Pagos</h1>
        <p class="text-zinc-500">Confirma los vouchers recibidos y emite los boletos finales.</p>
      </div>
    </header>

    <!-- Tabs -->
    <div class="flex border-b border-zinc-800">
      <button 
        class="px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors relative"
        :class="activeTab === 'PENDIENTES' ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'"
        @click="activeTab = 'PENDIENTES'"
      >
        Pendientes
        <span v-if="activeTab === 'PENDIENTES'" class="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500"></span>
      </button>
      <button 
        class="px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors relative"
        :class="activeTab === 'COMPLETADAS' ? 'text-emerald-400' : 'text-zinc-600 hover:text-zinc-400'"
        @click="activeTab = 'COMPLETADAS'"
      >
        Completadas
        <span v-if="activeTab === 'COMPLETADAS'" class="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500"></span>
      </button>
    </div>

    <!-- Lista -->
    <div v-if="loading" class="text-center py-12 text-zinc-500">Cargando datos...</div>
    
    <div v-else-if="ventasFiltradas.length === 0" class="text-center py-16 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
      <p class="text-zinc-500">No hay reservas en esta categoría.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="venta in ventasFiltradas" 
        :key="venta.id"
        class="relative bg-zinc-900/60 border border-zinc-800 rounded-[2rem] p-6 shadow-xl backdrop-blur-sm overflow-hidden"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <span 
              class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border shadow-sm"
              :class="{
                'bg-amber-500/10 text-amber-500 border-amber-500/20': venta.estado === 'PENDIENTE',
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': venta.estado === 'PAGADA'
              }"
            >
              {{ venta.estado }}
            </span>
          </div>
          <span class="text-base font-bold text-zinc-100 border border-zinc-700 bg-zinc-800/50 px-3 py-1 rounded-xl">
             {{ venta.metodo_pago }}
          </span>
        </div>

        <div class="space-y-4">
          <div>
             <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pasajero</p>
             <p class="text-zinc-100 font-bold truncate">{{ venta.pasajero }}</p>
             <p class="text-zinc-400 text-sm flex items-center gap-2 mt-1">
               <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
               {{ venta.telefono }}
             </p>
          </div>

          <div class="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/80 grid grid-cols-2 gap-4">
             <div>
               <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ruta</p>
               <p class="text-zinc-300 text-sm truncate" :title="`${venta.origen} - ${venta.destino}`">{{ venta.origen }} &rarr; {{ venta.destino }}</p>
             </div>
             <div>
               <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Viaje</p>
               <p class="text-zinc-300 text-sm whitespace-nowrap">{{ venta.viaje_fecha }}</p>
             </div>
          </div>
          
          <div class="flex items-center justify-between text-zinc-300">
             <span class="text-sm font-medium">Monto</span>
             <span class="text-xl font-bold">S/ {{ venta.total }}</span>
          </div>
        </div>

        <div class="mt-6">
           <button 
             v-if="venta.estado === 'PENDIENTE'"
             @click="confirmarPago(venta)"
             :disabled="confirmingId === venta.id"
             class="w-full relative overflow-hidden group rounded-2xl bg-indigo-600 bg-opacity-20 border border-indigo-500/50 px-4 py-3 font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <div class="flex items-center justify-center gap-2">
               <span v-if="confirmingId === venta.id">Procesando...</span>
               <template v-else>
                 Validar Voucher &rarr;
               </template>
             </div>
           </button>
           
           <button 
             v-else
             @click="enviarTicketWhatsApp(venta)"
             class="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 px-4 py-3 font-bold text-emerald-500 hover:bg-emerald-500 hover:text-zinc-900 transition-all duration-300"
           >
             <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
             Re-enviar Ticket
           </button>
        </div>
      </div>
    </div>
  </div>
</template>
