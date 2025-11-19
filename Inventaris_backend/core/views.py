from rest_framework import viewsets
from .models import Kategori, JenisBarang, Meja, Barang, LaporanKerusakan, BarangLog
from .serializers import (
    KategoriSerializer, JenisBarangSerializer, MejaSerializer,
    BarangSerializer, LaporanKerusakanSerializer, BarangLogSerializer
)

class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer


class JenisBarangViewSet(viewsets.ModelViewSet):
    queryset = JenisBarang.objects.all()
    serializer_class = JenisBarangSerializer


class MejaViewSet(viewsets.ModelViewSet):
    queryset = Meja.objects.all()
    serializer_class = MejaSerializer


class BarangViewSet(viewsets.ModelViewSet):
    queryset = Barang.objects.all().select_related('jenis', 'meja')
    serializer_class = BarangSerializer


class LaporanKerusakanViewSet(viewsets.ModelViewSet):
    queryset = LaporanKerusakan.objects.all().select_related('barang')
    serializer_class = LaporanKerusakanSerializer


class BarangLogViewSet(viewsets.ModelViewSet):
    queryset = BarangLog.objects.all().select_related('barang')
    serializer_class = BarangLogSerializer
