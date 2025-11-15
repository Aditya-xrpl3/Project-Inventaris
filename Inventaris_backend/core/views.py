from rest_framework import generics, permissions
from .permissions import UserAnonCanCreate # fungsinya agar user tidak perlu login untuk POST
# Create your views here.

from rest_framework import viewsets
from .models import Kategori, Meja, Barang, LaporanKerusakan
from .serializers import (
    KategoriSerializer, MejaSerializer,
    BarangSerializer, LaporanKerusakanSerializer
)

class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [UserAnonCanCreate]


class MejaViewSet(viewsets.ModelViewSet):
    queryset = Meja.objects.all()
    serializer_class = MejaSerializer
    permission_classes = [UserAnonCanCreate]


class BarangViewSet(viewsets.ModelViewSet):
    queryset = Barang.objects.all()
    serializer_class = BarangSerializer
    permission_classes = [UserAnonCanCreate]


class LaporanKerusakanViewSet(viewsets.ModelViewSet):
    queryset = LaporanKerusakan.objects.all()
    serializer_class = LaporanKerusakanSerializer
    permission_classes = [UserAnonCanCreate]


