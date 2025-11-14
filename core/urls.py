from django.urls import path
from .views import BarangListView

urlpatterns = [
    path('barang/', BarangListView.as_view(), name='barang-list'),
]
