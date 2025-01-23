import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function PrivateRoute({ children }) {
  const { access, refresh } = useAuth()
  
  // Vérifie que les deux tokens sont présents avant de permettre l'accès aux enfants
  return (access && refresh) ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
