# Backend Documentation

## Overview
This backend provides a robust API for a TODO application, handling user authentication, task management, and task categorization. The backend is built with Django, Django Rest Framework (DRF), and PostgreSQL for the database.

---

## Features
- **Authentication**:
  - User registration, login, and logout.
  - JSON Web Token (JWT) for secure user authentication.
- **Task Management**:
  - Create, retrieve, update, and delete tasks.
  - Mark tasks as completed or favorite (toggle functionality).
- **Categorization**:
  - Categorize tasks with predefined or user-defined categories.
  - Default category "Divers" for uncategorized tasks.
  - Change task categories via a dedicated route.
- **Advanced Filters**:
  - Filter tasks by completion or favorite status.
  - Pagination for task listings.

---

## Installation and Setup

### Prerequisites
- Python 3.10+
- PostgreSQL
- pip

### Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Set Up a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the project root and add:
   ```env
   SECRET_KEY=<your-secret-key>
   DEBUG=True
   ALLOWED_HOSTS=127.0.0.1,localhost

   DATABASE_NAME=<your-database-name>
   DATABASE_USER=<your-database-user>
   DATABASE_PASSWORD=<your-database-password>
   DATABASE_HOST=127.0.0.1
   DATABASE_PORT=5432

   ACCESS_TOKEN_LIFETIME=60
   REFRESH_TOKEN_LIFETIME=1
   ROTATE_REFRESH_TOKENS=True
   BLACKLIST_AFTER_ROTATION=True
   ```

5. **Configure the Database**:
   Ensure PostgreSQL is running and create the database:
   ```sql
   CREATE DATABASE <your-database-name>;
   ```

6. **Apply Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Run the Server**:
   ```bash
   python manage.py runserver
   ```

---

## API Endpoints

### **Authentication**

- **Register User**: `POST /api/auth/register/`
  - Request Body:
    ```json
    {
        "username": "exampleuser",
        "email": "example@example.com",
        "password": "password123"
    }
    ```

- **Login**: `POST /api/auth/login/`
  - Request Body:
    ```json
    {
        "email": "example@example.com",
        "password": "password123"
    }
    ```

- **Logout**: `POST /api/auth/logout/`

### **Task Management**

- **List Tasks**: `GET /api/todos/`
- **Create Task**: `POST /api/todos/`
  - Request Body:
    ```json
    {
        "title": "Buy groceries",
        "description": "Milk, bread, eggs",
        "category": "<category-id>"
    }
    ```

- **Update Task**: `PUT /api/todos/<uuid>/`
- **Delete Task**: `DELETE /api/todos/<uuid>/`

### **Task Actions**

- **Mark as Completed/Favorite**: `PATCH /api/todos/<uuid>/toggle/`
  - Request Body:
    ```json
    {
        "action": "complete"  # or "favorite"
    }
    ```

- **Update Category**: `PATCH /api/todos/<uuid>/update-category/`
  - Request Body:
    ```json
    {
        "category": "<category-id>"
    }
    ```

### **Categories**

- **List Categories**: `GET /api/categories/`
- **Create Category**: `POST /api/categories/`
  - Request Body:
    ```json
    {
        "name": "Work"
    }
    ```

---

## Testing the API

1. Use tools like Postman or curl to test endpoints.
2. Ensure the `Authorization` header is set for protected routes:
   ```http
   Authorization: Bearer <access-token>
   ```

---

## Pagination
- Default page size: 10 tasks.
- Use query parameters to navigate:
  - `?page=2` for the second page.

---

## Additional Notes
- Ensure that the `.env` file is not included in version control by adding it to `.gitignore`.
- The default category "Divers" is automatically assigned for uncategorized tasks.

---

## Next Steps
- Add unit tests for critical functionalities.
- Optimize the database with indexing for frequently queried fields.
- Extend the API for advanced task analytics (e.g., task completion rates).

