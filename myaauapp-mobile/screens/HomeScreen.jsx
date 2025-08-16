// screens/HomeScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// 🟢 FIX: Import the useTheme hook
import { useTheme } from '../components/ThemeProvider';

// This is our data for the courses.
const courses = [
  { id: 'GST101', title: 'GST 101', questions: '100 questions' },
  { id: 'GST102', title: 'GST 102', questions: '100 questions' },
  { id: 'GST201', title: 'GST 201', questions: '100 questions' },
  { id: 'BIO101', title: 'BIO 101', questions: '100 questions' },
  { id: 'PHY101', title: 'PHY 101', questions: '100 questions' },
  { id: 'CHM101', title: 'CHM 101', questions: '100 questions' },
];

const HomeScreen = ({ navigation }) => {
  // 🟢 FIX: Get the current theme to style the component
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    // 🟢 FIX: Apply the dynamic container style
    <ScrollView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* 🟢 FIX: Apply the dynamic title style */}
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>Practice Questions</Text>
      <View style={styles.cardsContainer}>
        {courses.map((course) => (
          // 🟢 FIX: Apply the dynamic card style
          <TouchableOpacity
            key={course.id}
            style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
            onPress={() => navigation.navigate('Quiz', { courseId: course.id })}
          >
            <View style={styles.iconContainer}>
              {/* 🟢 FIX: Change the icon color */}
              <Ionicons name="book-outline" size={80} color={isDark ? 'white' : 'black'} />
            </View>
            {/* 🟢 FIX: Apply the dynamic text styles */}
            <Text style={[styles.cardLabel, isDark ? styles.textDark : styles.textLight]}>{course.title}</Text>
            <Text style={[styles.cardCount, isDark ? styles.textDark : styles.textLight]}>{course.questions}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// 🟢 FIX: We now have two sets of styles for the theme.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  // 🟢 FIX: New container colors for light and dark mode.
  containerLight: {
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  titleLight: {
    color: 'black',
  },
  titleDark: {
    color: 'white',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  // 🟢 FIX: New card styles for light and dark mode.
  cardLight: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardDark: {
    backgroundColor: '#1F1F1F', // Dark gray for the card background
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardCount: {
    fontSize: 14,
  },
  // 🟢 FIX: New text colors for light and dark mode.
  textLight: {
    color: '#333',
  },
  textDark: {
    color: 'white',
  },
});

export default HomeScreen;