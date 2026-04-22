from datetime import datetime, timedelta

from django.db.models import Sum
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import (
    Ciudad, Conductor, Horario, Pasajero,
    Ruta, Vehiculo, Viaje, AsientoViaje, Venta,
)
from .serializers import (
    CiudadSerializer, ConductorSerializer, HorarioSerializer,
    MyTokenObtainPairSerializer, PasajeroSerializer, RutaSerializer,
    VehiculoSerializer, ViajeSerializer, AsientoViajeSerializer,
    VentaCreateSerializer, VentaListSerializer,
)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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
    queryset = Ruta.objects.select_related('origen', 'destino').order_by('id')
    serializer_class = RutaSerializer
    permission_classes = [IsAdminUser]


class HorarioViewSet(ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [IsAdminUser]


class ViajeViewSet(ModelViewSet):
    queryset = Viaje.objects.all()  # required by router for basename detection
    serializer_class = ViajeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ruta', 'fecha_viaje', 'estado']

    def get_queryset(self):
        return Viaje.objects.select_related(
            'ruta__origen', 'ruta__destino',
            'vehiculo', 'conductor', 'horario',
        ).order_by('fecha_viaje', 'horario__hora_salida')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

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
            return Response(
                {"error": "Faltan datos requeridos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(dias_semana, list) or not all(
            isinstance(d, int) and 0 <= d <= 6 for d in dias_semana
        ):
            return Response(
                {"error": "dias_semana debe ser una lista de enteros entre 0 (lunes) y 6 (domingo)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            precio_base = float(precio_base)
            if precio_base <= 0:
                raise ValueError
        except (TypeError, ValueError):
            return Response(
                {"error": "precio_base debe ser un número positivo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            fecha_inicio = datetime.strptime(fecha_inicio_str, '%Y-%m-%d').date()
            fecha_fin = datetime.strptime(fecha_fin_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Formato de fecha inválido. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if fecha_inicio > fecha_fin:
            return Response(
                {"error": "fecha_inicio no puede ser mayor a fecha_fin."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (fecha_fin - fecha_inicio).days > 31:
            return Response(
                {"error": "El rango no puede ser mayor a 31 días."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            ruta = Ruta.objects.get(id=ruta_id)
            vehiculo = Vehiculo.objects.get(id=vehiculo_id)
            conductor = Conductor.objects.get(id=conductor_id)
            horario = Horario.objects.get(id=horario_id)
        except (Ruta.DoesNotExist, Vehiculo.DoesNotExist, Conductor.DoesNotExist, Horario.DoesNotExist) as e:
            return Response(
                {"error": f"Referencia inválida: {e.__class__.__name__}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        current_date = fecha_inicio
        viajes_creados = 0
        while current_date <= fecha_fin:
            if current_date.weekday() in dias_semana:
                _, created = Viaje.objects.get_or_create(
                    ruta=ruta,
                    vehiculo=vehiculo,
                    horario=horario,
                    fecha_viaje=current_date,
                    defaults={
                        'conductor': conductor,
                        'precio_base': precio_base,
                    },
                )
                if created:
                    viajes_creados += 1
            current_date += timedelta(days=1)

        return Response(
            {"mensaje": f"{viajes_creados} viajes programados exitosamente."},
            status=status.HTTP_201_CREATED,
        )


class AsientoViajeViewSet(ModelViewSet):
    queryset = AsientoViaje.objects.all()  # required by router for basename detection
    serializer_class = AsientoViajeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['viaje', 'estado']

    def get_queryset(self):
        return AsientoViaje.objects.select_related(
            'asiento', 'viaje'
        ).order_by('asiento__numero')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class VentaViewSet(ModelViewSet):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['estado']

    def get_queryset(self):
        qs = Venta.objects.order_by('-fecha_venta')
        if self.action == 'list':
            return qs.prefetch_related(
                'tickets__viaje__ruta__origen',
                'tickets__viaje__ruta__destino',
                'tickets__pasajero',
                'tickets__asiento_viaje__asiento',
            )
        return qs

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'create':
            return VentaCreateSerializer
        return VentaListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        venta = serializer.save()

        return Response(
            {
                "venta_id": venta.id,
                "total": venta.total,
                "mensaje": "Reserva creada. Pendiente de confirmación de pago."
                if venta.estado == 'PENDIENTE'
                else "Venta realizada con éxito.",
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def confirmar_pago(self, request, pk=None):
        venta = self.get_object()

        if venta.estado != 'PENDIENTE':
            return Response(
                {"error": "La venta no está pendiente de confirmación."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        venta.estado = 'PAGADA'
        venta.save()

        AsientoViaje.objects.filter(
            ticket__venta=venta, estado='RESERVADO'
        ).update(estado='OCUPADO')

        return Response({"mensaje": "Pago confirmado. Asiento ocupado."})


class DashboardViewSet(GenericViewSet):
    permission_classes = [IsAdminUser]

    def list(self, request):
        hoy = timezone.localdate()

        ventas_totales = Venta.objects.aggregate(total=Sum('total'))['total'] or 0

        ultimas_ventas = Venta.objects.order_by('-fecha_venta')[:5]
        ventas_data = [
            {
                'id': v.id,
                'total': float(v.total),
                'fecha': v.fecha_venta,
                'metodo': v.metodo_pago,
                'estado': v.estado,
            }
            for v in ultimas_ventas
        ]

        return Response({
            'stats': {
                'viajes_hoy': Viaje.objects.filter(fecha_viaje=hoy).count(),
                'ventas_totales': float(ventas_totales),
                'pasajeros': Pasajero.objects.count(),
                'proximos_viajes': Viaje.objects.filter(fecha_viaje__gte=hoy).count(),
            },
            'recent_sales': ventas_data,
        })
