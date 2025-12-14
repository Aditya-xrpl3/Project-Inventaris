from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # 🔐 AUTH
    path("auth/", include("auth.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ✅ API CORE
    path("api/", include("core.urls")),

    # 🌐 REACT FRONTEND (Akses root langsung ke index.html)
    path("", TemplateView.as_view(template_name="index.html")),
]

# --- KONFIGURASI PENTING ---
if settings.DEBUG:
    # 1. Melayani File Media (QR Code, Uploads) -> URL: /media/...
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # 2. Melayani File Static (Vite Assets) -> URL: /assets/...
    # Ini memastikan Django bisa baca file CSS/JS dari folder frontend_build
    try:
        urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    except Exception as e:
        print("Warning: STATICFILES_DIRS mungkin kosong atau belum di-build.", e)