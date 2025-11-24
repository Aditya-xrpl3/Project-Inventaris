from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
  TokenObtainPairView,
  TokenRefreshView,
)
from django.contrib import admin
from django.urls import path, include
from django.conf import settings # Import baru
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path("api/user/", include("auth.urls")),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path("auth/", include("auth.urls")),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
