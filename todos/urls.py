from django.urls import path
from .views import TodoListCreateView, TodoDetailView, ToggleCompleteView, ToggleFavoriteView

urlpatterns = [
    path('', TodoListCreateView.as_view(), name='todo_list_create'),
    path('<uuid:pk>/', TodoDetailView.as_view(), name='todo_detail'),
    path('<uuid:pk>/toggle-complete/', ToggleCompleteView.as_view(), name='todo_toggle_complete'),
    path('<uuid:pk>/toggle-favorite/', ToggleFavoriteView.as_view(), name='todo_toggle_favorite'),
]
