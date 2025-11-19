from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    KategoriViewSet, JenisBarangViewSet, MejaViewSet,
    BarangViewSet, LaporanKerusakanViewSet, BarangLogViewSet
)

router = DefaultRouter()

router.register('kategori', KategoriViewSet)
router.register('jenis-barang', JenisBarangViewSet)
router.register('meja', MejaViewSet)
router.register('barang', BarangViewSet)
router.register('laporan', LaporanKerusakanViewSet)
router.register('barang-log', BarangLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
