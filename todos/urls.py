from django.urls import path
from .views import TodoListCreateView, TodoDetailView

urlpatterns = [
    path('', TodoListCreateView.as_view(), name='todo_list_create'),
    path('<uuid:pk>/', TodoDetailView.as_view(), name='todo_detail'),
]
