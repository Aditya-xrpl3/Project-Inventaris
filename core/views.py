# core/views.py
from rest_framework import generics, permissions, filters
from .models import Barang
from .serializers import BarangSerializer

class BarangListView(generics.ListAPIView):
    queryset = Barang.objects.all()
    serializer_class = BarangSerializer

    permission_classes = [permissions.AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nama_barang', 'kode_barang', 'meja__nama_meja', 'kategori__nama_kategori']
    ordering_fields = ['nama_barang', 'kategori', 'status']
