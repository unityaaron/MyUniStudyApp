// src/context/ThemeContext.jsx

import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Theme Context
//    This is like creating the main radio channel.
//    It starts empty, but will later hold our theme and a way to change it.
export const ThemeContext = createContext(null); // Default value is null for now

// 2. Create the Theme Provider Component
//    This is like setting up the radio's broadcast tower.
//    It will wrap around all the parts of your app that need to "hear" the theme.
export const ThemeProvider = ({ children }) => {
  // 3. State to hold the current theme
  //    We try to get the theme from the computer's memory (localStorage) first.
  //    If it's not there, we start with 'light' as the default.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme'); // Check sticky note
    return savedTheme || 'light'; // Use what's on the note, or 'light' if no note
  });

  // 4. useEffect to save theme and apply to the whole page (body)
  //    This is like an assistant who, every time the theme changes:
  //    a) Updates the sticky note in the computer's memory.
  //    b) Tells the main page (body) to change its "skin" (class name).
  useEffect(() => {
    localStorage.setItem('appTheme', theme); // Save theme to sticky note
    document.body.className = theme; // Add 'light' or 'dark' class to the <body> tag
  }, [theme]); // This effect runs whenever the 'theme' state changes

  // 5. Function to toggle (switch) the theme
  //    This is the special button that switches the theme from light to dark or vice-versa.
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 6. Provide the theme and the toggle function to all "listeners"
  //    This is the broadcast from our radio station.
  //    Anyone wrapped by ThemeProvider can now use 'theme' and 'toggleTheme'.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children} {/* This is where all your app's pages will go */}
    </ThemeContext.Provider>
  );
};