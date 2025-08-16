AAU GST Web App
Project Overview
The AAU GST Web App is the web-based client for the larger AAU GST App ecosystem. It is a modern, responsive single-page application (SPA) designed to provide Ambrose Alli University students with a seamless web experience for managing their profiles, taking quizzes, and interacting with the student marketplace. The application consumes a RESTful API built with Django.

Core Features
Responsive User Interface: The app is built with a responsive design, ensuring a consistent and optimal user experience across various devices and screen sizes, from desktops to mobile phones.

Secure User Authentication: Users can securely register and log in to their accounts, with authentication handled via JWT tokens.

Smooth Client-Side Routing: Utilizes React Router DOM to manage navigation between different views (e.g., Home, Quizzes, Marketplace) without requiring full page reloads.

Dynamic Content Integration: Fetches dynamic content from a centralized Django REST API, powering features like quizzes and marketplace listings.

State Management: Efficiently manages application state using built-in React Hooks (useState, useEffect), ensuring UI updates are handled correctly and predictably.

Technology Stack
Frontend Framework: React (v19.1.0)

Build Tool: Vite

Routing: React Router DOM (v7.6.0)

API Client: Axios

Styling: Custom CSS and responsive design principles

Local Development
Follow these steps to get the web application running on your local machine.

Prerequisites
Node.js and npm (or yarn) installed.

The Django backend project must be running locally on http://localhost:8000.

Step-by-Step Instructions
Clone the repository:

git clone https://github.com/unityaaron/MyAauApp

(Note: If you have already cloned the repository, you can skip this step.)

Navigate to the web app folder:

cd AAU-GST-App/myaauapp-web

Install project dependencies:

npm install

Start the development server:

npm run dev

The application will now be running and accessible at http://localhost:5173.

Key Accomplishments & Learnings
Single-Page Application (SPA) Development: Gained hands-on experience in building a modern SPA, demonstrating a strong understanding of client-side architecture.

API Integration: Successfully consumed a custom REST API, handling requests and responses to display and update dynamic data.

Component-Based Architecture: Utilized React's component model to build a modular and scalable user interface with reusable components.

Responsive Design: Architected a UI that provides a great user experience on any device, a crucial skill for modern web development.


Contact
For any questions, feel free to contact me:

Name: Unity Aaron
Email: aaronunity1@gmail.com
LinkedIn: https://www.linkedin.com/in/unity-aaron-b4a281226