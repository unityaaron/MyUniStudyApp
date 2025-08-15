// screens/SettingsScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
// Import our new hook to access the global theme.
import { useTheme } from '../components/ThemeProvider';

const SettingsPage = () => {
  // Use the hook to read the theme and the function to change it.
  const { theme, toggleTheme } = useTheme();

  // You can still have local state for things that don't need to be global,
  // like the notifications switch.
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);

  const toggleNotifications = () => {
    setIsNotificationsEnabled(previousState => !previousState);
  };

  // We check the global `theme` to decide which styles to use.
  const containerStyle = theme === 'light' ? styles.containerLight : styles.containerDark;
  const textStyle = theme === 'light' ? styles.textLight : styles.textDark;

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

      {/* Notifications Block */}
      <View style={styles.optionRow}>
        <Text style={[styles.label, textStyle]}>Notifications</Text>
        <Switch
          onValueChange={toggleNotifications}
          value={isNotificationsEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isNotificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
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
    backgroundColor: '#ffffff', // White background for light mode
  },
  containerDark: {
    backgroundColor: '#121212', // Dark gray background for dark mode
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  textLight: {
    color: '#000000', // Black text for light mode
  },
  textDark: {
    color: '#ffffff', // White text for dark mode
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
