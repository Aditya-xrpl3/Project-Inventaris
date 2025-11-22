# core/views.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Kategori, JenisBarang, Meja, Barang, BarangLog, LaporanKerusakan
from .serializers import (
    KategoriSerializer, JenisBarangSerializer, MejaSerializer,
    MejaDetailSerializer,
    BarangSerializer, BarangCreateUpdateSerializer, BarangLogSerializer,
    LaporanKerusakanCreateSerializer, LaporanKerusakanSerializer
)
from .permissions import LaporanPermission
from rest_framework.permissions import IsAdminUser

# ---- Admin CRUD viewsets ----
class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class JenisBarangViewSet(viewsets.ModelViewSet):
    queryset = JenisBarang.objects.select_related('kategori').all()
    serializer_class = JenisBarangSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class MejaViewSet(viewsets.ModelViewSet):
    queryset = Meja.objects.all()
    serializer_class = MejaSerializer
    # allow public retrieval for scanning QR (retrieve), but require admin for create/update/delete
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MejaDetailSerializer
        return MejaSerializer

    def get_permissions(self):
        # public GET /meja/<id>/ for scanning
        if self.action == 'retrieve' or (self.action == 'list' and self.request.method == 'GET'):
            return [AllowAny()]
        return super().get_permissions()

class BarangViewSet(viewsets.ModelViewSet):
    queryset = Barang.objects.select_related('jenis', 'meja').all()
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BarangCreateUpdateSerializer
        return BarangSerializer

    def perform_update(self, serializer):
        # intercept perubahan meja untuk buat BarangLog
        instance = self.get_object()
        old_meja = instance.meja
        new_instance = serializer.save()  # perform actual update
        new_meja = new_instance.meja

        if old_meja != new_meja:
            BarangLog.objects.create(
                barang=new_instance,
                lokasi_awal=old_meja,
                lokasi_akhir=new_meja,
                user=self.request.user if self.request.user.is_authenticated else None
            )

class BarangLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BarangLog.objects.select_related('barang', 'lokasi_awal', 'lokasi_akhir', 'user').all()
    serializer_class = BarangLogSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

# ---- Laporan: Create public, Admin manages ----
from rest_framework.generics import CreateAPIView

class LaporanCreateView(CreateAPIView):
    """
    Public endpoint (AllowAny) to create a report for a barang.
    Anonymous reports: user field left null.
    """
    queryset = LaporanKerusakan.objects.all()
    serializer_class = LaporanKerusakanCreateSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # ensure user is not set by client; set to None for anonymous
        serializer.save(user=None)


class LaporanKerusakanViewSet(viewsets.ModelViewSet):
    # Management of reports. Creation for public is handled by `LaporanCreateView` (AllowAny).
    queryset = LaporanKerusakan.objects.select_related('barang', 'user').all()
    serializer_class = LaporanKerusakanSerializer
    permission_classes = [LaporanPermission]

    # optionally add an action to mark as 'Diproses' or 'Selesai'
    @action(detail=True, methods=['patch'], url_path='status', permission_classes=[IsAdminUser])
    def change_status(self, request, pk=None):
        report = self.get_object()
        status_val = request.data.get('status_laporan')
        if status_val not in dict(LaporanKerusakan.Status.choices):
            return Response({"detail": "Status invalid"}, status=status.HTTP_400_BAD_REQUEST)
        report.status_laporan = status_val
        report.save()
        return Response(self.get_serializer(report).data)

    @action(detail=False, methods=['get'], url_path='saya', permission_classes=[IsAuthenticated])
    def saya(self, request):
        """Return reports created by the authenticated user."""
        user = request.user
        qs = self.get_queryset().filter(user=user)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
