# core/serializers.py
from rest_framework import serializers
from .models import Kategori, JenisBarang, Meja, Barang, BarangLog, LaporanKerusakan

class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = ['id', 'nama_kategori']

class JenisBarangSerializer(serializers.ModelSerializer):
    kategori = serializers.StringRelatedField()

    class Meta:
        model = JenisBarang
        fields = ['id', 'nama_jenis', 'kategori']

class MejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meja
        fields = ['id', 'nama_meja', 'lokasi']


# Minimal barang representation for embedding in Meja detail
class BarangSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barang
        fields = ['id', 'nama_barang', 'status_barang']


class MejaDetailSerializer(serializers.ModelSerializer):
    barang_set = BarangSimpleSerializer(many=True, read_only=True)

    class Meta:
        model = Meja
        fields = ['id', 'nama_meja', 'lokasi', 'barang_set']

# --- Barang (output format A) ---
class BarangSerializer(serializers.ModelSerializer):
    jenis = serializers.SerializerMethodField()
    meja = serializers.SerializerMethodField()

    class Meta:
        model = Barang
        fields = [
            'id',
            'kode_barang',
            'nama_barang',
            'jenis',
            'meja',
            'status_barang',
            'created_at',
            'updated_at',
        ]

    def get_jenis(self, obj):
        # Format: "Kategori - Nama Jenis"
        if obj.jenis:
            return f"{obj.jenis.kategori.nama_kategori} - {obj.jenis.nama_jenis}"
        return None

    def get_meja(self, obj):
        if obj.meja:
            return f"{obj.meja.nama_meja} ({obj.meja.lokasi})"
        return None

# --- Serializer untuk create/update Barang (admin only) ---
class BarangCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barang
        fields = ['kode_barang', 'nama_barang', 'jenis', 'meja', 'status_barang']

# --- BarangLog serializer (read only) ---
class BarangLogSerializer(serializers.ModelSerializer):
    barang = serializers.StringRelatedField()
    lokasi_awal = serializers.StringRelatedField()
    lokasi_akhir = serializers.StringRelatedField()
    user = serializers.StringRelatedField()

    class Meta:
        model = BarangLog
        fields = ['id', 'barang', 'lokasi_awal', 'lokasi_akhir', 'waktu_pindah', 'user']

# --- LaporanKerusakan ---
class LaporanKerusakanCreateSerializer(serializers.ModelSerializer):
    # anonymous create -> user will be left null automatically
    class Meta:
        model = LaporanKerusakan
        fields = ['barang', 'deskripsi', 'foto_url']

    def validate(self, data):
        barang = data.get('barang')
        # If there is already a pending report for this barang, reject creation
        existing = LaporanKerusakan.objects.filter(barang=barang, status_laporan=LaporanKerusakan.Status.PENDING)
        if existing.exists():
            raise serializers.ValidationError("Sudah ada laporan pending untuk barang ini. Tunggu tindak lanjut admin.")
        return data


class LaporanKerusakanSerializer(serializers.ModelSerializer):
    # Admin/read serializers should include nested barang and pelapor info
    barang_detail = serializers.SerializerMethodField(read_only=True)
    pelapor = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = LaporanKerusakan
        fields = [
            'id', 'barang', 'deskripsi', 'foto_url', 'status_laporan',
            'user', 'created_at', 'updated_at', 'barang_detail', 'pelapor'
        ]
        read_only_fields = ('user',)

    def validate(self, data):
        barang = data.get("barang")

        # Cek jika masih ada laporan pending untuk barang ini
        if LaporanKerusakan.objects.filter(
            barang=barang, 
            status_laporan=LaporanKerusakan.Status.PENDING
        ).exists():
            raise serializers.ValidationError(
                {"barang": "Barang ini sudah memiliki laporan pending. Tunggu admin."}
            )
        return data

    def create(self, validated_data):
        # Anonymous: user = None
        user = None
        if self.context['request'].user.is_authenticated:
            user = self.context['request'].user

        validated_data['user'] = user
        return super().create(validated_data)

    def get_barang_detail(self, obj):
        return {
            'id': obj.barang.id,
            'nama_barang': obj.barang.nama_barang
        } if obj.barang else None

    def get_pelapor(self, obj):
        if obj.user:
            return {'id': obj.user.id, 'username': obj.user.username}
        return None