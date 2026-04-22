from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    Asiento, AsientoViaje, Ciudad, Conductor,
    Horario, Pasajero, Ruta, Ticket, Venta, Viaje, Vehiculo,
)


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


class VentaListSerializer(serializers.ModelSerializer):
    tickets_info = TicketSerializer(source='tickets', many=True, read_only=True)
    viaje_fecha = serializers.SerializerMethodField()
    origen = serializers.SerializerMethodField()
    destino = serializers.SerializerMethodField()
    pasajero = serializers.SerializerMethodField()
    telefono = serializers.SerializerMethodField()

    class Meta:
        model = Venta
        fields = [
            'id', 'fecha_venta', 'total', 'metodo_pago', 'estado',
            'tickets_info', 'viaje_fecha', 'origen', 'destino', 'pasajero', 'telefono',
        ]

    def _first_ticket(self, obj):
        # Works efficiently when the viewset prefetches tickets with related objects
        return obj.tickets.all().first()

    def get_viaje_fecha(self, obj):
        ticket = self._first_ticket(obj)
        return ticket.viaje.fecha_viaje if ticket else None

    def get_origen(self, obj):
        ticket = self._first_ticket(obj)
        return ticket.viaje.ruta.origen.nombre if ticket else None

    def get_destino(self, obj):
        ticket = self._first_ticket(obj)
        return ticket.viaje.ruta.destino.nombre if ticket else None

    def get_telefono(self, obj):
        ticket = self._first_ticket(obj)
        return ticket.pasajero.telefono if ticket else None

    def get_pasajero(self, obj):
        ticket = self._first_ticket(obj)
        if ticket and ticket.pasajero:
            return f"{ticket.pasajero.nombres} {ticket.pasajero.apellidos}"
        return None


class VentaCreateSerializer(serializers.Serializer):
    viaje_id = serializers.IntegerField()
    pasajero_id = serializers.IntegerField()
    asiento_viaje_id = serializers.IntegerField()
    metodo_pago = serializers.ChoiceField(choices=Venta.METODO_PAGO)

    def validate(self, attrs):
        try:
            viaje = Viaje.objects.get(id=attrs['viaje_id'])
        except Viaje.DoesNotExist:
            raise serializers.ValidationError({'viaje_id': 'El viaje no existe.'})

        if viaje.estado != 'PROGRAMADO':
            raise serializers.ValidationError(
                {'viaje_id': f'El viaje no está disponible para reservas (estado: {viaje.estado}).'}
            )

        try:
            Pasajero.objects.get(id=attrs['pasajero_id'])
        except Pasajero.DoesNotExist:
            raise serializers.ValidationError({'pasajero_id': 'El pasajero no existe.'})

        try:
            asiento_viaje = AsientoViaje.objects.get(id=attrs['asiento_viaje_id'])
        except AsientoViaje.DoesNotExist:
            raise serializers.ValidationError({'asiento_viaje_id': 'El asiento de viaje no existe.'})

        if asiento_viaje.viaje_id != attrs['viaje_id']:
            raise serializers.ValidationError(
                {'asiento_viaje_id': 'El asiento no pertenece al viaje indicado.'}
            )

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user

        with transaction.atomic():
            asiento_viaje = (
                AsientoViaje.objects
                .select_for_update()
                .get(id=validated_data['asiento_viaje_id'])
            )

            if asiento_viaje.estado != 'DISPONIBLE':
                raise serializers.ValidationError('El asiento ya no está disponible.')

            viaje = Viaje.objects.get(id=validated_data['viaje_id'])
            pasajero = Pasajero.objects.get(id=validated_data['pasajero_id'])

            metodo_pago = validated_data['metodo_pago']
            estado_venta = 'PENDIENTE' if metodo_pago in ['YAPE', 'PLIN'] else 'PAGADA'
            estado_asiento = 'RESERVADO' if estado_venta == 'PENDIENTE' else 'OCUPADO'

            venta_data = {
                'metodo_pago': metodo_pago,
                'estado': estado_venta,
                'total': 0,
            }
            if user.is_authenticated:
                venta_data['usuario'] = user

            venta = Venta.objects.create(**venta_data)

            ticket = Ticket.objects.create(
                venta=venta,
                viaje=viaje,
                pasajero=pasajero,
                asiento_viaje=asiento_viaje,
                precio_final=viaje.precio_base,
            )

            asiento_viaje.estado = estado_asiento
            asiento_viaje.save()

            venta.total = ticket.precio_final
            venta.save()

            return venta


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
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
