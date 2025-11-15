from rest_framework import generics, permissions
from .permissions import UserAnonCanCreate # fungsinya agar user tidak perlu login untuk POST
# Create your views here.

from rest_framework import viewsets
from .models import Kategori, Meja, Barang, PC
from .serializers import (
    KategoriSerializer, MejaSerializer,
    BarangSerializer, PCSerializer
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


class PCViewSet(viewsets.ModelViewSet):
    queryset = PC.objects.all()
    serializer_class = PCSerializer
    permission_classes = [UserAnonCanCreate]
