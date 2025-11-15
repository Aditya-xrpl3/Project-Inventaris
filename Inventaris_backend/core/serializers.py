from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import Kategori, Meja, Barang, LaporanKerusakan

# Create your serializers here.

class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = '__all__'


class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = '__all__'


class BarangSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barang
        fields = '__all__'


class LaporanKerusakanSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaporanKerusakan
        fields = '__all__'