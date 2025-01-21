from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Assurez-vous qu'il y a des vues définies ici
]
