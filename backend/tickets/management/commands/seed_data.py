from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from tickets.models import Ciudad, Vehiculo, Conductor, Ruta, Horario, Viaje, Pasajero
from django.utils import timezone
import datetime

class Command(BaseCommand):
    help = 'Carga datos iniciales de prueba para el sistema de transportes'

    def handle(self, *args, **options):
        # 1. Crear Superusuario si no existe
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Superusuario admin creado (pass: admin123)'))

        # 2. Ciudades
        lim = Ciudad.objects.get_or_create(nombre='Lima', departamento='Lima')[0]
        ica = Ciudad.objects.get_or_create(nombre='Ica', departamento='Ica')[0]
        nasca = Ciudad.objects.get_or_create(nombre='Nasca', departamento='Ica')[0]

        # 3. Vehículos
        v1 = Vehiculo.objects.get_or_create(
            placa='ABC-123', 
            defaults={'tipo': 'BUS', 'capacidad': 10, 'marca': 'Mercedes', 'modelo': 'Sprinter'}
        )[0]
        # Generar asientos si no existen
        v1.generar_asientos()

        # 4. Conductor
        c1 = Conductor.objects.get_or_create(
            licencia='Q12345678', 
            defaults={'nombres': 'Juan', 'apellidos': 'Perez', 'telefono': '987654321'}
        )[0]

        # 5. Pasajero demo
        Pasajero.objects.get_or_create(
            numero_documento='12345678',
            defaults={'tipo_documento': 'DNI', 'nombres': 'Pasajero', 'apellidos': 'Prueba'}
        )

        # 6. Ruta
        r1 = Ruta.objects.get_or_create(origen=lim, destino=ica, defaults={'distancia_km': 300})[0]

        # 7. Horario
        h1 = Horario.objects.get_or_create(
            hora_salida=datetime.time(8, 0), 
            defaults={'hora_llegada_estimada': datetime.time(12, 0)}
        )[0]

        # 8. Viaje
        Viaje.objects.get_or_create(
            ruta=r1,
            vehiculo=v1,
            conductor=c1,
            horario=h1,
            fecha_viaje=timezone.now().date() + datetime.timedelta(days=1),
            defaults={'precio_base': 50.0}
        )

        self.stdout.write(self.style.SUCCESS('Datos de prueba cargados con éxito'))
