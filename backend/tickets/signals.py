from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Viaje, AsientoViaje

@receiver(post_save, sender=Viaje)
def crear_asientos_viaje(sender, instance, created, **kwargs):
    if created:
        vehiculo = instance.vehiculo
        # Asegurarse que el vehículo tenga asientos
        if not vehiculo.asiento_set.exists():
            vehiculo.generar_asientos()
            
        asientos_vehiculo = vehiculo.asiento_set.all()
        asientos_viajes = [
            AsientoViaje(viaje=instance, asiento=asiento, estado='DISPONIBLE')
            for asiento in asientos_vehiculo
        ]
        AsientoViaje.objects.bulk_create(asientos_viajes)
