# core/views.py
from rest_framework import generics, permissions, filters, viewsets
from .models import Kategori, Meja, Barang, LaporanKerusakan, JenisBarang
from .serializers import (
    KategoriSerializer, 
    JenisBarangSerializer,
    MejaSerializer,
    BarangSerializer, 
    LaporanKerusakanSerializer,
    LaporanKerusakanCreateSerializer # <-- Pastikan ini ada (dari file serializer)
)

# --- BAGIAN 1: API PUBLIK (Dari Tim Reporting) ---
# Ini yang dipakai oleh ScanPage.jsx (Publik & Anonim)

class BarangListView(generics.ListAPIView):
    """
    [Publik] Mengambil daftar semua barang (GET)
    """
    queryset = Barang.objects.all()
    serializer_class = BarangSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nama_barang', 'kode_barang', 'meja__nama_meja', 'kategori__nama_kategori']
    ordering_fields = ['nama_barang', 'kategori', 'status']

class LaporanKerusakanCreateView(generics.CreateAPIView):
    """
    [Publik] Membuat laporan kerusakan baru (POST)
    """
    queryset = LaporanKerusakan.objects.all()
    serializer_class = LaporanKerusakanCreateSerializer # <-- Pakai resep 'Create'
    permission_classes = [permissions.AllowAny]

# --- BAGIAN 2: API ADMIN (Dari branch 'main') ---
# Ini yang dipakai oleh AdminDashboard.jsx (Wajib Login)

class KategoriViewSet(viewsets.ModelViewSet):
    """
    [Admin] CRUD (Create, Read, Update, Delete) untuk Kategori
    """
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [permissions.IsAuthenticated] # <-- WAJIB LOGIN

class JenisBarangViewSet(viewsets.ModelViewSet):
    queryset = JenisBarang.objects.all()
    serializer_class = JenisBarangSerializer
    permission_classes = [permissions.IsAuthenticated]


class MejaViewSet(viewsets.ModelViewSet):
    """
    [Admin] CRUD (Create, Read, Update, Delete) untuk Meja
    """
    queryset = Meja.objects.all()
    serializer_class = MejaSerializer
    permission_classes = [permissions.IsAuthenticated] # <-- WAJIB LOGIN

class BarangViewSet(viewsets.ModelViewSet):
    """
    [Admin] CRUD (Create, Read, Update, Delete) untuk Barang
    """
    queryset = Barang.objects.all()
    serializer_class = BarangSerializer # <-- Admin bisa pakai resep ini
    permission_classes = [permissions.IsAuthenticated] # <-- WAJIB LOGIN

class LaporanKerusakanViewSet(viewsets.ModelViewSet):
    """
    [Admin] CRUD (Create, Read, Update, Delete) untuk Laporan
    """
    queryset = LaporanKerusakan.objects.all()
    serializer_class = LaporanKerusakanSerializer # <-- Pakai resep LENGKAP
    permission_classes = [permissions.IsAuthenticated] # <-- WAJIB LOGIN
