import qrcode
from django.core.files.base import ContentFile
from io import BytesIO

def generate_qr_for_barang(barang, public_url):
    """
    Generate QR untuk barang dengan URL yang sudah ditentukan
    """
    qr = qrcode.make(public_url)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")

    filename = f"qr_barang_{barang.id}.png"
    barang.qr_image.save(filename, ContentFile(buffer.getvalue()), save=True)

    return public_url
