from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.generics import CreateAPIView

from .models import (
    Kategori, JenisBarang, Meja,
    Barang, BarangLog, LaporanKerusakan
)
from .serializers import (
    KategoriSerializer, JenisBarangSerializer,
    MejaSerializer, BarangSerializer, BarangCreateUpdateSerializer,
    BarangLogSerializer, LaporanKerusakanCreateSerializer, LaporanKerusakanSerializer
)
from .services import QRService
from .permissions import LaporanPermission

# --- MASTER DATA VIEWSETS ---

class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class JenisBarangViewSet(viewsets.ModelViewSet):
    # Select related biar query ringan saat ambil nama kategori
    queryset = JenisBarang.objects.select_related("kategori")
    serializer_class = JenisBarangSerializer
    # Gunakan IsAuthenticated agar user login bisa lihat dropdown
    permission_classes = [IsAuthenticated] 

class MejaViewSet(viewsets.ModelViewSet):
    queryset = Meja.objects.all()
    serializer_class = MejaSerializer
    permission_classes = [IsAuthenticated] # Boleh diakses staff untuk lihat daftar meja

# --- BARANG VIEWSET (CORE) ---

class BarangViewSet(viewsets.ModelViewSet):
    queryset = Barang.objects.select_related("jenis", "meja")
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        # Kalau mau Create/Update pakai serializer yang terima ID
        if self.action in ["create", "update", "partial_update"]:
            return BarangCreateUpdateSerializer
        # Kalau cuma lihat list, pakai serializer yang detail
        return BarangSerializer

    def perform_create(self, serializer):
        barang = serializer.save()
        # Generate QR otomatis setelah save
        public_url = self.request.build_absolute_uri(f"/barang-public/{barang.id}")
        # Jika front end terpisah (misal localhost:5173), sebaiknya gunakan setting URL frontend
        # Untuk saat ini kita simulasikan URL public frontend:
        frontend_url = f"http://localhost:5173/barang-public/{barang.id}"
        QRService.generate_qr_for_barang(barang, frontend_url)

    def perform_update(self, serializer):
        # Logic update lokasi & catat log
        instance = self.get_object()
        old_meja = instance.meja
        barang = serializer.save()

        if old_meja != barang.meja:
            BarangLog.objects.create(
                barang=barang,
                lokasi_awal=old_meja,
                lokasi_akhir=barang.meja,
                user=self.request.user
            )

    @action(detail=True, methods=["post"], url_path="regenerate_qr")
    def regenerate_qr(self, request, pk=None):
        barang = self.get_object()
        # Gunakan URL Frontend
        frontend_url = f"http://localhost:5173/barang-public/{barang.id}"
        QRService.generate_qr_for_barang(barang, frontend_url)
        return Response({"message": "QR berhasil dibuat ulang", "url": barang.qr_image.url})

# --- LOG & LAPORAN ---

class BarangLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BarangLog.objects.select_related("barang", "lokasi_awal", "lokasi_akhir", "user")
    serializer_class = BarangLogSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

@api_view(["GET"])
@permission_classes([AllowAny])
def barang_public_detail(request, pk):
    try:
        barang = Barang.objects.select_related("jenis", "meja").get(pk=pk)
    except Barang.DoesNotExist:
        return Response({"detail": "Barang tidak ditemukan"}, status=404)
    return Response(BarangSerializer(barang).data)

class LaporanCreateView(CreateAPIView):
    serializer_class = LaporanKerusakanCreateSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        # User null jika anonymous lapor via QR
        serializer.save(user=self.request.user if self.request.user.is_authenticated else None)

class LaporanKerusakanViewSet(viewsets.ModelViewSet):
    queryset = LaporanKerusakan.objects.select_related("barang", "user").all()
    serializer_class = LaporanKerusakanSerializer
    permission_classes = [LaporanPermission]

    @action(detail=True, methods=["patch"], permission_classes=[IsAdminUser], url_path="status")
    def change_status(self, request, pk=None):
        laporan = self.get_object()
        laporan.status_laporan = request.data.get("status_laporan", laporan.status_laporan)
        laporan.save()
        return Response(self.get_serializer(laporan).data)

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_barang = Barang.objects.count()
        barang_rusak = Barang.objects.filter(status_barang=Barang.Status.RUSAK).count()
        barang_tersedia = Barang.objects.filter(status_barang=Barang.Status.TERSEDIA).count()

        # Ambil 5 laporan terbaru
        recent_laporan_qs = LaporanKerusakan.objects.select_related('barang').order_by('-created_at')[:5]
        # Manual serialize simpe saja untuk dashboard
        recent_laporan = []
        for lap in recent_laporan_qs:
            recent_laporan.append({
                "id": lap.id,
                "barang_nama": lap.barang.nama_barang,
                "deskripsi": lap.deskripsi,
                "status": lap.status_laporan,
                "created_at": lap.created_at,
                "lokasi": lap.barang.meja.nama_meja if lap.barang.meja else "Gudang"
            })

        return Response({
            "total_barang": total_barang,
            "barang_rusak": barang_rusak,
            "barang_tersedia": barang_tersedia,
            "recent_laporan": recent_laporan
        })