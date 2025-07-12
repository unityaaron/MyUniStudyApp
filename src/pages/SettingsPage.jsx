import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
  // Set the theme from localStorage or use "light"
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Set reminders from localStorage (convert string to true/false)
  const [remindersOn, setRemindersOn] = useState(
    localStorage.getItem("reminders") === "true"
  );

  // Ask permission once when component loads
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // This checks every minute to see if it's 8:00 PM
  useEffect(() => {
    const checkReminder = setInterval(() => {
      const now = new Date();
      if (
        now.getHours() === 20 &&
        now.getMinutes() === 0 &&
        remindersOn &&
        Notification.permission === "granted"
      ) {
        new Notification("🧠 Time to Study!", {
          body: "Open your AAU GST app and revise now!",
        });
      }
    }, 60000); // every 60 seconds

    return () => clearInterval(checkReminder); // stop when not needed
  }, [remindersOn]);

  // Turn reminders ON or OFF
  const toggleReminders = () => {
    const newValue = !remindersOn;
    setRemindersOn(newValue);
    localStorage.setItem("reminders", newValue);
  };

  // Change theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="content">
      <h1>WE WOULD CHANGE THIS PAGE LATER BY USING BACKEND NOTIFICATIONS</h1>
      <h2>Settings</h2>

      {/* Reminders Toggle with Checkbox */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '18px' }}>
          <input
            type="checkbox"
            checked={remindersOn}
            onChange={toggleReminders}
            style={{ marginRight: '10px' }}
          />
          ⏰ Study Reminders: {remindersOn ? 'ON (8:00 PM)' : 'OFF'}
        </label>
      </div>

      {/* Theme Toggle Button */}
      <div>
        <p style={{ fontSize: '18px' }}>
          🌗 Theme: {theme === "light" ? "Light" : "Dark"}
          <button
            onClick={toggleTheme}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '6px',
              border: '1px solid gray',
              backgroundColor: '#f0f0f0',
            }}
          >
            Toggle Theme
          </button>
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
