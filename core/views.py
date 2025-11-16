# core/views.py
from rest_framework import generics, permissions, filters
from .models import Barang, LaporanKerusakan
from .serializers import BarangSerializer, LaporanKerusakanCreateSerializers

class BarangListView(generics.ListAPIView):
    queryset = Barang.objects.all()
    serializer_class = BarangSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nama_barang', 'kode_barang', 'meja__nama_meja', 'kategori__nama_kategori']
    ordering_fields = ['nama_barang', 'kategori', 'status']

# 🔹 Tini revisinya
class LaporanKerusakanCreateView(generics.CreateAPIView):
    queryset = LaporanKerusakan.objects.all()
    serializer_class = LaporanKerusakanCreateSerializers
    permission_classes = [permissions.AllowAny]
