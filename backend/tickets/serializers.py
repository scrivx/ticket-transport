from rest_framework import serializers
from .models import *
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class PasajeroSerializer(serializers.ModelSerializer):
  class Meta:
    model = Pasajero
    fields = '__all__'

class CiudadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciudad
        fields = '__all__'

class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = '__all__'

class ConductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conductor
        fields = '__all__'

class RutaSerializer(serializers.ModelSerializer):
    origen_nombre = serializers.CharField(source='origen.nombre', read_only=True)
    destino_nombre = serializers.CharField(source='destino.nombre', read_only=True)
    
    class Meta:
        model = Ruta
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'

class ViajeSerializer(serializers.ModelSerializer):
    ruta_info = RutaSerializer(source='ruta', read_only=True)
    vehiculo_placa = serializers.CharField(source='vehiculo.placa', read_only=True)
    horario_hora = serializers.TimeField(source='horario.hora_salida', read_only=True)
    conductor_info = ConductorSerializer(source='conductor', read_only=True)
    
    class Meta:
        model = Viaje
        fields = '__all__'

class AsientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asiento
        fields = '__all__'

class AsientoViajeSerializer(serializers.ModelSerializer):
    numero_asiento = serializers.IntegerField(source='asiento.numero', read_only=True)
    
    class Meta:
        model = AsientoViaje
        fields = '__all__'


class TicketSerializer(serializers.ModelSerializer):
  class Meta:
    model = Ticket
    fields = '__all__'
    read_only_fields = ('codigo', 'estado')


class VentaCreateSerializer(serializers.Serializer):
  viaje_id = serializers.IntegerField()
  pasajero_id = serializers.IntegerField()
  asiento_viaje_id = serializers.IntegerField()
  metodo_pago = serializers.ChoiceField(
      choices=Venta.METODO_PAGO
  )

  def create(self, validated_data):
    user = self.context['request'].user

    with transaction.atomic():
      asiento_viaje = (
        AsientoViaje.objects
        .select_for_update()
        .get(id=validated_data['asiento_viaje_id'])
      )

      if asiento_viaje.estado != 'DISPONIBLE':
        raise serializers.ValidationError(
            'El asiento ya no está disponible'
        )

      viaje = Viaje.objects.get(id=validated_data['viaje_id'])
      pasajero = Pasajero.objects.get(id=validated_data['pasajero_id'])

      # 1️⃣ Crear venta
      venta_data = {
        'metodo_pago': validated_data['metodo_pago'],
        'estado': 'PAGADA',
        'total': 0
      }
      
      if user.is_authenticated:
        venta_data['usuario'] = user

      venta = Venta.objects.create(**venta_data)

      # 2️⃣ Crear ticket
      ticket = Ticket.objects.create(
        venta=venta,
        viaje=viaje,
        pasajero=pasajero,
        asiento_viaje=asiento_viaje,
        precio_final=viaje.precio_base
      )

      # 3️⃣ Ocupar asiento
      asiento_viaje.estado = 'OCUPADO'
      asiento_viaje.save()

      # 4️⃣ Actualizar total
      venta.total = ticket.precio_final
      venta.save()

      return venta

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['username'] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_staff'] = self.user.is_staff
        data['is_superuser'] = self.user.is_superuser
        data['username'] = self.user.username
        return data
