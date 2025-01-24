Voici une version stylée et structurée de ton README : 

---

# 🌟 **Frontend de l'Application de Gestion des Tâches** 🌟

Ce projet constitue le **frontend** d'une application web développée avec **React**. Il offre aux utilisateurs une interface élégante pour **gérer leurs tâches**, **s'authentifier** et interagir facilement avec l'application.

---

## ✨ **Fonctionnalités**

### 🔐 **Authentification**
- **Connexion (Login)**  
- **Inscription (Register)**  
- **Déconnexion (Logout)**  
- Gestion des **tokens d'accès** et de **rafraîchissement**  

### ✅ **Gestion des Tâches**
- **Ajouter** une tâche  
- **Modifier** une tâche  
- **Supprimer** une tâche  
- Marquer une tâche comme **complétée**  
- Marquer une tâche comme **favorite**  
- **Filtrer** les tâches :
  - **Par statut** : toutes, en cours, terminées, favorites  
  - **Par catégorie**
- **Trier** les tâches par **date** (plus récentes ou plus anciennes)

### 🗂️ **Gestion des Catégories**
- **Ajouter** une catégorie  
- **Modifier** une catégorie  
- **Supprimer** une catégorie  
- La catégorie **"Divers"** est protégée : **ni modifiable ni supprimable**

### 🔔 **Notifications**
- Utilisation de **React Toastify** pour afficher des notifications conviviales en cas de **succès** ou **erreur**.

---

## 🛠️ **Technologies Utilisées**
- **React** : Construction de l'interface utilisateur.  
- **React Router** : Gestion des routes et navigation.  
- **Axios** : Requêtes HTTP vers le backend.  
- **React Toastify** : Notifications utilisateur.  
- **Tailwind CSS** : Style rapide et moderne.  
- **Lucide React** : Icônes élégantes pour l'interface.

---

## 🚀 **Prérequis**

Avant de commencer, assurez-vous d'avoir installé :  
- **Node.js** (version 16 ou supérieure)  
- **npm** (gestionnaire de paquets Node.js)  

---

## ⚙️ **Installation**

1. **Installer les dépendances** :  
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement** :  
   Créez un fichier `.env` à la racine du projet et ajoutez-y :  
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   ```
   🔄 Remplacez `http://localhost:8000` par l'URL de votre backend.

3. **Démarrer l'application** :  
   ```bash
   npm run dev
   ```
   🌐 Accédez à l'application sur : **[http://localhost:5173](http://localhost:5173)**

---

## 📁 **Structure du Projet**

```plaintext
client/
├── public/                  # Fichiers statiques (images, etc.)
├── src/                     # Code source de l'application
│   ├── assets/              # Assets (styles, images, etc.)
│   ├── components/          # Composants React réutilisables
│   ├── contexts/            # Contextes React (ex : AuthContext)
│   ├── pages/               # Pages de l'application
│   ├── App.jsx              # Composant principal
│   ├── main.jsx             # Point d'entrée de l'application
│   └── ...                  # Autres fichiers
├── .env                     # Variables d'environnement
├── .gitignore               # Fichiers ignorés par Git
├── package.json             # Dépendances et scripts du projet
├── README.md                # Documentation
└── ...
```

---

## 📜 **Scripts Disponibles**

- **Démarrer en développement** :  
  ```bash
  npm run dev
  ```
- **Compiler pour la production** :  
  ```bash
  npm run build
  ```
- **Vérifier le code avec ESLint** :  
  ```bash
  npm run lint
  ```
- **Prévisualiser la version production localement** :  
  ```bash
  npm run preview
  ```

---

## 🎯 **Améliorations Futures**
- Implémenter un mode sombre avec **Tailwind CSS**.  
- Ajouter des tests unitaires avec **Jest** et **React Testing Library**.  
- Optimiser les performances via le **lazy loading** des composants.

---