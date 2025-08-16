// components/Header.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// 🟢 FIX: Import the useTheme hook
import { useTheme } from './ThemeProvider';

const Header = ({ navigation }) => {
  // 🟢 FIX: Get the current theme to style the component
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    // 🟢 FIX: Apply dynamic styles for the header container
    <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
        {/* 🟢 FIX: Change the icon color based on the theme */}
        <Ionicons name="menu-outline" size={28} color={isDark ? 'white' : 'black'} />
      </TouchableOpacity>
      {/* 🟢 FIX: Apply dynamic styles for the text color */}
      <Text style={[styles.headerText, isDark ? styles.textDark : styles.textLight]}>My UniStudy App</Text>
      <View style={{ width: 28 }}></View>
    </View>
  );
};

// 🟢 FIX: Add styles for light and dark themes
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    width: '100%',
  },
  headerLight: {
    backgroundColor: '#2E8B57', // Your original green color for light mode
  },
  headerDark: {
    backgroundColor: '#1F1F1F', // A dark gray color for dark mode
  },
  menuIcon: {
    // We can add some styles here if needed, like padding
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textLight: {
    color: 'white', // Your original color for light mode
  },
  textDark: {
    color: 'white', // We can keep this white for dark mode
  },
});

export default Header;