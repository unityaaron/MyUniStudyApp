// screens/TopScorersScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// 🟢 FIX: We need to import the useTheme hook to get the current theme.
import { useTheme } from '../components/ThemeProvider';

const courses = [
  { id: 'GST101', title: 'GST 101' },
  { id: 'GST102', title: 'GST 102' },
  { id: 'GST201', title: 'GST 201' },
  { id: 'BIO101', title: 'BIO 101' },
  { id: 'CHM101', title: 'CHM 101' },
  { id: 'PHY101', title: 'PHY 101' },
];

const TopScorersScreen = ({ navigation }) => {
  // 🟢 FIX: We get the current theme here.
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 🟢 FIX: We create new styles that change with the theme.
  const containerStyle = {
    backgroundColor: isDark ? '#2E2E2E' : '#F5F5F5', // Changes background color
  };
  const titleStyle = {
    color: isDark ? 'white' : 'black', // Changes title color
  };
  const subtitleStyle = {
    color: isDark ? '#ccc' : '#666', // Changes subtitle color
  };
  const courseButton = {
    backgroundColor: isDark ? '#444' : '#7BCCAD', // Changes button background color
  };
  const courseButtonText = {
    color: isDark ? 'white' : 'white', // Changes button text color
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.courseButton, courseButton]}
      onPress={() => navigation.navigate('LeaderboardPage', { courseTitle: item.title, courseId: item.id })}
    >
      <Text style={[styles.courseButtonText, courseButtonText]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    // 🟢 FIX: We apply the new dynamic styles.
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>LeaderBoard for Courses</Text>
      <Text style={[styles.subtitle, subtitleStyle]}>Click on Courses to see Highest Scorers</Text>
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  list: {
    marginTop: 10,
  },
  courseButton: {
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  courseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TopScorersScreen;