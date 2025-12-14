# core/urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    KategoriViewSet,
    JenisBarangViewSet,
    MejaViewSet,
    BarangViewSet,
    BarangLogViewSet,
    LaporanKerusakanViewSet,
    LaporanCreateView,
    barang_public_detail
)

# -------------------------
# Router untuk ViewSet
# -------------------------
router = DefaultRouter()
router.register('kategori', KategoriViewSet, basename='kategori')
router.register('jenisbarang', JenisBarangViewSet, basename='jenisbarang')
router.register('meja', MejaViewSet, basename='meja')
router.register('barang', BarangViewSet, basename='barang')
router.register('baranglog', BarangLogViewSet, basename='baranglog')
router.register('laporan', LaporanKerusakanViewSet, basename='laporan')

# -------------------------
# URL Patterns
# -------------------------
urlpatterns = [
    path('', include(router.urls)),  # Semua route CRUD otomatis
    path('lapor/', LaporanCreateView.as_view(), name='lapor-create'),  # Create laporan kerusakan
    path('barang-public/<int:pk>/', barang_public_detail, name='barang-public-detail'),  # Public QR
]
