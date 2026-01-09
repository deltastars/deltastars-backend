# This file shows how the router is added; merge into core.urls if needed.
from rest_framework import routers
from products.views import ProductViewSet
router = routers.DefaultRouter()
router.register(r'api/products', ProductViewSet, basename='products')
urlpatterns += router.urls
