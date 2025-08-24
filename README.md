# AAU GST App: A Full-Stack Web & Mobile Platform

### App Screenshots

| React-Native Login Page | React-Native Home Page |
| :---: | :---: |
| ![Login Page Screenshot](https://github.com/unityaaron/MyUniStudyApp/issues/21#issue-3349511503) | ![Home Page Screenshot](https://github.com/unityaaron/MyUniStudyApp/issues/22) |

| React-Native Quiz Page | React-Native About Page |
| :---: | :---: |
| ![Quiz Page Screenshot](https://github.com/unityaaron/MyUniStudyApp/issues/23) | ![About Page Screenshot](https://github.com/unityaaron/MyUniStudyApp/issues/24) |

| Cloud Deployment of React Frontend, Django Backend & Postgresql  | Live Cloud Deployment |
| :---: | :---: |
| ![Cloud Deployment of React Frontend, Django Backend & Postgresql Screenshot](https://github.com/unityaaron/MyUniStudyApp/issues/30#issue-3349587810) | ![Live Cloud Deployment Screenshot](https://github.com/unityaaron/MyUniStudyApp/issues/31#issue-3349588358) |

**Project Summary**

The AAU GST App is a modern, student-focused platform designed to streamline campus life at Ambrose Alli University. It provides essential services like secure user authentication, a dynamic buy-and-sell marketplace, and an educational quiz module for GST (General Studies) courses and other first-year courses. The project is a full-stack application consisting of a cross-platform mobile app (built with React Native) and a single-page web application (built with React), both powered by a unified Django backend API. This entire platform has been successfully deployed and is live in the cloud.

**Recruiter TL;DR**

As a Solo-Developer, I built a real, full-stack, cross-platform application with secure JWT authentication and a RESTful API. The project demonstrates proficiency in modern frontend frameworks (React, React Native), backend development (Django), and database management (PostgreSQL), with a successful end-to-end deployment to the Render cloud platform. Features include quizzes, a dynamic marketplace, and robust user management, all built with a clean, modular architecture.

---

**Table of Contents**

* [App Screenshots](#app-screenshots)
* [Overview](#overview)
* [Live Deployment](#live-deployment)
* [Core Features](#core-features)
* [Technology Stack](#technology-stack)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [API Contract (Selected Endpoints)](#api-contract-selected-endpoints)
* [Database (Conceptual)](#database-conceptual)
* [Local Development (Backend)](#local-development-backend)
* [Local Development (Web App)](#local-development-web-app)
* [Local Development (Mobile App)](#local-development-mobile-app)
* [Key Accomplishments & Learnings](#key-accomplishments--learnings)
* [Roadmap](#roadmap)
* [Contact](#contact)

---

### Overview

**Goal:** To provide Ambrose Alli University students with a smooth, centralized platform to prepare for their GST courses, engage with the student community, and manage their campus life. The app aims to solve common student challenges by offering mini-lessons, quizzes, and a peer-to-peer marketplace.

**What I built:**
* A single-page web application using React v19.1.0 with Vite for fast development.
* A cross-platform mobile app for both Android & iOS using React Native and Expo.
* A secure backend using Django 5.2.x, PostgreSQL 17, and Django REST Framework.
* Clean, modular applications for key features with reusable UI components.

**Why it matters:** This project demonstrates the ability to build and deploy a real-world application from the ground up, covering both frontend and backend development. It showcases proficiency in tackling complex challenges like API security, state management, and building for multiple platforms from a single codebase. The successful deployment to the cloud validates the entire end-to-end development process.

### Live Deployment

**The AAU GST App is now live!** You can access the live version of the web application and its backend API.

* **Live Web App:** `https://myuni-studyapp.onrender.com`
* **Live Backend API:** `https://myaauapp-backend.onrender.com`

---

### Core Features

* **Auth & Profiles:** A robust and secure user authentication system for both registration and login. Users can edit their profiles and manage their account details.
* **Quizzes & Past Questions:** A dedicated module for timed quizzes with instant feedback and explanations to help students prepare for their GST exams.
* **Dynamic Marketplace:** A peer-to-peer section where students can list items for sale and browse items from other users, simplifying campus transactions.
* **Leaderboard (Top Scorers):** A dynamic leaderboard that tracks and saves user quiz scores, fostering a competitive and engaging learning environment.
* **Jobs & Scholarships:** An automated feature that scrapes job and scholarship opportunities from various sites using Django background tasks, providing students with valuable career resources.
* **API Integration:** The frontend applications seamlessly communicate with the custom-built Django REST API, handling data requests and responses for all dynamic content.
* **Responsive Design:** The React web app is architected for a fully responsive layout, ensuring it is accessible and visually consistent across all devices (desktops, tablets, and phones).
* **Cross-Platform Development:** Utilized React Native to build a single codebase that delivers a native-like user experience on both iOS and Android devices.

---

### Technology Stack

| Category | Technologies Used |
| :--- | :--- |
| Frontend (Web) | React (v19.1.0), Vite, React Router DOM (v7.6.0), React Hooks, Axios |
| Frontend (Mobile) | React Native, Expo, React Navigation, Axios, Expo Secure Store, AsyncStorage |
| Backend | Django (5.2.x), Django REST Framework, dj-rest-auth, Simple JWT, PostgreSQL (v17), corsheaders |
| Tooling | Git, GitHub, Render (for cloud deployment) |

---

### Architecture

This project follows a clean, layered approach, separating the user interface from the backend logic. This ensures that both the web and mobile applications can interact with the same API without being tightly coupled to the backend implementation.

**High-level diagram:**

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

---

### Project Structure

The repository is organized to clearly separate the frontend and backend concerns, which is a standard industry practice for scalable projects.