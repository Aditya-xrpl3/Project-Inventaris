from django.urls import path, include
from rest_framework.routers import DefaultRouter
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
# Router Configuration
# -------------------------
router = DefaultRouter()

# Endpoint Admin & Data Master
router.register('kategori', KategoriViewSet, basename='kategori')
router.register('jenisbarang', JenisBarangViewSet, basename='jenisbarang') # React akses ke /api/jenisbarang/
router.register('meja', MejaViewSet, basename='meja')
router.register('barang', BarangViewSet, basename='barang')
router.register('baranglog', BarangLogViewSet, basename='baranglog')
router.register('laporan', LaporanKerusakanViewSet, basename='laporan')

# -------------------------
# URL Patterns
# -------------------------
urlpatterns = [
    path('', include(router.urls)),
    
    # Endpoint Khusus (Non-Router)
    path('lapor/', LaporanCreateView.as_view(), name='lapor-create'),
    path('barang-public/<int:pk>/', barang_public_detail, name='barang-public-detail'),
]