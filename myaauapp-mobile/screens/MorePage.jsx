// screens/MoreScreen.jsx

// Part 1: Bring in the Tools
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// 🟢 FIX: Import the useTheme hook
import { useTheme } from '../components/ThemeProvider';

// Part 2: Create our React Screen Component
const MorePage = () => {
  // 🟢 FIX: Get the current theme to style the component
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Part 3: What You See on the Screen
  return (
    // 🟢 FIX: Apply a dynamic style to the main container
    <ScrollView contentContainerStyle={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* 🟢 FIX: Apply a dynamic style to the heading */}
      <Text style={[styles.heading, isDark ? styles.textDark : styles.textLight]}>More Options</Text>

      {/* Contact Support Section */}
      {/* 🟢 FIX: Apply a dynamic style to the section */}
      <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
        <View style={styles.iconContainer}>
          {/* 🟢 FIX: Change the icon color based on the theme */}
          <Icon name="phone" size={20} color={isDark ? '#fff' : '#000'} />
          {/* 🟢 FIX: Apply a dynamic style to the label text */}
          <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>Contact Support</Text>
        </View>
        {/* 🟢 FIX: Apply a dynamic style to the paragraph text */}
        <Text style={[styles.paragraph, isDark ? styles.textDark : styles.textLight]}>
          Founder's phone number: 08065907350
        </Text>
      </View>

      {/* About the App Section */}
      {/* 🟢 FIX: Apply a dynamic style to the section */}
      <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
        <View style={styles.iconContainer}>
          {/* 🟢 FIX: Change the icon color based on the theme */}
          <Icon name="book" size={20} color={isDark ? '#fff' : '#000'} />
          {/* 🟢 FIX: Apply a dynamic style to the label text */}
          <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>About the App</Text>
        </View>
        {/* 🟢 FIX: Apply a dynamic style to the paragraph text */}
        <Text style={[styles.paragraph, isDark ? styles.textDark : styles.textLight]}>
          This App was created by an Alumni of Ambrose Alli University Ekpoma. 
          He studied Agricultural Economics & Extension Service which is not close to the knowledge of a Computer Science Degree 
          and had no prior knowlegde on Software Development. It was just self-motivation, determination, belief and God.
          While still a student there were no test/exam question practice app to prepare for exams or tests which could make students score higher. 
          This was how the idea came about after months of studying on how to become a Software Engineer.
        </Text>
      </View>

      {/* Help & FAQ Section */}
      {/* 🟢 FIX: Apply a dynamic style to the section */}
      <View style={[styles.section, isDark ? styles.sectionDark : styles.sectionLight]}>
        <View style={styles.iconContainer}>
          {/* 🟢 FIX: Change the icon color based on the theme */}
          <Icon name="question-circle" size={20} color={isDark ? '#fff' : '#000'} />
          {/* 🟢 FIX: Apply a dynamic style to the label text */}
          <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>Help & FAQ</Text>
        </View>
        {/* 🟢 FIX: Apply a dynamic style to the paragraph text */}
        <Text style={[styles.paragraph, isDark ? styles.textDark : styles.textLight]}>None</Text>
      </View>
    </ScrollView>
  );
};

// Part 4: The Stylesheet (Our Style Guide)
const styles = StyleSheet.create({
  // 🟢 FIX: We will remove the background color from the main container here and add new styles for it.
  container: {
    flexGrow: 1,
    padding: 20,
  },
  // 🟢 FIX: New styles for light and dark themes
  containerLight: { backgroundColor: '#f0f4f7' },
  containerDark: { backgroundColor: '#121212' },

  // 🟢 FIX: We will remove the colors here and apply them below.
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    // 🟢 FIX: We will remove the background color here and add new styles for it.
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  // 🟢 FIX: New styles for light and dark section backgrounds
  sectionLight: { backgroundColor: '#fff' },
  sectionDark: { backgroundColor: '#1F1F1F' },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // 🟢 FIX: We will remove the colors here and apply them below.
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  // 🟢 FIX: We will remove the colors here and apply them below.
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
  // 🟢 FIX: New styles for light and dark text colors
  textLight: {
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
});

export default MorePage;