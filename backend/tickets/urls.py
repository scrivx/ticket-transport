from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CiudadViewSet, VehiculoViewSet, ConductorViewSet,
    RutaViewSet, HorarioViewSet, ViajeViewSet,
    AsientoViajeViewSet, VentaViewSet
)

router = DefaultRouter()
router.register(r'ciudades', CiudadViewSet)
router.register(r'vehiculos', VehiculoViewSet)
router.register(r'conductores', ConductorViewSet)
router.register(r'rutas', RutaViewSet)
router.register(r'horarios', HorarioViewSet)
router.register(r'viajes', ViajeViewSet)
router.register(r'asientos-viaje', AsientoViajeViewSet)
router.register(r'ventas', VentaViewSet, basename='ventas')

urlpatterns = [
    path('', include(router.urls)),
]
