from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    KategoriViewSet, MejaViewSet, BarangViewSet,
    PCViewSet,
)

router = DefaultRouter()
router.register('kategori', KategoriViewSet)
router.register('meja', MejaViewSet)
router.register('barang', BarangViewSet)
router.register('pc', PCViewSet)

urlpatterns = [
    path('', include(router.urls)),
]