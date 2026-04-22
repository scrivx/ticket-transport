from django.contrib import admin

from .models import (
    Asiento, AsientoViaje, Ciudad, Conductor,
    Horario, Pasajero, Reserva, Ruta, Ticket, Venta, Vehiculo, Viaje,
)


@admin.register(Pasajero)
class PasajeroAdmin(admin.ModelAdmin):
    list_display = ('nombres', 'apellidos', 'tipo_documento', 'numero_documento', 'telefono', 'estado')
    search_fields = ('numero_documento', 'nombres', 'apellidos')
    list_filter = ('tipo_documento', 'estado')


@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ('placa', 'tipo', 'capacidad', 'marca', 'modelo', 'estado')
    list_filter = ('tipo', 'estado')
    search_fields = ('placa',)


@admin.register(Conductor)
class ConductorAdmin(admin.ModelAdmin):
    list_display = ('nombres', 'apellidos', 'licencia', 'telefono', 'estado')
    search_fields = ('licencia', 'nombres', 'apellidos')
    list_filter = ('estado',)


@admin.register(Ciudad)
class CiudadAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'departamento')
    search_fields = ('nombre', 'departamento')


@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
    list_display = ('origen', 'destino', 'distancia_km', 'estado')
    list_filter = ('estado',)


@admin.register(Horario)
class HorarioAdmin(admin.ModelAdmin):
    list_display = ('hora_salida', 'hora_llegada_estimada')


@admin.register(Viaje)
class ViajeAdmin(admin.ModelAdmin):
    list_display = ('ruta', 'fecha_viaje', 'conductor', 'vehiculo', 'precio_base', 'estado')
    list_filter = ('estado', 'fecha_viaje')
    search_fields = ('ruta__origen__nombre', 'ruta__destino__nombre')
    date_hierarchy = 'fecha_viaje'


@admin.register(Asiento)
class AsientoAdmin(admin.ModelAdmin):
    list_display = ('vehiculo', 'numero')
    list_filter = ('vehiculo',)


@admin.register(AsientoViaje)
class AsientoViajeAdmin(admin.ModelAdmin):
    list_display = ('viaje', 'asiento', 'estado')
    list_filter = ('estado',)


@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha_venta', 'total', 'metodo_pago', 'estado', 'usuario')
    list_filter = ('estado', 'metodo_pago')
    date_hierarchy = 'fecha_venta'


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'pasajero', 'viaje', 'precio_final', 'estado')
    list_filter = ('estado',)
    search_fields = ('codigo', 'pasajero__numero_documento')


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ('id', 'pasajero', 'asiento_viaje', 'fecha_reserva', 'estado')
    list_filter = ('estado',)
