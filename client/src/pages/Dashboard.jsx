import React, { useState, useEffect } from 'react';
import { useTodos } from '../contexts/TodoContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Star, Check, LogOut, ListFilter, Clock, Pencil, Trash2, X, User, ChevronDown, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

// Fonction de confirmation personnalisée
const confirmToast = (message, onConfirm, onCancel) => {
  toast(
    <div>
      <p>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss();
          }}
          style={{ background: 'green', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}
        >
          Oui
        </button>
        <button
          onClick={() => {
            onCancel();
            toast.dismiss();
          }}
          style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}
        >
          Non
        </button>
      </div>
    </div>,
    {
      autoClose: false, // Empêche la fermeture automatique
      closeButton: false, // Masque le bouton de fermeture par défaut
    }
  );
};

function Dashboard() {
  const {
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
  } = useTodos();
  const { user, logout, updateProfile } = useAuth();
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('Divers');
  const [filter, setFilter] = useState('all');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  // Réorganiser les catégories pour placer "Divers" en premier
  const sortedCategories = [
    ...categories.filter((category) => category.name === "Divers"), // Placer "Divers" en premier
    ...categories.filter((category) => category.name !== "Divers"), // Ajouter les autres catégories
  ];

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [fetchTodos, fetchCategories]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setShowProfileModal(false);
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil.');
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || !newTodoDescription.trim()) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const selectedCategory = categories.find((cat) => cat.name === newTodoCategory);

      const todoData = {
        title: newTodo,
        description: newTodoDescription,
      };

      if (selectedCategory) {
        todoData.category = selectedCategory.id;
      }

      await addTodo(todoData);

      setNewTodo('');
      setNewTodoDescription('');
      setNewTodoCategory('Divers');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleEditTodo = async (todo) => {
    setEditingTodo(todo.id);
    setEditingTodoTitle(todo.title);
  };

  const handleUpdateTodo = async () => {
    if (!editingTodoTitle.trim()) {
      toast.error('Veuillez fournir un titre valide.');
      return;
    }
    try {
      await updateTodo(editingTodo, { title: editingTodoTitle });
      setEditingTodo(null);
      setEditingTodoTitle('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    confirmToast(
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      async () => {
        try {
          await deleteTodo(id);
        } catch (error) {
          console.error('Error deleting todo:', error);
        }
      },
      () => {
        toast.info('Suppression annulée.');
      }
    );
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Veuillez fournir un nom de catégorie.');
      return;
    }
    try {
      await addCategory(newCategoryName);
      setNewCategoryName('');
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const filteredTodos = todos
  .filter((todo) => {
    // Filtre par statut
    switch (filter) {
      case 'active':
        return !todo.is_completed; // Tâches en cours
      case 'completed':
        return todo.is_completed; // Tâches terminées
      case 'favorite':
        return todo.is_favorite; // Tâches favorites
      default:
        return true; // Toutes les tâches
    }
  })
  .filter((todo) => {
    // Filtre par catégorie
    if (!selectedCategory) {
      return true; // Toutes les catégories
    }
    return todo.category === selectedCategory; // Filtrer par catégorie sélectionnée
  })
  .sort((a, b) => {
    // Tri par date
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB; // Plus récent ou plus ancien
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
            
            <span className="ml-2 flex text-xl font-bold text-gray-900">Task <CheckCircle className="h-8 w-8 text-indigo-600" /> Master</span>
              {/* <h1 className="text-2xl font-bold text-gray-900">Mes tâches</h1> */}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Gérer les catégories
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  <User className="h-5 w-5 mr-2" />
                  {user?.name || user?.email}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          setShowProfileModal(true)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Éditer le profil
                      </button>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <form onSubmit={handleAddTodo} className="flex gap-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Nouvelle tâche..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                aria-label="Titre de la tâche"
              />
              <input
                type="text"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                placeholder="Description de la tâche..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                aria-label="Description de la tâche"
              />
              <select
                value={newTodoCategory}
                onChange={(e) => setNewTodoCategory(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                aria-label="Catégorie de la tâche"
              >
                {Array.isArray(categories) &&
                  sortedCategories.map((category) => (
                    <option key={category.id} value={category.name}> {/* Utilisez le nom de la catégorie comme valeur */}
                      {category.name}
                    </option>
                  ))}
              </select>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter
              </button>
            </form>
          </div>

          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md ${
                filter === 'active'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md ${
                filter === 'completed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Terminées
            </button>
            <button
              onClick={() => setFilter('favorite')}
              className={`px-4 py-2 rounded-md ${
                filter === 'favorite'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Favorites
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(order => order === 'desc' ? 'asc' : 'desc')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Clock className="h-4 w-4 mr-2" />
                {sortOrder === 'desc' ? 'Plus récent' : 'Plus ancien'}
              </button>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Toutes les catégories</option>
                {Array.isArray(categories) &&
                  sortedCategories.map((category) => (
                    <option key={category.id} value={category.id}> {/* Utilisez l'ID de la catégorie comme valeur */}
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center flex-1">
                    <button
                      onClick={() => toggleTodoComplete(todo.id, 'complete')}
                      className={`p-1 rounded-full ${
                        todo.is_completed
                          ? 'text-green-600 bg-green-100' // Style pour les tâches complétées
                          : 'text-gray-400 hover:bg-green-200' // Style par défaut
                      }`}
                    >
                      <Check className="h-5 w-5" />
                    </button>
                      <div className="ml-3 flex-1">
                        {editingTodo === todo.id ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={editingTodoTitle}
                              onChange={(e) => setEditingTodoTitle(e.target.value)}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleUpdateTodo()
                              }}
                            />
                            <button
                              onClick={handleUpdateTodo}
                              className="ml-2 p-1 text-green-600 hover:text-green-700"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingTodo(null)
                                setEditingTodoTitle('')
                              }}
                              className="ml-2 p-1 text-red-600 hover:text-red-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span
                              className={`${
                                todo.completed ? 'line-through text-gray-500' : ''
                              }`}
                            >
                              {todo.title}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(todo.created_at).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => handleEditTodo(todo)}
                              className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <select
                      value={todo.category} // Utilisez l'ID de la catégorie comme valeur
                      onChange={(e) => updateTodo(todo.id, { category: e.target.value })}
                      className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      {Array.isArray(categories) &&
                        sortedCategories.map((category) => (
                          <option key={category.id} value={category.id}> {/* Utilisez l'ID comme valeur */}
                            {category.name} {/* Affichez le nom de la catégorie */}
                          </option>
                        ))}
                    </select>
                    </div>
                    <div className="flex items-center ml-4">
                    <button
                      onClick={() => toggleTodoFavorite(todo.id, 'favorite')} // Appeler toggleTodo avec l'action "favorite"
                      className={`p-1 rounded-full ${
                        todo.is_favorite
                          ? 'text-yellow-600 bg-yellow-100'
                          : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Modal de gestion des catégories */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Gérer les catégories</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  // value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nouvelle catégorie..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter
                </button>
              </div>
            </form>

            <ul className="divide-y divide-gray-200">
              {Array.isArray(categories) &&
                sortedCategories.map((category) => (
                  <li key={category.id} className="py-3">
                    {editingCategory === category.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => {
                            updateCategory(category.id, newCategoryName);
                            setEditingCategory(null);
                            setNewCategoryName('');
                          }}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        {category.name !== "Divers" && ( // Masquer les icônes pour "Divers"
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCategory(category.id);
                                setNewCategoryName(category.name);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
            </ul>

          </div>
        </div>
      )}

      {/* Modal de profil */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Éditer le profil</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard