from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Ciudad, Vehiculo, Conductor, Ruta, Horario, 
    Viaje, AsientoViaje, Venta
)
from .serializers import (
    CiudadSerializer, VehiculoSerializer, ConductorSerializer,
    RutaSerializer, HorarioSerializer, ViajeSerializer,
    AsientoViajeSerializer, VentaCreateSerializer
)

class CiudadViewSet(ModelViewSet):
    queryset = Ciudad.objects.all()
    serializer_class = CiudadSerializer
    permission_classes = [AllowAny] # O IsAuthenticated según requieras

class VehiculoViewSet(ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    permission_classes = [IsAuthenticated]

class ConductorViewSet(ModelViewSet):
    queryset = Conductor.objects.all()
    serializer_class = ConductorSerializer
    permission_classes = [IsAuthenticated]

class RutaViewSet(ModelViewSet):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer
    permission_classes = [IsAuthenticated]

class HorarioViewSet(ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [IsAuthenticated]

class ViajeViewSet(ModelViewSet):
    queryset = Viaje.objects.all().order_by('fecha_viaje', 'horario__hora_salida')
    serializer_class = ViajeSerializer
    permission_classes = [AllowAny] # Permitir ver viajes sin login?
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ruta', 'fecha_viaje']

class AsientoViajeViewSet(ModelViewSet):
    queryset = AsientoViaje.objects.all().order_by('asiento__numero')
    serializer_class = AsientoViajeSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['viaje', 'estado']

class VentaViewSet(GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = VentaCreateSerializer

    def create(self, request):
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        venta = serializer.save()

        return Response(
            {
                "venta_id": venta.id,
                "total": venta.total,
                "mensaje": "Venta realizada con éxito"
            },
            status=status.HTTP_201_CREATED
        )
