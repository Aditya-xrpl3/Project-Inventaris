
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django.conf import settings

class QRService:
    @staticmethod
    def generate_qr_code(data: str) -> ContentFile:
        """
        Generates a QR code image from the given data string.
        Returns a Django ContentFile ready to be saved to a model field.
        """
        qr = qrcode.make(data)
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        return ContentFile(buffer.getvalue())

    @staticmethod
    def generate_qr_for_barang(barang, public_url: str):
        """
        Generates and saves a QR code for a Barang instance.
        """
        content_file = QRService.generate_qr_code(public_url)
        filename = f"qr_barang_{barang.id}.png"
        
        # Save without triggering signals/save() loop if used in save()
        # But here we use it in Views, so standard save is fine or update_fields
        barang.qr_image.save(filename, content_file, save=True)
        return public_url
