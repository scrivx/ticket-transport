from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import (
    AsientoViaje, Ciudad, Conductor, Horario,
    Pasajero, Ruta, Vehiculo, Viaje,
)


class PermissionsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin', email='admin@test.com', password='password123'
        )

        self.ciudad_orig = Ciudad.objects.create(nombre='Lima', departamento='Lima')
        self.ciudad_dest = Ciudad.objects.create(nombre='Cusco', departamento='Cusco')
        self.horario = Horario.objects.create(hora_salida='08:00', hora_llegada_estimada='20:00')
        self.vehiculo = Vehiculo.objects.create(
            placa='ABC-123', tipo='BUS', capacidad=40, marca='Volvo', modelo='B12'
        )
        self.vehiculo.generar_asientos()
        self.conductor = Conductor.objects.create(
            nombres='Juan', apellidos='Perez', licencia='12345678', telefono='999999999'
        )
        self.ruta = Ruta.objects.create(
            origen=self.ciudad_orig, destino=self.ciudad_dest, distancia_km=1100
        )
        self.viaje = Viaje.objects.create(
            ruta=self.ruta,
            vehiculo=self.vehiculo,
            conductor=self.conductor,
            horario=self.horario,
            fecha_viaje='2027-02-10',
            precio_base=100.00,
        )
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
            'tipo_documento': 'DNI',
            'numero_documento': '12345678',
            'nombres': 'Guest',
            'apellidos': 'User',
            'telefono': '987654321',
        }
        response = self.client.post('/api/pasajeros/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_guest_cannot_list_pasajeros(self):
        response = self.client.get('/api/pasajeros/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_guest_cannot_modify_asiento_viaje(self):
        response = self.client.patch(
            f'/api/asientos-viaje/{self.asiento_viaje.id}/',
            {'estado': 'OCUPADO'},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_guest_cannot_create_viaje(self):
        response = self.client.post('/api/viajes/', {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_guest_can_make_booking(self):
        pasajero = Pasajero.objects.create(
            tipo_documento='DNI',
            numero_documento='87654321',
            nombres='Test',
            apellidos='Guest',
        )
        data = {
            'viaje_id': self.viaje.id,
            'pasajero_id': pasajero.id,
            'asiento_viaje_id': self.asiento_viaje.id,
            'metodo_pago': 'YAPE',
        }
        response = self.client.post('/api/ventas/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        from .models import Venta
        venta = Venta.objects.get(id=response.data['venta_id'])
        self.assertIsNone(venta.usuario)
        self.assertEqual(venta.estado, 'PENDIENTE')

    def test_booking_fails_for_nonexistent_viaje(self):
        pasajero = Pasajero.objects.create(
            tipo_documento='DNI', numero_documento='11111111',
            nombres='Test', apellidos='Fail',
        )
        data = {
            'viaje_id': 99999,
            'pasajero_id': pasajero.id,
            'asiento_viaje_id': self.asiento_viaje.id,
            'metodo_pago': 'EFECTIVO',
        }
        response = self.client.post('/api/ventas/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_fails_if_seat_not_in_viaje(self):
        viaje2 = Viaje.objects.create(
            ruta=self.ruta,
            vehiculo=self.vehiculo,
            conductor=self.conductor,
            horario=self.horario,
            fecha_viaje='2027-03-01',
            precio_base=100.00,
        )
        pasajero = Pasajero.objects.create(
            tipo_documento='DNI', numero_documento='22222222',
            nombres='Test', apellidos='Cross',
        )
        data = {
            'viaje_id': viaje2.id,
            'pasajero_id': pasajero.id,
            'asiento_viaje_id': self.asiento_viaje.id,  # belongs to viaje, not viaje2
            'metodo_pago': 'EFECTIVO',
        }
        response = self.client.post('/api/ventas/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
