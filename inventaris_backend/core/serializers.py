# core/serializers.py
from rest_framework import serializers
from .models import Barang, Kategori, Meja, LaporanKerusakan

class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = ['nama_kategori']

class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = ['nama_meja', 'lokasi']

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

# 🔹 ini revisinya
class LaporanKerusakanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaporanKerusakan
        fields = ['meja', 'deskripsi']
