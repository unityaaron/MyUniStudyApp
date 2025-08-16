// components/StackHeader.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// 🟢 FIX: Import the useTheme hook
import { useTheme } from './ThemeProvider';

const StackHeader = ({ navigation, title }) => {
  // 🟢 FIX: Get the current theme to style the component
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    // 🟢 FIX: Apply dynamic styles for the header container
    <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        {/* 🟢 FIX: Change the icon color based on the theme */}
        <Ionicons name="arrow-back" size={28} color={isDark ? 'white' : 'black'} />
      </TouchableOpacity>
      {/* Title */}
      {/* 🟢 FIX: Apply dynamic styles for the text color */}
      <Text style={[styles.headerText, isDark ? styles.textDark : styles.textLight]}>{title}</Text>
      {/* A blank space to keep the title centered */}
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
    backgroundColor: '#2E8B57',
  },
  headerDark: {
    backgroundColor: '#1F1F1F',
  },
  backButton: {
    paddingRight: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textLight: {
    color: 'white',
  },
  textDark: {
    color: 'white',
  },
});

export default StackHeader;