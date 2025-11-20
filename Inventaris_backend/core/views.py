from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import *
from .serializers import *


class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [IsAuthenticated]


class JenisBarangViewSet(viewsets.ModelViewSet):
    queryset = JenisBarang.objects.select_related('kategori').all()
    serializer_class = JenisBarangSerializer
    permission_classes = [IsAuthenticated]


class MejaViewSet(viewsets.ModelViewSet):
    queryset = Meja.objects.all()
    serializer_class = MejaSerializer
    permission_classes = [IsAuthenticated]


class BarangViewSet(viewsets.ModelViewSet):
    queryset = Barang.objects.select_related('jenis', 'meja').all()
    serializer_class = BarangSerializer
    permission_classes = [IsAuthenticated]


class BarangLogViewSet(viewsets.ModelViewSet):
    queryset = BarangLog.objects.all()
    serializer_class = BarangLogSerializer
    permission_classes = [IsAuthenticated]


class LaporanKerusakanViewSet(viewsets.ModelViewSet):
    queryset = LaporanKerusakan.objects.all()
    serializer_class = LaporanKerusakanSerializer
    permission_classes = [IsAuthenticated]
