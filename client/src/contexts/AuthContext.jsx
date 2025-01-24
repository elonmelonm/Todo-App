import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Fonction pour décoder un token JWT et vérifier s'il est expiré
function isTokenExpired(token) {
  if (!token) return true;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decoded = JSON.parse(atob(base64));
  const expirationDate = decoded.exp * 1000;
  return expirationDate < Date.now();
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(localStorage.getItem('token'));
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'));

  // Effet pour récupérer les tokens et l'utilisateur du localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && !isTokenExpired(token)) {
      setAccess(token);
    } else {
      if (refreshToken && !isTokenExpired(refreshToken)) {
        refreshTokenHandler(refreshToken);
      } else {
        logout();
      }
    }

    if (refreshToken) {
      setRefresh(refreshToken);
    }
  }, []);

  const refreshTokenHandler = async (refreshToken) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) throw new Error('Failed to refresh token');

      const data = await response.json();
      localStorage.setItem('token', data.access);
      setAccess(data.access);
      toast.success('Token rafraîchi avec succès !');
    } catch (error) {
      toast.error('Échec du rafraîchissement du token');
      logout();
    }
  };

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('user', data.user);
      setAccess(data.access);
      setRefresh(data.refresh);
      setUser(data.user);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error) {
      console.error('Échec de la connexion', error);
      toast.error('Échec de la connexion : email ou mot de passe incorrect');
    }
  }, [navigate]);

  const register = useCallback(async (username, email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json(); // Extraire les données de la réponse
  
      if (!response.ok) {
        // Si la réponse n'est pas OK, afficher le message d'erreur du backend
        throw new Error(data.email || 'Registration failed');
      }
  
      // Si l'inscription réussit, afficher un toast de succès
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (error) {
      console.error('Échec de l\'inscription', error);
      // Afficher le message d'erreur du backend dans le toast
      toast.error(`Échec de l'inscription : ${error.message}`);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    const refresh_token = localStorage.getItem('refreshToken');
    try {
      await fetch(`${apiUrl}/api/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ refresh_token }),
      });
      toast.success('Déconnexion réussie !');
    } catch (error) {
      toast.error('Échec de la déconnexion');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setAccess(null);
      setRefresh(null);
      navigate('/');
    }
  }, [navigate]);

  const value = {
    access,
    refresh,
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}