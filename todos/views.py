from rest_framework import generics, permissions
from .models import Todo
from .serializers import TodoSerializer
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
    filterset_fields = ['is_favorite', 'is_completed']  # Filtres disponibles
    ordering_fields = ['created_at', 'updated_at']      # Tri des résultats

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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
