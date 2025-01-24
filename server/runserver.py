import os
from django.core.management import execute_from_command_line
from decouple import config

# Charger la variable de port depuis le fichier .env ou utiliser une valeur par défaut
port = config('PORT', default=8000, cast=int)
# print(port)
# Lancer le serveur Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "todo_project.settings")
execute_from_command_line(["manage.py", "runserver", f"0.0.0.0:{port}"])
print(port)
