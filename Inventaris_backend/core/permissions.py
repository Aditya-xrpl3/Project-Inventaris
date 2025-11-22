from rest_framework.permissions import BasePermission, SAFE_METHODS

class LaporanPermission(BasePermission):
    """
    Anonymous boleh POST (buat laporan).
    GET/PUT/PATCH/DELETE hanya untuk admin (staff).
    """
    def has_permission(self, request, view):
        # Anonymous boleh CREATE laporan
        if request.method == "POST":
            return True

        # Selain POST, harus admin
        return (request.user and request.user.is_authenticated 
                and request.user.is_staff)
