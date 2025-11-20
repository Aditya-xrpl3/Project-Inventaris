from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register('kategori', KategoriViewSet)
router.register('jenisbarang', JenisBarangViewSet)
router.register('meja', MejaViewSet)
router.register('barang', BarangViewSet)
router.register('baranglog', BarangLogViewSet)
router.register('laporan', LaporanKerusakanViewSet)

urlpatterns = router.urls
