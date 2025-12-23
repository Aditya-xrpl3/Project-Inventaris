
import unittest
import os
import sys
import qrcode
import cv2
import numpy as np
from io import BytesIO

# Add project root to sys.path to allows imports if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class QRStabilityTest(unittest.TestCase):
    def test_generate_and_read_qr(self):
        """
        Test that we can generate a QR code and read it back,
        and the content matches exactly.
        """
        test_data = "http://localhost:5173/barang-public/123"
        
        # 1. Generate QR
        qr = qrcode.make(test_data)
        
        # Convert PIL image to OpenCV format
        open_cv_image = np.array(qr.convert('RGB')) 
        # Convert RGB to BGR 
        open_cv_image = open_cv_image[:, :, ::-1].copy() 

        # 2. Decode QR using OpenCV
        detector = cv2.QRCodeDetector()
        data, bbox, straight_qrcode = detector.detectAndDecode(open_cv_image)

        print(f"\n[QR TEST] Input: {test_data}")
        print(f"[QR TEST] Decoded: {data}")

        # 3. Assert
        self.assertEqual(data, test_data, "Decoded QR data does not match input data!")

if __name__ == '__main__':
    unittest.main()
