# users/urls.py
from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from .views import UserRegistrationView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),  
    path('login/', TokenObtainPairView.as_view(), name='login_user'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
]

