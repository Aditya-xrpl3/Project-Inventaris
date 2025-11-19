from django.db import models


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
        return f"{self.nama_jenis} ({self.kategori.nama_kategori})"


class Meja(models.Model):
    nama_meja = models.CharField(max_length=100)
    lokasi = models.CharField(max_length=150)

    class Meta:
        unique_together = ('nama_meja', 'lokasi')

    def __str__(self):
        return f"{self.nama_meja} - {self.lokasi}"


STATUS_BARANG = [
    ('BAIK', 'Baik'),
    ('RUSAK', 'Rusak'),
    ('PERBAIKAN', 'Dalam Perbaikan'),
    ('HILANG', 'Hilang'),
]


class Barang(models.Model):
    kode_barang = models.CharField(max_length=50, unique=True)
    nama_barang = models.CharField(max_length=150)

    jenis = models.ForeignKey(JenisBarang, on_delete=models.CASCADE)
    meja = models.ForeignKey(Meja, on_delete=models.SET_NULL, null=True)

    status_barang = models.CharField(
        max_length=20,
        choices=STATUS_BARANG,
        default='BAIK'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.kode_barang} - {self.nama_barang}"


STATUS_LAPORAN = [
    ('BARU', 'Baru'),
    ('DIPROSES', 'Diproses'),
    ('SELESAI', 'Selesai'),
]


class LaporanKerusakan(models.Model):
    barang = models.ForeignKey(Barang, on_delete=models.CASCADE)
    deskripsi = models.TextField()
    foto_url = models.CharField(max_length=255, blank=True, null=True)

    status_laporan = models.CharField(max_length=20, choices=STATUS_LAPORAN, default='BARU')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Laporan #{self.id} - {self.barang.nama_barang}"


class BarangLog(models.Model):
    barang = models.ForeignKey(Barang, on_delete=models.CASCADE)

    lokasi_awal = models.ForeignKey(
        Meja,
        on_delete=models.SET_NULL,
        null=True,
        related_name='logs_awal'
    )

    lokasi_akhir = models.ForeignKey(
        Meja,
        on_delete=models.SET_NULL,
        null=True,
        related_name='logs_akhir'
    )

    waktu_pindah = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log {self.barang.nama_barang} ({self.lokasi_awal} → {self.lokasi_akhir})"
