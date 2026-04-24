"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

# Import Django's WSGI application factory
from django.core.wsgi import get_wsgi_application

# Set the default settings module for the 'core' project
# This tells Django which settings to use when running the app
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Create the WSGI application object
# This is used by WSGI-compatible web servers (like Gunicorn or uWSGI)
# to serve your Django application
application = get_wsgi_application()
