from django.urls import path
from .views import push

urlpatterns = [
    path('fcmpush', push, name='service_worker')
]