from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Kategori(models.Model):
    nama_kategori = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nama_kategori


class JenisBarang(models.Model):
    kategori = models.ForeignKey(Kategori, on_delete=models.CASCADE)
    nama_jenis = models.CharField(max_length=100)

    class Meta:
        unique_together = ('kategori', 'nama_jenis')

    def __str__(self):
        return f"{self.kategori.nama_kategori} - {self.nama_jenis}"


class Meja(models.Model):
    nama_meja = models.CharField(max_length=100)
    lokasi = models.CharField(max_length=150)

    class Meta:
        unique_together = ('nama_meja', 'lokasi')

    def __str__(self):
        return f"{self.nama_meja} ({self.lokasi})"


class Barang(models.Model):
    class Status(models.TextChoices):
        TERSEDIA = 'tersedia', 'Tersedia'
        DIPAKAI = 'dipakai', 'Dipakai'
        RUSAK = 'rusak', 'Rusak'
        HILANG = 'hilang', 'Hilang'

    kode_barang = models.CharField(max_length=50, unique=True)
    nama_barang = models.CharField(max_length=150)
    jenis = models.ForeignKey(JenisBarang, on_delete=models.PROTECT)

    # Barang harus punya lokasi → NOT NULL
    meja = models.ForeignKey(Meja, on_delete=models.SET_NULL, null=True)

    status_barang = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.TERSEDIA
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nama_barang


class BarangLog(models.Model):
    barang = models.ForeignKey(Barang, on_delete=models.CASCADE)
    lokasi_awal = models.ForeignKey(Meja, on_delete=models.SET_NULL, null=True, related_name='log_awal')
    lokasi_akhir = models.ForeignKey(Meja, on_delete=models.SET_NULL, null=True, related_name='log_akhir')
    waktu_pindah = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.barang.nama_barang} dipindah"


class LaporanKerusakan(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        DIPERBAIKI = 'diperbaiki', 'Diperbaiki'
        SELESAI = 'selesai', 'Selesai'

    barang = models.ForeignKey(Barang, on_delete=models.CASCADE)
    deskripsi = models.TextField()
    foto_url = models.CharField(max_length=255, null=True, blank=True)
    status_laporan = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Laporan {self.barang.nama_barang}"
