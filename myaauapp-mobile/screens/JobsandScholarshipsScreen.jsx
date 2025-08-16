// screens/JobsAndScholarshipsScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// 🟢 FIX: Import the useTheme hook
import { useTheme } from '../components/ThemeProvider';

const JobsAndScholarshipsScreen = ({ navigation }) => {
  // 🟢 FIX: Get the current theme to style the component
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    // 🟢 FIX: Apply a dynamic style to the main container
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* 🟢 FIX: Apply a dynamic style to the title text */}
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>Jobs & Scholarships</Text>
      <View style={styles.cardsContainer}>
        {/* Jobs Card */}
        <TouchableOpacity 
          // 🟢 FIX: Apply a dynamic style to the card's background and shadow
          style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => navigation.navigate('JobsPage')} 
        >
          {/* 🟢 FIX: Change the icon color based on the theme */}
          <Ionicons name="cash-outline" size={80} color={isDark ? 'white' : 'black'} />
          {/* 🟢 FIX: Apply a dynamic style to the text inside the card */}
          <Text style={[styles.cardLabel, isDark ? styles.cardLabelDark : styles.cardLabelLight]}>Jobs</Text>
          <Text style={[styles.cardCount, isDark ? styles.cardCountDark : styles.cardCountLight]}>Student Jobs HERE!</Text>
        </TouchableOpacity>

        {/* Scholarships Card */}
        <TouchableOpacity 
          // 🟢 FIX: Apply a dynamic style to the card's background and shadow
          style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => navigation.navigate('ScholarshipsPage')}
        >
          {/* 🟢 FIX: Change the icon color based on the theme */}
          <Ionicons name="school-outline" size={80} color={isDark ? 'white' : 'black'} />
          {/* 🟢 FIX: Apply a dynamic style to the text inside the card */}
          <Text style={[styles.cardLabel, isDark ? styles.cardLabelDark : styles.cardLabelLight]}>Scholarships</Text>
          <Text style={[styles.cardCount, isDark ? styles.cardCountDark : styles.cardCountLight]}>Student Scholarships HERE!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 🟢 FIX: Add a new set of styles for light and dark themes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  // New styles for light and dark containers
  containerLight: { backgroundColor: '#F5F5F5' },
  containerDark: { backgroundColor: '#121212' },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  // New styles for light and dark titles
  titleLight: { color: 'black' },
  titleDark: { color: 'white' },

  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  card: {
    width: '45%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  // New styles for light and dark cards
  cardLight: { backgroundColor: 'white' },
  cardDark: { backgroundColor: '#1F1F1F' },

  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  // New styles for light and dark card labels
  cardLabelLight: { color: '#333' },
  cardLabelDark: { color: 'white' },

  cardCount: {
    fontSize: 14,
  },
  // New styles for light and dark card counts
  cardCountLight: { color: '#666' },
  cardCountDark: { color: '#bbb' },
});

export default JobsAndScholarshipsScreen;