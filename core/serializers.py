from rest_framework import serializers
# dari django.contrib.auth.models dan .models dihapus aja biar gak error


# Create your serializers here.

from rest_framework import serializers

class BarangSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nama_barang = serializers.CharField(max_length=100)
    kategori = serializers.CharField(max_length=100)
    jumlah = serializers.IntegerField()


