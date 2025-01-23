import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Fonction pour décoder un token JWT et vérifier s'il est expiré
function isTokenExpired(token) {
  if (!token) return true;
  // Décodage du token (le token est une chaîne Base64-encoded)
  const base64Url = token.split('.')[1];  // Récupère la partie payload du JWT
  const base64 = base64Url.replace('-', '+').replace('_', '/');  // Conversion de Base64
  const decoded = JSON.parse(atob(base64));  // Décodage en JSON

  // La date d'expiration est en secondes, donc on multiplie par 1000 pour la convertir en millisecondes
  const expirationDate = decoded.exp * 1000;
  return expirationDate < Date.now();
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [access, setAccess] = useState(localStorage.getItem('token'))
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'))

  // Effet pour récupérer les tokens et l'utilisateur du localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')

    if (token && !isTokenExpired(token)) {
      setAccess(token)
    } else {
      if (refreshToken && !isTokenExpired(refreshToken)) {
        refreshTokenHandler(refreshToken)
      } else {
        logout()
      }
    }

    if (refreshToken) {
      setRefresh(refreshToken)
    }
  }, [])

  const refreshTokenHandler = async (refreshToken) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!response.ok) throw new Error('Failed to refresh token')

      const data = await response.json()
      localStorage.setItem('token', data.access)
      setAccess(data.access)
    } catch (error) {
      logout()
    }
  }

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Login failed')

      const data = await response.json()
      localStorage.setItem('token', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      localStorage.setItem('user', data.user)
      setAccess(data.access)
      setRefresh(data.refresh)
      setUser(data.user);
      navigate('/dashboard')
    } catch (error) {
      console.error('Échec de la connexion', error)
    }
  }, [navigate])

  const register = useCallback(async (username, email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })

      if (!response.ok) throw new Error('Registration failed')

      navigate('/login')
    } catch (error) {
      console.error('Échec de l\'inscription', error)
    }
  }, [navigate])

  const logout = useCallback(async () => {
    const refresh_token = localStorage.getItem('refreshToken')
    try {
      await fetch(`${apiUrl}/api/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ refresh_token }),
    })
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      setAccess(null)
      setRefresh(null)
      navigate('/')
    }
  }, [navigate])

  const value = {
    access,
    refresh,
    user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
