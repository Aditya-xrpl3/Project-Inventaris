from django.urls import path
from .views import BarangListView, LaporanKerusakanCreateView

urlpatterns = [
    path('barang/', BarangListView.as_view(), name='barang-list'),
    path('lapor-kerusakan/', LaporanKerusakanCreateView.as_view(), name='lapor-kerusakan'),
]
