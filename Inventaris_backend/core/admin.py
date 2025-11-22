from django.contrib import admin
from .models import Barang, Kategori, LaporanKerusakan, JenisBarang, Meja

admin.site.register(Barang)
admin.site.register(Kategori)
admin.site.register(LaporanKerusakan)
admin.site.register(JenisBarang)
admin.site.register(Meja)
