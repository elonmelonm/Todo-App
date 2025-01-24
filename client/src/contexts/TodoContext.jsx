import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialCategoriesState = [];

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const TodoContext = createContext(null);

export const useTodos = () => useContext(TodoContext);

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState(initialCategoriesState);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/todos/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = response.data.results;

      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Erreur lors de la récupération des tâches.');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/todos/categories/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCategories(response.data.results);

    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Erreur lors de la récupération des catégories.');
    }
  }, []);

  const addTodo = useCallback(async ({ title, description, category }) => {
    if (!title || !description) {
      toast.error('Veuillez fournir un titre et une description.');
      return;
    }

    try {
      const todoData = { title, description, category };

      const response = await axios.post(`${apiUrl}/api/todos/`, todoData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setTodos((prev) => [...prev, response.data]);
      toast.success('Tâche ajoutée avec succès !');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error("Erreur lors de l'ajout de la tâche.");
    }
  }, []);

  const updateTodo = useCallback(async (id, updates) => {
    try {
      const response = await axios.patch(`${apiUrl}/api/todos/${id}/`, updates, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const updatedTodo = response.data;
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
      toast.success('Tâche mise à jour avec succès !');
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error("Erreur lors de la mise à jour de la tâche.");
    }
  }, []);

  const changeTodoCategory = useCallback(async (id, categoryId) => {
    // Mise à jour optimiste de l'état local
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, category: categoryId } : todo
      )
    );
  
    try {
      const response = await axios.patch(
        `${apiUrl}/api/todos/${id}/update-category/`,
        { category: categoryId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      const updatedTodo = response.data;
  
      // Mettre à jour l'état local avec la réponse du backend
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
  
      toast.success('Tâche mise à jour avec succès !');
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error("Erreur lors de la mise à jour de la tâche.");
  
      // Annuler la mise à jour optimiste en cas d'erreur
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, category: todo.category } : todo
        )
      );
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/todos/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast.success('Tâche supprimée avec succès !');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error("Erreur lors de la suppression de la tâche.");
    }
  }, []);

  const toggleTodoFavorite = useCallback(async (id, action) => {
    // Mise à jour optimiste de l'état local
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, is_favorite: !todo.is_favorite } // Inverse is_favorite
          : todo
      )
    );
  
    try {
      const response = await axios.post(
        `${apiUrl}/api/todos/${id}/toggle-favorite/`,
        { action },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      const updatedTodo = response.data;
  
      // Mettre à jour l'état local avec la réponse du backend
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, is_favorite: updatedTodo.is_favorite } : todo
        )
      );
  
      toast.success("Tâche mise à jour avec succès !");
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error("Erreur lors de la modification de la tâche.");
  
      // Annuler la mise à jour optimiste en cas d'erreur
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? { ...todo, is_favorite: !todo.is_favorite } // Revenir à l'état précédent
            : todo
        )
      );
    }
  }, []);

  const toggleTodoComplete = useCallback(async (id, action) => {
    // Mise à jour optimiste de l'état local
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, is_completed: !todo.is_completed } // Inverse completed
          : todo
      )
    );
  
    try {
      const response = await axios.post(
        `${apiUrl}/api/todos/${id}/toggle-complete/`,
        { action },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      const updatedTodo = response.data;
  
      // Mettre à jour l'état local avec la réponse du backend
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, is_completed: updatedTodo.is_completed } : todo
        )
      );
  
      toast.success("Tâche mise à jour avec succès !");
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error("Erreur lors de la modification de la tâche.");
  
      // Annuler la mise à jour optimiste en cas d'erreur
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? { ...todo, is_completed: !todo.is_completed } // Revenir à l'état précédent
            : todo
        )
      );
    }
  }, []);

  const addCategory = useCallback(async (name) => {
    if (!name) {
      toast.error('Veuillez fournir un nom de catégorie.');
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/todos/categories/`,
        { name },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const newCategory = response.data;
      setCategories((prev) => (Array.isArray(prev) ? [...prev, newCategory] : [newCategory]));
      toast.success('Catégorie ajoutée avec succès !');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error("Erreur lors de l'ajout de la catégorie.");
    }
  }, []);

  const updateCategory = useCallback(async (id, name) => {
    if (!name) {
      toast.error('Veuillez fournir un nom de catégorie.');
      return;
    }

    try {
      const response = await axios.patch(
        `${apiUrl}/api/todos/categories/${id}/`,
        { name },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const updatedCategory = response.data;
      setCategories((prev) =>
        prev.map((category) => (category.id === id ? updatedCategory : category))
      );
      toast.success('Catégorie mise à jour avec succès !');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error("Erreur lors de la mise à jour de la catégorie.");
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/todos/categories/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCategories((prev) => prev.filter((category) => category.id !== id));
      toast.success('Catégorie supprimée avec succès !');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Erreur lors de la suppression de la catégorie.");
    }
  }, []);

  const value = {
    todos,
    categories,
    fetchTodos,
    fetchCategories,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoFavorite,
    toggleTodoComplete,
    addCategory,
    updateCategory,
    deleteCategory,
    changeTodoCategory
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}