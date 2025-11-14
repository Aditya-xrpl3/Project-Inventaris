from rest_framework import generics, permissions
# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import BarangSerializer

# Dummy data barang lab komputer sekolah
DUMMY_DATA = [
    {"id": 1, "nama_barang": "PC All in One", "kategori": "Komputer", "jumlah": 15},
    {"id": 2, "nama_barang": "Monitor 24 Inch", "kategori": "Perangkat Display", "jumlah": 15},
    {"id": 3, "nama_barang": "Keyboard Logitech", "kategori": "Periferal", "jumlah": 20},
    {"id": 4, "nama_barang": "Mouse Wireless", "kategori": "Periferal", "jumlah": 20},
    {"id": 5, "nama_barang": "Proyektor Epson", "kategori": "Perangkat Presentasi", "jumlah": 1},
    {"id": 6, "nama_barang": "Speaker Aktif", "kategori": "Audio", "jumlah": 2},
    {"id": 7, "nama_barang": "Printer Canon", "kategori": "Output", "jumlah": 1},
    {"id": 8, "nama_barang": "Kabel LAN", "kategori": "Jaringan", "jumlah": 10},
    {"id": 9, "nama_barang": "Switch 8 Port", "kategori": "Jaringan", "jumlah": 1},
    {"id": 10, "nama_barang": "UPS 600VA", "kategori": "Daya", "jumlah": 2},
]

class BarangListView(APIView):
    def get(self, request):
        kategori = request.query_params.get('kategori', None)

        if kategori:
            filtered_data = [item for item in DUMMY_DATA if item["kategori"].lower() == kategori.lower()]
        else:
            filtered_data = DUMMY_DATA

        serializer = BarangSerializer(filtered_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
