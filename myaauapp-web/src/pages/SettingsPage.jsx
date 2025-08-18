// src/pages/SettingsPage.jsx

import React, { useContext, useState, useEffect } from 'react'; // ✅ Modified: Import useState and useEffect
import axios from 'axios'; // ✅ New: Import axios
import { useNavigate } from 'react-router-dom'; // ✅ New: Import useNavigate for redirection
import { ThemeContext } from '../context/ThemeContext';

function SettingsPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // ✅ New: State for notification setting and loading/error
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Default to true
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationsError, setNotificationsError] = useState('');

  const navigate = useNavigate(); // For redirecting if token invalid

  // ✅ New: useEffect to fetch initial notification setting from Django
  useEffect(() => {
    const fetchNotificationSetting = async () => {
      setLoadingNotifications(true);
      setNotificationsError('');
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          // If no token, user is not logged in, cannot fetch/set preference
          setNotificationsError('You are not logged in. Cannot load notification settings.');
          setLoadingNotifications(false);
          navigate('/login'); // Redirect to login page
          return;
        }

        // Make a GET request to Django's UserProfile API to get current settings
        const response = await axios.get(import.meta.env.VITE_API_URL + '/api/buyandsell/user-profile/', {
          headers: {
            'Authorization': `Token ${authToken}` // Authenticate the request
          }
        });
        // Set the state based on the fetched value
        setNotificationsEnabled(response.data.notifications_enabled);
        console.log("Notification setting fetched:", response.data.notifications_enabled);

      } catch (err) {
        console.error('Error fetching notification setting:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setNotificationsError('Session expired. Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/login');
        } else {
          setNotificationsError('Failed to load notification settings.');
        }
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotificationSetting();
  }, [navigate]); // navigate is a stable dependency

  // ✅ New: Function to handle changing the notification setting
  const handleNotificationsToggle = async () => {
    // Optimistic UI update: change the UI immediately, then send to server
    const newSetting = !notificationsEnabled; // Calculate the new state (flip current)
    setNotificationsEnabled(newSetting); // Update UI immediately

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setNotificationsError('Not logged in. Cannot save notification setting.');
        navigate('/login');
        return;
      }

      // Send a PATCH request to Django's UserProfile API to update only 'notifications_enabled'
      const response = await axios.patch(
        import.meta.env.VITE_API_URL + '/api/buyandsell/user-profile/',
        { notifications_enabled: newSetting }, // Send only the changed field
        {
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Notification setting updated on backend:', response.data);
      // If the backend sends back the updated data, you could optionally re-set state:
      // setNotificationsEnabled(response.data.notifications_enabled);

      setNotificationsError(''); // Clear any previous errors on success

    } catch (err) {
      console.error('Error updating notification setting:', err);
      // If update fails, revert UI and show error
      setNotificationsEnabled(!newSetting); // Revert to old state
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setNotificationsError('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        setNotificationsError('Failed to save notification settings.');
      }
    }
  };


  // Display the component JSX
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>App Settings</h2>

      {/* Theme Settings Section */}
      <div style={{
        border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#555555'}`,
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: theme === 'light' ? '#f9f9f9' : '#444444',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}>
        <h3>Theme Mode</h3>
        <p>Current Theme: <strong>{theme.charAt(0).toUpperCase() + theme.slice(1)} Mode</strong></p>

        <button
          onClick={toggleTheme}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--button-bg-color)',
            color: 'var(--button-text-color)',
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


      {/* Notifications Settings Section */}
      <div style={{
        border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#555555'}`,
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: theme === 'light' ? '#f9f9f9' : '#444444',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}>
        <h3>Notifications</h3>

        {loadingNotifications ? ( // Show loading message for notifications
          <p>Loading notification settings...</p>
        ) : notificationsError ? ( // Show error if fetching failed
          <p style={{ color: 'red' }}>Error: {notificationsError}</p>
        ) : ( // Show the actual checkbox if loaded successfully
          <> {/* Use a React Fragment to group multiple elements */}
            <label style={{ display: 'block', marginTop: '10px' }}>
                <input
                    type="checkbox"
                    checked={notificationsEnabled} // Link checkbox state to our notificationsEnabled variable
                    onChange={handleNotificationsToggle} // Call our toggle function when checkbox changes
                    style={{ marginRight: '8px' }}
                />
                Receive App Notifications
            </label>
            {/* Display a small message after successful update, when not loading and no error */}
            {/* This message will only show if notifications loaded, no error, and not currently loading */}
            <p style={{ fontSize: '0.8em', color: theme === 'light' ? '#777' : '#bbb', marginTop: '5px' }}>
                Your preference will be saved automatically.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;