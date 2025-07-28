// src/pages/SettingsPage.jsx

import React, { useContext } from 'react'; // Import useContext to "tune into" the context
import { ThemeContext } from '../context/ThemeContext'; // Import our ThemeContext radio station

function SettingsPage() {
  // 1. Tune into the ThemeContext radio station
  //    We're asking for the current 'theme' and the 'toggleTheme' button.
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>App Settings</h2>

      {/* Theme Settings Section */}
      <div style={{
        border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#555555'}`, // Border color changes with theme
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: theme === 'light' ? '#f9f9f9' : '#444444', // Background color changes
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}>
        <h3>Theme Mode</h3>
        <p>Current Theme: <strong>{theme.charAt(0).toUpperCase() + theme.slice(1)} Mode</strong></p> {/* Shows "Light Mode" or "Dark Mode" */}

        <button
          onClick={toggleTheme} // When button is clicked, call our toggleTheme function
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--button-bg-color)', // Uses CSS variable for button color
            color: 'var(--button-text-color)',         // Uses CSS variable for button text
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      {/* Notifications Settings Section (We'll work on this later!) */}
      <div style={{
        border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#555555'}`,
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: theme === 'light' ? '#f9f9f9' : '#444444',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}>
        <h3>Notifications</h3>
        <p>Notification settings will go here.</p>
        {/* Example of a placeholder for notification toggle */}
        <label style={{ display: 'block', marginTop: '10px' }}>
            <input type="checkbox" disabled /> Receive Email Notifications (Coming Soon)
        </label>
      </div>
    </div>
  );
}

export default SettingsPage;