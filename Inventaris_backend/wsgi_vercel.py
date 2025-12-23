import os
import sys

# Set path to the current directory (where manage.py is)
# This ensures 'inventaris_backend' module can be found
app_path = os.path.dirname(os.path.abspath(__file__))
if app_path not in sys.path:
    sys.path.append(app_path)

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inventaris_backend.settings')

application = get_wsgi_application()
