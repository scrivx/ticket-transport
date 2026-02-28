from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Ciudad, Pasajero, Ruta, Horario, Vehiculo, Viaje, Asiento, AsientoViaje

class PermissionsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(username='admin', email='admin@test.com', password='password123')
        self.normal_user = User.objects.create_user(username='user', email='user@test.com', password='password123')
        
        # Setup data
        self.ciudad_orig = Ciudad.objects.create(nombre='Lima', departamento='Lima')
        self.ciudad_dest = Ciudad.objects.create(nombre='Cusco', departamento='Cusco')
        self.horario = Horario.objects.create(hora_salida='08:00', hora_llegada_estimada='20:00')
        self.vehiculo = Vehiculo.objects.create(placa='ABC-123', tipo='BUS', capacidad=40, marca='Volvo', modelo='B12')
        self.vehiculo.generar_asientos()
        self.ruta = Ruta.objects.create(origen=self.ciudad_orig, destino=self.ciudad_dest, distancia_km=1100)
        self.viaje = Viaje.objects.create(
            ruta=self.ruta, vehiculo=self.vehiculo, conductor_id=1, # Assume conductor exists or create one
            horario=self.horario, fecha_viaje='2026-02-10', precio_base=100.00
        )
        # We need a conductor though
        from .models import Conductor
        self.conductor = Conductor.objects.create(nombres='Juan', apellidos='Perez', licencia='12345678', telefono='999999999')
        self.viaje.conductor = self.conductor
        self.viaje.save()
        
        # Ensure AsientoViaje is retrieved (created by signal)
        self.asiento_viaje = AsientoViaje.objects.filter(viaje=self.viaje).first()

    def test_guest_can_list_viajes(self):
        response = self.client.get('/api/viajes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_guest_cannot_list_rutas(self):
        response = self.client.get('/api/rutas/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_list_rutas(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/rutas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_guest_can_create_pasajero(self):
        data = {
            "tipo_documento": "DNI",
            "numero_documento": "12345678",
            "nombres": "Guest",
            "apellidos": "User",
            "telefono": "987654321"
        }
        response = self.client.post('/api/pasajeros/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_guest_cannot_list_pasajeros(self):
        response = self.client.get('/api/pasajeros/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_guest_can_make_booking(self):
        pasajero = Pasajero.objects.create(
            tipo_documento="DNI", numero_documento="87654321", 
            nombres="Test", apellidos="Guest"
        )
        data = {
            "viaje_id": self.viaje.id,
            "pasajero_id": pasajero.id,
            "asiento_viaje_id": self.asiento_viaje.id,
            "metodo_pago": "YAPE"
        }
        response = self.client.post('/api/ventas/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        from .models import Venta
        venta = Venta.objects.get(id=response.data['venta_id'])
        self.assertIsNone(venta.usuario)
