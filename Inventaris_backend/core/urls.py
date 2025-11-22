from rest_framework.routers import DefaultRouter
from .views import (
    KategoriViewSet, JenisBarangViewSet, MejaViewSet,
    BarangViewSet, BarangLogViewSet, LaporanKerusakanViewSet, LaporanCreateView
)
from django.urls import path, include

router = DefaultRouter()
router.register('kategori', KategoriViewSet)
router.register('jenisbarang', JenisBarangViewSet)
router.register('meja', MejaViewSet)
router.register('barang', BarangViewSet)
router.register('baranglog', BarangLogViewSet)
router.register('laporan', LaporanKerusakanViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # public create endpoint (URL: /api/lapor/)
    path('lapor/', LaporanCreateView.as_view(), name='lapor-create'),
]
