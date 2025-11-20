# core/serializers.py
from rest_framework import serializers
from .models import (
    Barang, Kategori, Meja, JenisBarang,
    LaporanKerusakan, BarangLog
)

# ------------------- KATEGORI -------------------
class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = '__all__'


# ------------------- JENIS BARANG -------------------
class JenisBarangSerializer(serializers.ModelSerializer):
    kategori_detail = serializers.StringRelatedField(source='kategori', read_only=True)

    class Meta:
        model = JenisBarang
        fields = ['id', 'nama_jenis', 'kategori', 'kategori_detail']


# ------------------- MEJA -------------------
class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = '__all__'


# ------------------- BARANG (GET ONLY / public/admin) -------------------
class BarangSerializer(serializers.ModelSerializer):
    jenis_detail = serializers.StringRelatedField(source='jenis')
    meja_detail = serializers.StringRelatedField(source='meja')
    kategori_detail = serializers.StringRelatedField(source='jenis.kategori')

    class Meta:
        model = Barang
        fields = [
            'id',
            'kode_barang',
            'nama_barang',
            'status_barang',
            'jenis_detail',
            'kategori_detail',
            'meja_detail',
            'created_at',
            'updated_at'
        ]


# ------------------- BARANG (CREATE/UPDATE admin) -------------------
class BarangCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barang
        fields = [
            'kode_barang',
            'nama_barang',
            'status_barang',
            'jenis',
            'meja',
        ]


# ------------------- LAPORAN KERUSAKAN (PUBLIC POST) -------------------
class LaporanKerusakanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaporanKerusakan
        fields = ['barang', 'deskripsi', 'foto_url']


# ------------------- LAPORAN KERUSAKAN (ADMIN) -------------------
class LaporanKerusakanSerializer(serializers.ModelSerializer):
    barang_detail = serializers.StringRelatedField(source='barang')

    class Meta:
        model = LaporanKerusakan
        fields = '__all__'
