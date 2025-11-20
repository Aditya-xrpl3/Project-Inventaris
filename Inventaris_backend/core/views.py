# core/views.py
from rest_framework import generics, permissions, filters, viewsets
from .models import Kategori, Meja, Barang, LaporanKerusakan, JenisBarang
from .serializers import (
    KategoriSerializer, 
    JenisBarangSerializer,
    MejaSerializer,
    BarangSerializer,
    BarangCreateUpdateSerializer,
    LaporanKerusakanSerializer,
    LaporanKerusakanCreateSerializer
)

# ================================================================
#  PUBLIC API
# ================================================================

class BarangListView(generics.ListAPIView):
    queryset = Barang.objects.select_related("jenis", "meja", "jenis__kategori")
    serializer_class = BarangSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = [
        "nama_barang",
        "kode_barang",
        "meja__nama_meja",
        "jenis__nama_jenis",
        "jenis__kategori__nama_kategori",
    ]

    ordering_fields = [
        "nama_barang",
        "kode_barang",
        "status_barang",
        "jenis__nama_jenis",
        "meja__nama_meja",
    ]


class LaporanKerusakanCreateView(generics.CreateAPIView):
    queryset = LaporanKerusakan.objects.all()
    serializer_class = LaporanKerusakanCreateSerializer
    permission_classes = [permissions.AllowAny]


# ================================================================
#  ADMIN API (JWT Required)
# ================================================================

class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [permissions.IsAuthenticated]


class JenisBarangViewSet(viewsets.ModelViewSet):
    queryset = JenisBarang.objects.select_related("kategori")
    serializer_class = JenisBarangSerializer
    permission_classes = [permissions.IsAuthenticated]


class MejaViewSet(viewsets.ModelViewSet):
    queryset = Meja.objects.all()
    serializer_class = MejaSerializer
    permission_classes = [permissions.IsAuthenticated]


class BarangViewSet(viewsets.ModelViewSet):
    queryset = Barang.objects.select_related("jenis", "meja")
    permission_classes = [permissions.IsAuthenticated]

    # Admin harus bisa CREATE, UPDATE FK
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return BarangCreateUpdateSerializer
        return BarangSerializer


class LaporanKerusakanViewSet(viewsets.ModelViewSet):
    queryset = LaporanKerusakan.objects.select_related("barang")
    serializer_class = LaporanKerusakanSerializer
    permission_classes = [permissions.IsAuthenticated]
