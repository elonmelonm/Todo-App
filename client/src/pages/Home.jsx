import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Star, List, Users } from 'lucide-react'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="ml-2 flex text-xl font-bold text-gray-900">Task <CheckCircle className="h-8 w-8 text-indigo-600" /> Master</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Organisez vos tâches</span>
            <span className="block text-indigo-600">Simplifiez votre vie</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            TaskMaster vous aide à rester organisé et productif. Gérez vos tâches, créez des catégories et gardez le contrôle de votre journée.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white/60 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-indigo-600 mb-4">
                <List className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Organisation Simple</h3>
              <p className="text-gray-600">
                Créez et organisez vos tâches facilement. Utilisez des catégories pour mieux structurer votre travail.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-indigo-600 mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tâches Favorites</h3>
              <p className="text-gray-600">
                Marquez vos tâches importantes comme favorites pour les retrouver rapidement et ne rien oublier.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-indigo-600 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interface Intuitive</h3>
              <p className="text-gray-600">
                Une interface moderne et facile à utiliser, conçue pour vous faire gagner du temps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home