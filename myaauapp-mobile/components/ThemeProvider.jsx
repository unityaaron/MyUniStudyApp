// context/ThemeProvider.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Step 1: Create the bulletin board (the Context).
// We are giving it a name: `ThemeContext`.
const ThemeContext = createContext();

// Step 2: Create a function (a "hook") to make it easy for any screen
// to read the bulletin board.
// We will use this in our other screens.
export const useTheme = () => useContext(ThemeContext);

// Step 3: This is the main ThemeProvider component.
// We will wrap our entire app with this component.
export const ThemeProvider = ({ children }) => {
  // We'll use the device's color scheme as the initial theme.
  const deviceTheme = useColorScheme();

  // The main sticky note for the entire app.
  // We use `useState` to keep track of the theme.
  // It starts with whatever the device's theme is.
  const [theme, setTheme] = useState(deviceTheme);

  // This robot (useEffect) watches for changes in the device's theme.
  useEffect(() => {
    // If the device's theme changes, we update our app's theme to match.
    // This makes sure our app responds to the user's phone settings.
    setTheme(deviceTheme);
  }, [deviceTheme]); // The robot wakes up whenever `deviceTheme` changes.

  // A function to let other screens toggle the theme.
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // We are putting the `theme` and the `toggleTheme` function
  // on the bulletin board for the rest of the app to use.
  const value = { theme, toggleTheme };

  return (
    // This is like putting up the bulletin board for all the child components.
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
