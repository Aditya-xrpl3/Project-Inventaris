from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS

class UserAnonCanCreate(BasePermission):
    """
    Izinkan user anonim mengirim POST,
    Tapi GET/PUT/DELETE harus pakai login.
    """
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True  # pengunjung boleh POST
        return request.user and request.user.is_authenticated
