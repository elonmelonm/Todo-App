import React, { createContext, useContext, useState, useCallback } from 'react'

const TodoContext = createContext(null)

export const useTodos = () => useContext(TodoContext)

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([])
  const [categories, setCategories] = useState([])

  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch('/api/todos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  const addTodo = useCallback(async (todo) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(todo),
      })
      if (!response.ok) throw new Error('Failed to add todo')
      const newTodo = await response.json()
      setTodos(prev => [...prev, newTodo])
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }, [])

  const updateTodo = useCallback(async (id, updates) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update todo')
      const updatedTodo = await response.json()
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }, [])

  const deleteTodo = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to delete todo')
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }, [])

  const toggleTodo = useCallback(async (id, action) => {
    try {
      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action }),
      })
      if (!response.ok) throw new Error('Failed to toggle todo')
      const updatedTodo = await response.json()
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }, [])

  const addCategory = useCallback(async (name) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) throw new Error('Failed to add category')
      const newCategory = await response.json()
      setCategories(prev => [...prev, newCategory])
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }, [])

  const updateCategory = useCallback(async (id, name) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) throw new Error('Failed to update category')
      const updatedCategory = await response.json()
      setCategories(prev => prev.map(category => 
        category.id === id ? updatedCategory : category
      ))
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }, [])

  const deleteCategory = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to delete category')
      setCategories(prev => prev.filter(category => category.id !== id))
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }, [])

  const value = {
    todos,
    categories,
    fetchTodos,
    fetchCategories,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    addCategory,
    updateCategory,
    deleteCategory,
  }

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}