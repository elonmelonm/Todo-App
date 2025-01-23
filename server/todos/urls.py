from django.urls import path
from .views import TodoListCreateView, TodoDetailView, ToggleCompleteView, ToggleFavoriteView, CategoryListCreateView, CategoryDetailView, UpdateTodoCategoryView

urlpatterns = [
    path('', TodoListCreateView.as_view(), name='todo_list_create'),
    path('<uuid:pk>/', TodoDetailView.as_view(), name='todo_detail'),
    path('<uuid:pk>/toggle-complete/', ToggleCompleteView.as_view(), name='todo_toggle_complete'),
    path('<uuid:pk>/toggle-favorite/', ToggleFavoriteView.as_view(), name='todo_toggle_favorite'),
    path('<uuid:pk>/update-category/', UpdateTodoCategoryView.as_view(), name='update_todo_category'),
    path('categories/', CategoryListCreateView.as_view(), name='category_list_create'),
    path('categories/<uuid:pk>/', CategoryDetailView.as_view(), name='category_detail'),
]
