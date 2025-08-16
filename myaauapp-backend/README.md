AAU GST Backend
Project Overview
The AAU GST Backend is the central nervous system of the AAU GST App. It is a robust and scalable RESTful API built with Django and Django REST Framework. This backend serves as the single source of truth for the web and mobile applications, handling all data storage, business logic, and user authentication.

Core Features
RESTful API: Provides well-defined API endpoints for all frontend operations, including user management, quiz data, and marketplace interactions.

Secure Authentication: Utilizes JWT (JSON Web Tokens) for secure, stateless user authentication, ensuring that only authenticated users can access protected resources.

Database Management: Uses PostgreSQL (version 17) to provide a powerful, reliable, and scalable database solution.

Cross-Origin Resource Sharing (CORS): Properly configured to allow the React web and mobile apps to securely communicate with the API.

Background Tasks: Manages non-critical, time-consuming tasks in the background to ensure the main application remains responsive.

Technology Stack
Backend Framework: Django (v5.2.3)

API Framework: Django REST Framework (v3.16.0)

Database: PostgreSQL (v17)

Authentication: djangorestframework_simplejwt and dj-rest-auth

Dependencies: The complete list of required packages can be found in the requirements.txt file. Key packages include:

asgiref

beautifulsoup4

dj-rest-auth

django-allauth

django-cors-headers

djangorestframework

djangorestframework_simplejwt

pillow (for image processing)

psycopg2-binary (PostgreSQL adapter)

Local Development
Follow these steps to get the backend API running on your local machine.

Prerequisites
Python (v3.9+)

PostgreSQL (v17+)

Step-by-Step Instructions
Clone the repository:

git clone https://github.com/unityaaron/MyAauApp

(Note: If you have already cloned the repository, you can skip this step.)

Navigate to the backend folder:

cd AAU-GST-App/myaauapp-backend

Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate      # On Windows

Install project dependencies:

pip install -r requirements.txt

Create your PostgreSQL database:
Make sure you have a PostgreSQL database named aau_gst_db and that your database credentials are set up correctly in your Django settings file.

Run database migrations:

python manage.py migrate

Start the development server:

python manage.py runserver

The API will now be running and accessible at http://localhost:8000.

Key Accomplishments & Learnings
API Design: Successfully designed and implemented a RESTful API to serve multiple frontend clients.

Database Modeling: Gained hands-on experience with database schemas and relationships using Django's ORM.

Secure Authentication: Implemented a modern, token-based authentication system, a critical skill for any web developer.

Project Structure: Built a scalable backend with a clear and logical folder structure, following industry best practices.