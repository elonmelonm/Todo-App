import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function PublicRoute({ children }) {
  const { access, refresh } = useAuth()

  // Si les tokens sont présents, redirige l'utilisateur vers le tableau de bord
  return (access && refresh) ? <Navigate to="/dashboard" replace /> : children
}

export default PublicRoute
