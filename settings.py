import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent.parent / 'secrets.env')
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "please-change-me")
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")
INSTALLED_APPS = [
    "django.contrib.admin","django.contrib.auth","django.contrib.contenttypes",
    "django.contrib.sessions","django.contrib.messages","django.contrib.staticfiles",
    "rest_framework","corsheaders","products","customers"
]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware","django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware","django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware","django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]
ROOT_URLCONF = "core.urls"
WSGI_APPLICATION = "core.wsgi.application"
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv('POSTGRES_DB','deltastars_db'),
        "USER": os.getenv('POSTGRES_USER','deltastars_user'),
        "PASSWORD": os.getenv('POSTGRES_PASSWORD','Deltastars@2025'),
        "HOST": os.getenv('POSTGRES_HOST','db'),
        "PORT": os.getenv('POSTGRES_PORT','5432'),
    }
}
LANGUAGE_CODE = "ar-SA"
TIME_ZONE = "Asia/Riyadh"
USE_I18N = True
USE_TZ = True
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
CORS_ALLOW_ALL_ORIGINS = True
AUTH_USER_MODEL = "customers.User"
