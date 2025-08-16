AAU GST Mobile App
Project Overview
The AAU GST Mobile App is the cross-platform mobile client for the AAU GST App ecosystem. Built with React Native and Expo, it delivers a native-like experience on both Android and iOS devices. The app provides essential features like a secure quiz module and a peer-to-peer marketplace, all while communicating with a centralized Django REST API.

Core Features
Cross-Platform Compatibility: Developed from a single codebase to run seamlessly on both Android and iOS devices, demonstrating an efficient development approach.

Expo Framework: Leverages the Expo framework to simplify the build process and provide a smooth developer experience.

Secure Authentication & Storage: Manages user authentication securely using JWT tokens and stores them safely with Expo Secure Store.

Mobile-Optimized UI: Features a mobile-first user interface with intuitive navigation using React Navigation.

Dynamic Content Integration: Fetches and displays real-time data from the Django API for quizzes, marketplace listings, and user profiles.

Technology Stack
Frontend Framework: React Native

Build Tool: Expo

Navigation: React Navigation

API Client: Axios

Secure Storage: Expo Secure Store, AsyncStorage

Local Development
Follow these steps to get the mobile application running on your local machine.

Prerequisites
Node.js and npm (or yarn) installed.

The Django backend project must be running locally on http://localhost:8000.

Expo Go app on your physical phone (or a mobile simulator).

Step-by-Step Instructions
Clone the repository:

git clone https://github.com/unityaaron/MyAauApp

(Note: If you have already cloned the repository, you can skip this step.)

Navigate to the mobile app folder:

cd AAU-GST-App/myaauapp-mobile

Install project dependencies:

npm install

Start the Expo development server:

npx expo start

This will open a new browser tab with a QR code.

Run the app:

On a physical device: Open the Expo Go app on your phone and scan the QR code.

In a simulator: Press a in your terminal to open an Android emulator or i to open an iOS simulator.

Key Accomplishments & Learnings
Cross-Platform Development: Gained practical experience in building and debugging an app that works on multiple mobile platforms from a single codebase.

Mobile-Specific APIs: Learned to work with mobile-specific APIs like Secure Store for secure data handling.

Mobile App Debugging: Developed skills in debugging mobile applications, including managing device logs and network requests.

User Experience (UX) for Mobile: Focused on creating a clean, responsive, and intuitive user experience tailored for the mobile environment.