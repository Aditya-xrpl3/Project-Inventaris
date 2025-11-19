# core/serializers.py
from rest_framework import serializers
from .models import Kategori, JenisBarang, Meja, Barang, LaporanKerusakan, BarangLog
from django.contrib.auth.models import User, Group

class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = '__all__'


class JenisBarangSerializer(serializers.ModelSerializer):
    kategori_detail = KategoriSerializer(source='kategori', read_only=True)

    class Meta:
        model = JenisBarang
        fields = ['id', 'kategori', 'kategori_detail', 'nama_jenis']


class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = '__all__'


class BarangSerializer(serializers.ModelSerializer):
    jenis_detail = JenisBarangSerializer(source='jenis', read_only=True)
    meja_detail = MejaSerializer(source='meja', read_only=True)

    class Meta:
        model = Barang
        fields = [
            'id',
            'kode_barang',
            'nama_barang',
            'jenis',
            'jenis_detail',
            'meja',
            'meja_detail',
            'status_barang',
            'created_at',
            'updated_at'
        ]


class LaporanKerusakanSerializer(serializers.ModelSerializer):
    barang_detail = BarangSerializer(source='barang', read_only=True)

    class Meta:
        model = LaporanKerusakan
        fields = '__all__'


class BarangLogSerializer(serializers.ModelSerializer):
    barang_detail = BarangSerializer(source='barang', read_only=True)

    class Meta:
        model = BarangLog
        fields = '__all__'