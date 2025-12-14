from rest_framework import serializers
from .models import Kategori, JenisBarang, Meja, Barang, BarangLog, LaporanKerusakan

# --- MASTER DATA ---

class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = ['id', 'nama_kategori']

class JenisBarangSerializer(serializers.ModelSerializer):
    # StringRelatedField akan mengambil return __str__ dari model Kategori
    kategori = serializers.StringRelatedField() 

    class Meta:
        model = JenisBarang
        fields = ['id', 'nama_jenis', 'kategori']

class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = ['id', 'nama_meja', 'lokasi']

# --- BARANG ---

# Serializer untuk Read (GET) - Menampilkan detail lengkap (bukan cuma ID)
class BarangSerializer(serializers.ModelSerializer):
    qr_image = serializers.ImageField(read_only=True)
    jenis_detail = serializers.SerializerMethodField() # Custom field biar rapi
    meja_detail = serializers.SerializerMethodField()

    class Meta:
        model = Barang
        fields = [
            'id', 'kode_barang', 'nama_barang', 
            'jenis', 'jenis_detail',  # Tampilkan ID dan Detail
            'meja', 'meja_detail', 
            'status_barang', 'qr_image', 
            'created_at', 'updated_at'
        ]

    def get_jenis_detail(self, obj):
        return f"{obj.jenis.kategori.nama_kategori} - {obj.jenis.nama_jenis}" if obj.jenis else "-"

    def get_meja_detail(self, obj):
        return f"{obj.meja.nama_meja} ({obj.meja.lokasi})" if obj.meja else "Gudang / Tidak Ada"

# Serializer untuk Write (POST/PUT) - Menerima ID
class BarangCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barang
        fields = ['kode_barang', 'nama_barang', 'jenis', 'meja', 'status_barang']

    def to_representation(self, instance):
        """
        Setelah berhasil save, response balikan akan menggunakan format lengkap (BarangSerializer)
        bukan cuma ID saja. Ini bagus untuk UX frontend.
        """
        return BarangSerializer(instance).data

# --- LOG & LAPORAN ---

class BarangLogSerializer(serializers.ModelSerializer):
    barang = serializers.StringRelatedField()
    lokasi_awal = serializers.StringRelatedField()
    lokasi_akhir = serializers.StringRelatedField()
    user = serializers.StringRelatedField()

    class Meta:
        model = BarangLog
        fields = ['id', 'barang', 'lokasi_awal', 'lokasi_akhir', 'waktu_pindah', 'user']

class LaporanKerusakanCreateSerializer(serializers.ModelSerializer):
    foto_url = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = LaporanKerusakan
        fields = ['barang', 'deskripsi', 'foto_url']

    def validate(self, data):
        barang = data.get('barang')
        if LaporanKerusakan.objects.filter(barang=barang, status_laporan='pending').exists():
            raise serializers.ValidationError("Sudah ada laporan pending untuk barang ini.")
        return data

class LaporanKerusakanSerializer(serializers.ModelSerializer):
    barang_detail = serializers.SerializerMethodField()
    pelapor = serializers.SerializerMethodField()

    class Meta:
        model = LaporanKerusakan
        fields = '__all__'
        read_only_fields = ('user',)

    def get_barang_detail(self, obj):
        return {'id': obj.barang.id, 'nama_barang': obj.barang.nama_barang} if obj.barang else None

    def get_pelapor(self, obj):
        return {'id': obj.user.id, 'username': obj.user.username} if obj.user else None