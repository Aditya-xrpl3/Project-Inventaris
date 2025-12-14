# core/views.py

from rest_framework import viewsets, status
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
    IsAdminUser
)
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.generics import CreateAPIView
from django.http import HttpResponse

from .models import (
    Kategori, JenisBarang, Meja,
    Barang, BarangLog, LaporanKerusakan
)
from .serializers import (
    KategoriSerializer,
    JenisBarangSerializer,
    MejaSerializer,
    MejaDetailSerializer,
    BarangSerializer,
    BarangCreateUpdateSerializer,
    BarangLogSerializer,
    LaporanKerusakanCreateSerializer,
    LaporanKerusakanSerializer
)
from .utils import generate_qr_for_barang
from .permissions import LaporanPermission


# =========================
# HEALTH CHECK
# =========================
def home(request):
    return HttpResponse("Inventaris API running")


# =========================
# ADMIN CRUD
# =========================
class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class JenisBarangViewSet(viewsets.ModelViewSet):
    queryset = JenisBarang.objects.select_related("kategori")
    serializer_class = JenisBarangSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class MejaViewSet(viewsets.ModelViewSet):
    queryset = Meja.objects.all()
    serializer_class = MejaSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return MejaDetailSerializer
        return MejaSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()


class BarangViewSet(viewsets.ModelViewSet):
    """
    ADMIN ONLY
    """
    queryset = Barang.objects.select_related("jenis", "meja")
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return BarangCreateUpdateSerializer
        return BarangSerializer

    def perform_create(self, serializer):
        barang = serializer.save()

        # ✅ FIX: pakai self.request
        public_url = self.request.build_absolute_uri(
            f"/api/barang-public/{barang.id}/"
        )
        generate_qr_for_barang(barang, public_url)

    def perform_update(self, serializer):
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

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAuthenticated, IsAdminUser],
        url_path="regenerate_qr"
    )
    def regenerate_qr(self, request, pk=None):
        barang = self.get_object()

        public_url = request.build_absolute_uri(
            f"/api/barang-public/{barang.id}/"
        )

        generate_qr_for_barang(barang, public_url)

        return Response({
            "message": "QR berhasil dibuat ulang",
            "qr_image": request.build_absolute_uri(barang.qr_image.url),
            "qr_target": public_url
        })


class BarangLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BarangLog.objects.select_related(
        "barang", "lokasi_awal", "lokasi_akhir", "user"
    )
    serializer_class = BarangLogSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


# =========================
# PUBLIC SCAN (QR)
# =========================
@api_view(["GET"])
@permission_classes([AllowAny])
def barang_public_detail(request, pk):
    try:
        barang = Barang.objects.select_related("jenis", "meja").get(pk=pk)
    except Barang.DoesNotExist:
        return Response(
            {"detail": "Barang tidak ditemukan"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = BarangSerializer(barang)
    return Response(serializer.data)


# =========================
# LAPORAN KERUSAKAN
# =========================
class LaporanCreateView(CreateAPIView):
    serializer_class = LaporanKerusakanCreateSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(user=None)


class LaporanKerusakanViewSet(viewsets.ModelViewSet):
    queryset = LaporanKerusakan.objects.select_related("barang", "user").all()
    serializer_class = LaporanKerusakanSerializer
    permission_classes = [LaporanPermission]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status_laporan=status_param)
        return qs


    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsAdminUser],
        url_path="status"
    )
    def change_status(self, request, pk=None):
        laporan = self.get_object()
        status_val = request.data.get("status_laporan")

        if status_val not in dict(LaporanKerusakan.Status.choices):
            return Response(
                {"detail": "Status tidak valid"},
                status=status.HTTP_400_BAD_REQUEST
            )

        laporan.status_laporan = status_val
        laporan.save()

        return Response({
            "message": "Status laporan diperbarui",
            "status": laporan.status_laporan
        })

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path="saya"
    )
    def saya(self, request):
        laporan = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(laporan, many=True)
        return Response(serializer.data)
