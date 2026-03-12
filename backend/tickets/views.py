from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime, timedelta

from .models import (
    Ciudad, Vehiculo, Conductor, Ruta, Horario, 
    Viaje, AsientoViaje, Venta, Pasajero
)
from .serializers import (
    CiudadSerializer, VehiculoSerializer, ConductorSerializer,
    RutaSerializer, HorarioSerializer, ViajeSerializer,
    AsientoViajeSerializer, VentaCreateSerializer, VentaListSerializer, PasajeroSerializer,
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

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def programar_recurrente(self, request):
        data = request.data
        ruta_id = data.get('ruta')
        vehiculo_id = data.get('vehiculo')
        conductor_id = data.get('conductor')
        horario_id = data.get('horario')
        precio_base = data.get('precio_base')
        fecha_inicio_str = data.get('fecha_inicio')
        fecha_fin_str = data.get('fecha_fin')
        dias_semana = data.get('dias_semana', [])

        if not all([ruta_id, vehiculo_id, conductor_id, horario_id, precio_base, fecha_inicio_str, fecha_fin_str]):
            return Response({"error": "Faltan datos requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fecha_inicio = datetime.strptime(fecha_inicio_str, '%Y-%m-%d').date()
            fecha_fin = datetime.strptime(fecha_fin_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Formato de fecha inválido"}, status=status.HTTP_400_BAD_REQUEST)

        if (fecha_fin - fecha_inicio).days > 31:
            return Response({"error": "El rango no puede ser mayor a 31 días"}, status=status.HTTP_400_BAD_REQUEST)

        if fecha_inicio > fecha_fin:
            return Response({"error": "Fecha inicio no puede ser mayor a fecha fin"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ruta = Ruta.objects.get(id=ruta_id)
            vehiculo = Vehiculo.objects.get(id=vehiculo_id)
            conductor = Conductor.objects.get(id=conductor_id)
            horario = Horario.objects.get(id=horario_id)
        except Exception as e:
            return Response({"error": "Estructuras FK inválidas"}, status=status.HTTP_400_BAD_REQUEST)

        current_date = fecha_inicio
        viajes_creados = 0
        while current_date <= fecha_fin:
            if current_date.weekday() in dias_semana:
                if not Viaje.objects.filter(ruta=ruta, vehiculo=vehiculo, horario=horario, fecha_viaje=current_date).exists():
                    Viaje.objects.create(
                        ruta=ruta,
                        vehiculo=vehiculo,
                        conductor=conductor,
                        horario=horario,
                        precio_base=precio_base,
                        fecha_viaje=current_date
                    )
                    viajes_creados += 1
            current_date += timedelta(days=1)
        
        return Response({"mensaje": f"{viajes_creados} viajes programados exitosamente"}, status=status.HTTP_201_CREATED)

class AsientoViajeViewSet(ModelViewSet):
    queryset = AsientoViaje.objects.all().order_by('asiento__numero')
    serializer_class = AsientoViajeSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['viaje', 'estado']

class VentaViewSet(ModelViewSet):
    queryset = Venta.objects.all().order_by('-fecha_venta')
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['estado']

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'create':
            return VentaCreateSerializer
        return VentaListSerializer

    def create(self, request, *args, **kwargs):
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
                "mensaje": "Venta reservada con éxito" if venta.estado == 'PENDIENTE' else "Venta realizada con éxito"
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def confirmar_pago(self, request, pk=None):
        venta = self.get_object()
        
        if venta.estado != 'PENDIENTE':
            return Response({"error": "La venta no está pendiente de confirmación"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Marcar como pagada
        venta.estado = 'PAGADA'
        venta.save()
        
        # Cambiar el asiento de Reservado a Ocupado
        for ticket in venta.tickets.all():
            asiento_viaje = ticket.asiento_viaje
            if asiento_viaje.estado == 'RESERVADO':
                asiento_viaje.estado = 'OCUPADO'
                asiento_viaje.save()
                
        return Response({"mensaje": "Pago confirmado exitosamente y asiendo ocupado"})
from django.db.models import Sum, Count

class DashboardViewSet(GenericViewSet):
    permission_classes = [IsAdminUser]

    def list(self, request):
        viajes_hoy = Viaje.objects.filter(fecha_viaje=datetime.now().date()).count()
        ventas_totales = Venta.objects.aggregate(total=Sum('total'))['total'] or 0
        total_pasajeros = Pasajero.objects.count()
        total_vehiculos = Vehiculo.objects.count()
        
        # Últimas ventas
        ultimas_ventas = Venta.objects.order_by('-fecha_venta')[:5]
        ventas_data = [{
            'id': v.id,
            'total': v.total,
            'fecha': v.fecha_venta,
            'metodo': v.metodo_pago
        } for v in ultimas_ventas]

        return Response({
            'stats': {
                'viajes_hoy': viajes_hoy,
                'ventas_totales': float(ventas_totales),
                'pasajeros': total_pasajeros,
                'proximos_viajes': Viaje.objects.filter(fecha_viaje__gte=datetime.now().date()).count()
            },
            'recent_sales': ventas_data
        })
