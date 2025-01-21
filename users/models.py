import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Remplacement de l'ID auto-incrémenté par un UUID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Email défini comme champ unique (pour l'authentification)
    email = models.EmailField(unique=True)

    # Spécification des champs pour l'authentification
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
