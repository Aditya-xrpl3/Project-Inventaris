# core/serializers.py
from rest_framework import serializers
from .models import Barang, Kategori, Meja, LaporanKerusakan
from django.contrib.auth.models import User, Group

# Serializer untuk Admin mengambil daftar Kategori (untuk dropdown)
class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = '__all__' # Pakai __all__ tidak apa-apa untuk model simpel ini

# Serializer untuk Admin mengambil daftar Meja (untuk dropdown)
class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = '__all__' # Pakai __all__ tidak apa-apa untuk model simpel ini

# Serializer untuk MENAMPILKAN DAFTAR Barang (GET)
# Ini pakai StringRelatedField agar JSON-nya cantik
class BarangSerializer(serializers.ModelSerializer):
    kategori = serializers.StringRelatedField()
    meja = serializers.StringRelatedField()

    class Meta:
        model = Barang
        fields = [
            'id',
            'nama_barang',
            'kode_barang',
            'status',
            'kategori',
            'meja'
        ]

# Serializer untuk MEMBUAT Laporan (POST dari ScanPage)
# Ini HANYA minta apa yang user isi
class LaporanKerusakanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaporanKerusakan
        fields = ['meja', 'deskripsi']

# Serializer untuk MENAMPILKAN Laporan (GET untuk Admin)
class LaporanKerusakanSerializer(serializers.ModelSerializer):
    # Kita pakai StringRelatedField di sini agar Admin
    # bisa lihat nama meja-nya, bukan ID
    meja = serializers.StringRelatedField() 
    
    class Meta:
        model = LaporanKerusakan
        fields = '__all__'
