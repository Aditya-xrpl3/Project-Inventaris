from rest_framework import serializers
from .models import (
    Barang, Kategori, Meja, JenisBarang,
    LaporanKerusakan, BarangLog
)

# ----------- KATEGORI -----------
class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = '__all__'


# ----------- JENIS BARANG -----------
class JenisBarangSerializer(serializers.ModelSerializer):
    kategori = serializers.StringRelatedField()

    class Meta:
        model = JenisBarang
        fields = '__all__'


# ----------- MEJA -----------
class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = '__all__'


# ----------- BARANG (UNTUK ADMIN / GET) -----------
class BarangSerializer(serializers.ModelSerializer):
    jenis = serializers.StringRelatedField()
    meja = serializers.StringRelatedField()

    class Meta:
        model = Barang
        fields = [
            'id',
            'kode_barang',
            'nama_barang',
            'status_barang',
            'jenis',
            'meja',
            'created_at',
            'updated_at'
        ]


# ----------- LAPORAN KERUSAKAN (POST - PUBLIC) -----------
class LaporanKerusakanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaporanKerusakan
        fields = ['barang', 'deskripsi', 'foto_url']


# ----------- LAPORAN KERUSAKAN (ADMIN - GET ALL) -----------
class LaporanKerusakanSerializer(serializers.ModelSerializer):
    barang = serializers.StringRelatedField()

    class Meta:
        model = LaporanKerusakan
        fields = '__all__'
