from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Kategori(models.Model):
    nama_kategori = models.CharField(max_length=100)

    def __str__(self):
        return self.nama_kategori


class Meja(models.Model):
    nama_meja = models.CharField(max_length=100)
    lokasi = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.nama_meja} - {self.lokasi}"


class Barang(models.Model):

    STATUS_BARANG = [
        ('BAIK', 'Baik'),
        ('RUSAK', 'Rusak'),
        ('PERBAIKAN', 'Dalam Perbaikan'),
        ('HILANG', 'Hilang'),
    ]

    nama_barang = models.CharField(max_length=200)
    kode_barang = models.CharField(max_length=100, unique=True)
    kategori = models.ForeignKey(Kategori, on_delete=models.SET_NULL, null=True)
    meja = models.ForeignKey(Meja, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_BARANG, default='BAIK')

    def __str__(self):
        return self.nama_barang


class PC(models.Model):

    STATUS_PC = [
        ('BAIK', 'Baik'),
        ('RUSAK', 'Rusak'),
        ('MAINTENANCE', 'Maintenance'),
    ]

    nama_pc = models.CharField(max_length=100)
    kode_pc = models.CharField(max_length=100, unique=True)
    meja = models.ForeignKey(Meja, on_delete=models.SET_NULL, null=True)
    spesifikasi = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_PC, default='BAIK')

    def __str__(self):
        return self.nama_pc
