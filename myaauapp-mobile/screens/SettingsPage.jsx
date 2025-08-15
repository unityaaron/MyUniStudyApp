// screens/SettingsPage.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../components/ThemeProvider';
import { API_URL } from '../constants/api'; // ✅ Import the API URL constant

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationsError, setNotificationsError] = useState('');

  // 🤖 This robot's job is to get the current notification setting from the server.
  useEffect(() => {
    const fetchNotificationSetting = async () => {
      setLoadingNotifications(true);
      setNotificationsError('');
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          setNotificationsError('You are not logged in. Cannot load settings.');
          return;
        }

        // 🌐 Make a GET request using axios to get current settings
        const response = await axios.get(`${API_URL}/api/buyandsell/user-profile/`, {
          headers: {
            'Authorization': `Token ${authToken}`, // Authenticate the request
          }
        });
        
        setNotificationsEnabled(response.data.notifications_enabled);
        console.log("Notification setting fetched:", response.data.notifications_enabled);
        setNotificationsError('');

      } catch (err) {
        console.error('Error fetching notification setting:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setNotificationsError('Session expired. Please log in again.');
          await AsyncStorage.removeItem('authToken');
        } else {
          setNotificationsError('Failed to load notification settings.');
        }
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotificationSetting();
  }, []);

  // ✅ New: Function to handle changing the notification setting using axios
  const handleNotificationsToggle = async () => {
    const newSetting = !notificationsEnabled;
    setNotificationsEnabled(newSetting);

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        setNotificationsError('Not logged in. Cannot save notification setting.');
        return;
      }

      // 🌐 Send a PATCH request using axios to update the setting
      const response = await axios.patch(
        `${API_URL}/api/buyandsell/user-profile/`,
        { notifications_enabled: newSetting },
        {
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Notification setting updated on backend successfully!');
      setNotificationsError('');

    } catch (err) {
      console.error('Error updating notification setting:', err);
      setNotificationsEnabled(!newSetting);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setNotificationsError('Session expired. Please log in again.');
        await AsyncStorage.removeItem('authToken');
      } else {
        setNotificationsError('Failed to save notification settings.');
      }
    }
  };


  const containerStyle = theme === 'light' ? styles.containerLight : styles.containerDark;
  const textStyle = theme === 'light' ? styles.textLight : styles.textDark;
  const errorTextStyle = theme === 'light' ? styles.errorTextLight : styles.errorTextDark;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Settings Title */}
      <Text style={[styles.title, textStyle]}>Settings</Text>

      {/* Theme Toggle Block */}
      <View style={styles.optionRow}>
        <Text style={[styles.label, textStyle]}>Theme</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Text style={styles.themeToggleText}>{theme === 'light' ? 'Light' : 'Dark'}</Text>
        </TouchableOpacity>
      </View>

      {/* The Notifications Block */}
      <View style={styles.optionRow}>
        <Text style={[styles.label, textStyle]}>Notifications</Text>
        {loadingNotifications ? (
          <ActivityIndicator size="small" color={theme === 'light' ? '#000' : '#fff'} />
        ) : notificationsError ? (
          <Text style={errorTextStyle}>{notificationsError}</Text>
        ) : (
          <Switch
            onValueChange={handleNotificationsToggle}
            value={notificationsEnabled}
            trackColor={{ false: '#767577', true: 'black' }}
            thumbColor={notificationsEnabled ? '#4bf58cff' : '#f4f3f4'}
          />
        )}
      </View>
    </View>
  );
};

// Part 4: The Stylesheet (Our Style Guide)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerLight: {
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  textLight: {
    color: '#000000',
  },
  textDark: {
    color: '#ffffff',
  },
  errorTextLight: {
    color: 'red',
    fontSize: 14,
  },
  errorTextDark: {
    color: '#ff6b6b',
    fontSize: 14,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 18,
  },
  themeToggle: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  themeToggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SettingsPage;
