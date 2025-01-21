from rest_framework import generics, permissions
from .models import Todo, Category
from .serializers import TodoSerializer, CategorySerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import Todo
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class TodoListCreateView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['is_favorite', 'is_completed', 'category']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Récupérer ou créer la catégorie par défaut 'Divers'
        category = serializer.validated_data.get('category')  # Vérifie si une catégorie est fournie
        if not category:
            category, _ = Category.get_or_create_default_category(self.request.user)
        serializer.save(user=self.request.user, category=category)


class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

class ToggleCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        todo = get_object_or_404(Todo, id=pk, user=request.user)
        todo.is_completed = not todo.is_completed
        todo.save()
        return Response({
            "message": f"Task '{todo.title}' marked as {'completed' if todo.is_completed else 'incomplete'}.",
            "is_completed": todo.is_completed
        }, status=status.HTTP_200_OK)


class ToggleFavoriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        todo = get_object_or_404(Todo, id=pk, user=request.user)
        todo.is_favorite = not todo.is_favorite
        todo.save()
        return Response({
            "message": f"Task '{todo.title}' marked as {'favorite' if todo.is_favorite else 'not favorite'}.",
            "is_favorite": todo.is_favorite
        }, status=status.HTTP_200_OK)
    
class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    
class UpdateTodoCategoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            # Récupérer la tâche de l'utilisateur connecté
            todo = Todo.objects.get(pk=pk, user=request.user)
        except Todo.DoesNotExist:
            return Response({"error": "Tâche introuvable."}, status=status.HTTP_404_NOT_FOUND)

        # Récupérer la nouvelle catégorie
        category_id = request.data.get('category')
        if not category_id:
            return Response({"error": "La catégorie est requise."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = Category.objects.get(pk=category_id, user=request.user)
        except Category.DoesNotExist:
            return Response({"error": "Catégorie introuvable."}, status=status.HTTP_404_NOT_FOUND)

        # Mettre à jour la catégorie de la tâche
        todo.category = category
        todo.save()

        # Retourner la tâche mise à jour
        serializer = TodoSerializer(todo)
        return Response(serializer.data, status=status.HTTP_200_OK)