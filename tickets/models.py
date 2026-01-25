from django.contrib.auth.models import User
from django.db import models
import uuid


# =========================
# PASAJEROS
# =========================
class Pasajero(models.Model):
    TIPO_DOC = [
        ('DNI', 'DNI'),
        ('CE', 'Carnet de Extranjería'),
    ]

    tipo_documento = models.CharField(max_length=5, choices=TIPO_DOC)
    numero_documento = models.CharField(max_length=20, unique=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15, blank=True)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"


# =========================
# VEHÍCULOS Y CONDUCTORES
# =========================
class Vehiculo(models.Model):
    TIPO = [
        ('COMBI', 'Combi'),
        ('BUS', 'Bus'),
    ]

    placa = models.CharField(max_length=10, unique=True)
    tipo = models.CharField(max_length=10, choices=TIPO)
    capacidad = models.PositiveIntegerField()
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.placa


class Conductor(models.Model):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    licencia = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=15)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"


# =========================
# CIUDADES Y RUTAS
# =========================
class Ciudad(models.Model):
    nombre = models.CharField(max_length=100)
    departamento = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Ruta(models.Model):
    origen = models.ForeignKey(Ciudad, related_name='rutas_origen', on_delete=models.CASCADE)
    destino = models.ForeignKey(Ciudad, related_name='rutas_destino', on_delete=models.CASCADE)
    distancia_km = models.DecimalField(max_digits=6, decimal_places=2)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.origen} → {self.destino}"


# =========================
# HORARIOS Y VIAJES
# =========================
class Horario(models.Model):
    hora_salida = models.TimeField()
    hora_llegada_estimada = models.TimeField()

    def __str__(self):
        return f"{self.hora_salida}"


class Viaje(models.Model):
    ESTADO = [
        ('PROGRAMADO', 'Programado'),
        ('EN_CURSO', 'En curso'),
        ('FINALIZADO', 'Finalizado'),
        ('CANCELADO', 'Cancelado'),
    ]

    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE)
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE)
    conductor = models.ForeignKey(Conductor, on_delete=models.CASCADE)
    horario = models.ForeignKey(Horario, on_delete=models.CASCADE)
    fecha_viaje = models.DateField()
    precio_base = models.DecimalField(max_digits=8, decimal_places=2)
    estado = models.CharField(max_length=15, choices=ESTADO)

    def __str__(self):
        return f"{self.ruta} | {self.fecha_viaje}"


# =========================
# ASIENTOS
# =========================
class Asiento(models.Model):
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE)
    numero = models.PositiveIntegerField()

    class Meta:
        unique_together = ('vehiculo', 'numero')

    def __str__(self):
        return f"Asiento {self.numero}"


class AsientoViaje(models.Model):
    ESTADO = [
        ('DISPONIBLE', 'Disponible'),
        ('OCUPADO', 'Ocupado'),
        ('RESERVADO', 'Reservado'),
    ]

    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE)
    asiento = models.ForeignKey(Asiento, on_delete=models.CASCADE)
    estado = models.CharField(max_length=15, choices=ESTADO, default='DISPONIBLE')

    class Meta:
        unique_together = ('viaje', 'asiento')

    def __str__(self):
        return f"{self.viaje} - {self.asiento}"


# =========================
# VENTAS
# =========================
class Venta(models.Model):
    ESTADO = [
        ('PAGADA', 'Pagada'),
        ('PENDIENTE', 'Pendiente'),
        ('ANULADA', 'Anulada'),
    ]

    METODO_PAGO = [
        ('EFECTIVO', 'Efectivo'),
        ('YAPE', 'Yape'),
        ('PLIN', 'Plin'),
        ('TARJETA', 'Tarjeta'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_venta = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=8, decimal_places=2)
    metodo_pago = models.CharField(max_length=10, choices=METODO_PAGO)
    estado = models.CharField(max_length=10, choices=ESTADO)

    def __str__(self):
        return f"Venta {self.id}"


# =========================
# TICKETS
# =========================
class Ticket(models.Model):
    ESTADO = [
        ('VENDIDO', 'Vendido'),
        ('USADO', 'Usado'),
        ('ANULADO', 'Anulado'),
    ]

    venta = models.ForeignKey(Venta, related_name='tickets', on_delete=models.CASCADE)
    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE)
    pasajero = models.ForeignKey(Pasajero, on_delete=models.CASCADE)
    asiento_viaje = models.OneToOneField(AsientoViaje, on_delete=models.CASCADE)
    precio_final = models.DecimalField(max_digits=8, decimal_places=2)
    codigo = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    estado = models.CharField(max_length=10, choices=ESTADO)

    def __str__(self):
        return str(self.codigo)


# =========================
# RESERVAS
# =========================
class Reserva(models.Model):
    pasajero = models.ForeignKey(Pasajero, on_delete=models.CASCADE)
    asiento_viaje = models.OneToOneField(AsientoViaje, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"Reserva {self.id}"
