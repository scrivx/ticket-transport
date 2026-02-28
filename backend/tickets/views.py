from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Ciudad, Vehiculo, Conductor, Ruta, Horario, 
    Viaje, AsientoViaje, Venta, Pasajero
)
from .serializers import (
    CiudadSerializer, VehiculoSerializer, ConductorSerializer,
    RutaSerializer, HorarioSerializer, ViajeSerializer,
    AsientoViajeSerializer, VentaCreateSerializer, PasajeroSerializer,
    MyTokenObtainPairSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

class PasajeroViewSet(ModelViewSet):
    queryset = Pasajero.objects.all()
    serializer_class = PasajeroSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

class CiudadViewSet(ModelViewSet):
    queryset = Ciudad.objects.all()
    serializer_class = CiudadSerializer
    permission_classes = [IsAdminUser]

class VehiculoViewSet(ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    permission_classes = [IsAdminUser]

class ConductorViewSet(ModelViewSet):
    queryset = Conductor.objects.all()
    serializer_class = ConductorSerializer
    permission_classes = [IsAdminUser]

class RutaViewSet(ModelViewSet):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer
    permission_classes = [IsAdminUser]

class HorarioViewSet(ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [IsAdminUser]

class ViajeViewSet(ModelViewSet):
    queryset = Viaje.objects.all().order_by('fecha_viaje', 'horario__hora_salida')
    serializer_class = ViajeSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ruta', 'fecha_viaje']

class AsientoViajeViewSet(ModelViewSet):
    queryset = AsientoViaje.objects.all().order_by('asiento__numero')
    serializer_class = AsientoViajeSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['viaje', 'estado']

class VentaViewSet(GenericViewSet):
    permission_classes = [AllowAny]
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
