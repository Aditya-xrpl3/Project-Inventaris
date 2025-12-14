from django.db import models
from django.contrib.auth import get_user_model
from .utils import generate_qr_for_barang # Pastikan file utils.py ada dan benar

User = get_user_model()

# --- Class Kategori, JenisBarang, Meja (TIDAK BERUBAH, SAMA SEPERTI SEBELUMNYA) ---
class Kategori(models.Model):
    nama_kategori = models.CharField(max_length=100, unique=True)
    def __str__(self): return self.nama_kategori

class JenisBarang(models.Model):
    kategori = models.ForeignKey(Kategori, on_delete=models.CASCADE)
    nama_jenis = models.CharField(max_length=100)
    class Meta: unique_together = ('kategori', 'nama_jenis')
    def __str__(self): return f"{self.kategori.nama_kategori} - {self.nama_jenis}"

class Meja(models.Model):
    nama_meja = models.CharField(max_length=100)
    lokasi = models.CharField(max_length=150)
    class Meta: unique_together = ('nama_meja', 'lokasi')
    def __str__(self): return f"{self.nama_meja} ({self.lokasi})"
# --------------------------------------------------------------------------

class Barang(models.Model):
    class Status(models.TextChoices):
        TERSEDIA = 'tersedia', 'Tersedia'
        DIPAKAI = 'dipakai', 'Dipakai'
        RUSAK = 'rusak', 'Rusak'
        HILANG = 'hilang', 'Hilang'

    kode_barang = models.CharField(max_length=50, unique=True)
    nama_barang = models.CharField(max_length=150)
    jenis = models.ForeignKey(JenisBarang, on_delete=models.PROTECT)
    meja = models.ForeignKey(Meja, on_delete=models.SET_NULL, null=True)
    qr_image = models.ImageField(upload_to='qr_codes/barang/', null=True, blank=True)
    status_barang = models.CharField(
        max_length=20, choices=Status.choices, default=Status.TERSEDIA
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # --- BAGIAN INI YANG PENTING ---
    def save(self, *args, **kwargs):
        # 1. Simpan dulu agar dapat ID
        is_new = self._state.adding
        super().save(*args, **kwargs)

        # 2. Tentukan Port Frontend React kamu
        # Cek terminal React: biasanya 5173 (Vite) atau 3000 (CRA)
        frontend_port = "5173" 
        
        # 3. Buat URL yang mengarah ke Halaman Detail di Frontend
        public_url = f"http://localhost:{frontend_port}/barang-public/{self.id}"

        # 4. Generate QR jika gambar belum ada atau barang baru
        if not self.qr_image or is_new:
            generate_qr_for_barang(self, public_url)
            # Simpan field qr_image saja agar hemat resource
            super().save(update_fields=['qr_image'])

    def __str__(self):
        return self.nama_barang

# --- Class BarangLog & LaporanKerusakan (TIDAK BERUBAH) ---
class BarangLog(models.Model):
    barang = models.ForeignKey(Barang, on_delete=models.CASCADE)
    lokasi_awal = models.ForeignKey(Meja, on_delete=models.SET_NULL, null=True, related_name='log_awal')
    lokasi_akhir = models.ForeignKey(Meja, on_delete=models.SET_NULL, null=True, related_name='log_akhir')
    waktu_pindah = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    def __str__(self): return f"{self.barang.nama_barang} dipindah"

class LaporanKerusakan(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        DIPERBAIKI = 'diperbaiki', 'Diperbaiki'
        SELESAI = 'selesai', 'Selesai'
    barang = models.ForeignKey(Barang, on_delete=models.CASCADE)
    deskripsi = models.TextField()
    foto_url = models.ImageField(upload_to='laporan_image/', null=True, blank=True)
    status_laporan = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return f"Laporan {self.barang.nama_barang}"