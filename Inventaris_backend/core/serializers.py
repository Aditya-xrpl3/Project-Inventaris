from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()


class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = '__all__'


class JenisBarangSerializer(serializers.ModelSerializer):
    kategori = KategoriSerializer(read_only=True)
    kategori_id = serializers.PrimaryKeyRelatedField(
        queryset=Kategori.objects.all(),
        source='kategori',
        write_only=True
    )

    class Meta:
        model = JenisBarang
        fields = ['id', 'nama_jenis', 'kategori', 'kategori_id']


class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = '__all__'


class BarangSerializer(serializers.ModelSerializer):
    jenis = JenisBarangSerializer(read_only=True)
    jenis_id = serializers.PrimaryKeyRelatedField(
        queryset=JenisBarang.objects.all(),
        source='jenis',
        write_only=True
    )

    meja = MejaSerializer(read_only=True)
    meja_id = serializers.PrimaryKeyRelatedField(
        queryset=Meja.objects.all(),
        source='meja',
        write_only=True
    )

    class Meta:
        model = Barang
        fields = [
            'id', 'kode_barang', 'nama_barang',
            'status_barang', 'jenis', 'jenis_id',
            'meja', 'meja_id', 'created_at', 'updated_at'
        ]


class BarangLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarangLog
        fields = '__all__'


class LaporanKerusakanSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaporanKerusakan
        fields = '__all__'
