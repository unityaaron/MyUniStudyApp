AAU GST App: A Full-Stack Web & Mobile Platform
Project Summary
The AAU GST App is a modern, student-focused platform designed to streamline campus life at Ambrose Alli University. It provides essential services like secure user authentication, a dynamic buy-and-sell marketplace, and an educational quiz module for GST (General Studies) courses and other first year courses. The project is a full-stack application consisting of a cross-platform mobile app (built with React Native) and a single-page web application (built with React), both powered by a unified Django backend API.

Recruiter TL;DR
As a Solo-Developer I built a real, full-stack, cross-platform application with secure JWT authentication and a RESTful API. The project demonstrates proficiency in modern frontend frameworks (React, React Native), backend development (Django), and database management (PostgreSQL). Features include quizzes, a dynamic marketplace, and robust user management, all built with a clean, modular architecture.

Table of Contents
Overview

Core Features

Technology Stack

Architecture

Project Structure

API Contract (Selected Endpoints)

Database (Conceptual)

Local Development (Backend)

Local Development (Web App)

Local Development (Mobile App)

Key Accomplishments & Learnings

Roadmap

Contact

Overview
Goal: To provide Ambrose Alli University students with a smooth, centralized platform to prepare for their GST courses, engage with the student community, and manage their campus life. The app aims to solve common student challenges by offering mini-lessons, quizzes, and a peer-to-peer marketplace.

What I built:

A single-page web application using React v19.1.0 with Vite for fast development.

A cross-platform mobile app for both Android & iOS using React Native and Expo.

A secure backend using Django 5.2.x, PostgreSQL 17, and Django REST Framework.

Clean, modular applications for key features with reusable UI components.

Why it matters: This project demonstrates the ability to build and deploy a real-world application from the ground up, covering both frontend and backend development. It showcases proficiency in tackling complex challenges like API security, state management, and building for multiple platforms from a single codebase.

Core Features
Auth & Profiles: A robust and secure user authentication system for both registration and login. Users can edit their profiles and manage their account details.

Quizzes & Past Questions: A dedicated module for timed quizzes with instant feedback and explanations to help students prepare for their GST exams.

Dynamic Marketplace: A peer-to-peer section where students can list items for sale and browse items from other users, simplifying campus transactions.

Leaderboard (Top Scorers): A dynamic leaderboard that tracks and saves user quiz scores, fostering a competitive and engaging learning environment.

Jobs & Scholarships: An automated feature that scrapes job and scholarship opportunities from various sites using Django background tasks, providing students with valuable career resources.

API Integration: The frontend applications seamlessly communicate with the custom-built Django REST API, handling data requests and responses for all dynamic content.

Responsive Design: The React web app is architected for a fully responsive layout, ensuring it is accessible and visually consistent across all devices (desktops, tablets, and phones).

Cross-Platform Development: Utilized React Native to build a single codebase that delivers a native-like user experience on both iOS and Android devices.

Technology Stack
Category

Technologies Used

Frontend (Web)

React (v19.1.0), Vite, React Router DOM (v7.6.0), React Hooks, Axios

Frontend (Mobile)

React Native, Expo, React Navigation, Axios, Expo Secure Store, AsyncStorage

Backend

Django (5.2.x), Django REST Framework, dj-rest-auth, Simple JWT, PostgreSQL (v17), corsheaders

Tooling

Git, GitHub

Architecture
This project follows a clean, layered approach, separating the user interface from the backend logic. This ensures that both the web and mobile applications can interact with the same API without being tightly coupled to the backend implementation.

High-level diagram:

[React Web & React Native App]
   ├─ UI Components / Screens
   ├─ State Management (React Hooks)
   ├─ Services (Axios for API calls)
   └─ Storage (for tokens & data)
          │
          ▼
[Django REST API]
   ├─ Auth (dj-rest-auth + JWT)
   ├─ Quizzes & Marketplace Modules
   └─ Admin & Announcements
          │
          ▼
[PostgreSQL 17]

Project Structure
The repository is organized to clearly separate the frontend and backend concerns, which is a standard industry practice for scalable projects.

AAU-GST-App/
├── backend/                  # Django REST API project
│   ├── buyandsell/           # App for marketplace and user profiles
│   ├── quiz/                 # App for the quiz module
│   └── ...
├── myaauapp-web/             # React web application
│   ├── public/
│   ├── src/
│   └── ...
├── myaauapp-mobile/          # React Native mobile application
│   ├── screens/
│   └── ...
└── README.md                 # This file

API Contract (Selected Endpoints)
This is a selection of the primary endpoints used by the frontend applications.

POST /auth/login/: Handles user login and returns JWT access and refresh tokens.

POST /auth/register/: Creates a new user account.

GET /user/me/: Retrieves the currently authenticated user's profile information.

GET /quizzes/: Fetches a list of all available quizzes.

POST /quizzes/{id}/submit/: Submits user answers for a quiz and returns the score.

GET /market/items/: Retrieves a list of all items in the marketplace.

POST /market/items/: Allows an authenticated user to post a new item for sale.

Database (Conceptual)
The PostgreSQL database is structured to support the core features of the application. The use of a relational database ensures data integrity and scalability.

users: Stores user account information (ID, name, email, password hash).

quizzes: Stores quiz metadata (ID, title, description).

questions: Stores the questions for each quiz, including the correct answers.

market_items: Stores all marketplace listings (ID, seller_id, title, price, description).

Local Development (Backend)
Follow these steps to get the backend server running on your machine.

Clone the repository and navigate into the backend folder:

git clone https://github.com/unityaaron/MyAauApp
cd AAU-GST-App/backend

Create and activate a virtual environment:

# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Configure .env and run migrations:

Create a .env file in the backend directory.

Add your PostgreSQL database URL and other environment variables.

Run Django migrations to set up the database schema.

python manage.py makemigrations
python manage.py migrate

Start the server:

python manage.py runserver

The backend API will be available at http://localhost:8000.

Local Development (Web App)
Follow these steps to run the React web application.

Navigate to the myaauapp-web folder:

cd AAU-GST-App/myaauapp-web

Install NPM packages:

npm install

Start the development server:

npm run dev

The web app will be available at http://localhost:5173.

Local Development (Mobile App)
Follow these steps to run the React Native mobile application.

Navigate to the myaauapp-mobile folder:

cd AAU-GST-App/myaauapp-mobile

Install NPM packages:

npm install

Start the Expo server:

npx expo start

This will start the Expo development server. You can scan the QR code with your phone or run the app in a simulator.

Key Accomplishments & Learnings
Full-Stack Proficiency: Gained hands-on experience in building a complete application from the database and backend logic to the user-facing frontend.

API Security & Integration: Mastered handling secure API communication, including debugging and resolving CORS and CSRF token issues between a standalone client and a Django backend.

Database Management: Developed a strong understanding of PostgreSQL, including data modeling, migrations, and database schema design.

Cross-Platform Development: Demonstrated the ability to build and maintain two separate applications that communicate with the same API, showcasing adaptability and knowledge of different frontend environments.

Roadmap
Payment Method Integration: Implement secure payment gateways to handle in-app purchases.

More Courses: Expand the platform to include a wider variety of courses and subjects.

AI Task Helper Integration: Integrate an AI assistant to help students with their academic tasks.

Contact
For any questions, feel free to contact me:

Name: Unity Aaron
Email: aaronunity1@gmail.com
LinkedIn: https://www.linkedin.com/in/unity-aaron-b4a281226
