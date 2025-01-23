import React, { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) throw new Error('Login failed')
      
      const data = await response.json()
      localStorage.setItem('token', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      setUser(data.user)
      navigate('/dashboard')
    } catch (error) {
      throw new Error('Échec de la connexion')
    }
  }, [navigate])

  const register = useCallback(async (email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) throw new Error('Registration failed')
      
      navigate('/login')
    } catch (error) {
      throw new Error('Échec de l\'inscription')
    }
  }, [navigate])

  const updateProfile = useCallback(async (updates) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) throw new Error('Failed to update profile')
      
      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (error) {
      throw new Error('Échec de la mise à jour du profil')
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
        },
      })
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      setUser(null)
      navigate('/login')
    }
  }, [navigate])

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}