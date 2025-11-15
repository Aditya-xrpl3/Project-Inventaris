from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    KategoriViewSet, MejaViewSet, BarangViewSet, LaporanKerusakanViewSet,
)

router = DefaultRouter()
router.register('kategori', KategoriViewSet)
router.register('meja', MejaViewSet)
router.register('barang', BarangViewSet)
router.register('laporan', LaporanKerusakanViewSet)

urlpatterns = [
    path('', include(router.urls)),
]