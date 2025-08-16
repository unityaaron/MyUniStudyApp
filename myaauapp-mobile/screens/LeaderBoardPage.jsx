import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 🟢 FIX: Import the useTheme hook
import { useTheme } from '../components/ThemeProvider';

// Your API base URL
const API_BASE_URL = 'http://172.20.10.3:8000'; 

// This is the main component for the leaderboard page.
const LeaderboardPage = ({ route }) => {
  // We get the course title and the course ID from the navigation route.
  const { courseTitle, courseId } = route.params;

  // 1. State to hold our leaderboard data
  const [leaderboard, setLeaderboard] = useState([]);
  // 2. State to tell us if data is still loading
  const [loading, setLoading] = useState(true);
  // 3. State to hold any error messages
  const [error, setError] = useState(null);

  // 🟢 FIX: Get the current theme to style the component
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // This special effect runs only one time, when the page first loads.
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Get the authentication token from AsyncStorage.
        const authToken = await AsyncStorage.getItem('authToken');

        // If there's no token, we can't make the API call.
        if (!authToken) {
          setError('You must be logged in to view the leaderboard.');
          setLoading(false);
          return;
        }

        // We make the API call using the courseId we got from the previous screen.
        const response = await axios.get(
          `${API_BASE_URL}/api/quiz/leaderboard/${courseId}/`,
          {
            headers: {
              // We send the token in the Authorization header.
              Authorization: `Token ${authToken}` 
            }
          }
        );
        
        setLeaderboard(response.data); 
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err.response || err);
        setError("Failed to load leaderboard. Please make sure you are logged in.");
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [courseId]);

  // 🟢 FIX: Define dynamic styles based on the theme
  const containerStyle = isDark ? styles.containerDark : styles.containerLight;
  const textStyle = isDark ? styles.textDark : styles.textLight;
  const itemStyle = isDark ? styles.leaderboardItemDark : styles.leaderboardItemLight;
  const rankStyle = isDark ? styles.rankDark : styles.rankLight;
  const scoreStyle = isDark ? styles.scoreDark : styles.scoreLight;

  // 4. What our component shows on the screen
  // If we're still loading, show a spinning circle.
  if (loading) {
    return (
      // 🟢 FIX: Use dynamic style for the loading container
      <View style={[styles.loadingContainer, containerStyle]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#007bff'} />
        <Text style={[styles.loadingText, textStyle]}>Loading leaderboard...</Text>
      </View>
    );
  }

  // If there's an error, show the error message.
  if (error) {
    return (
      // 🟢 FIX: Use dynamic style for the error container
      <View style={[styles.errorContainer, containerStyle]}>
        <Text style={[styles.errorText, textStyle]}>{error}</Text>
      </View>
    );
  }

  // If there are no scores, show a friendly message.
  if (leaderboard.length === 0) {
    return (
      // 🟢 FIX: Use dynamic style for the no-data container
      <View style={[styles.noDataContainer, containerStyle]}>
        <Text style={[styles.noDataText, textStyle]}>No scores yet for {courseTitle}. Be the first to play!</Text>
      </View>
    );
  }

  // Otherwise, show the list of top scorers.
  return (
    <View style={containerStyle}>
      <Text style={[styles.title, textStyle]}>Leaderboard for {courseTitle}</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          // 🟢 FIX: Use dynamic style for each list item
          <View style={itemStyle}>
            <Text style={[styles.rank, rankStyle]}>{index + 1}.</Text>
            <Text style={[styles.userName, textStyle]}>{item.user}</Text>
            <Text style={[styles.score, scoreStyle]}>{item.highest_score} points</Text>
          </View>
        )}
      />
    </View>
  );
};

// Simple styles for the leaderboard.
// 🟢 FIX: Added separate styles for light and dark themes
const styles = StyleSheet.create({
  // Main container styles
  containerLight: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  containerDark: { flex: 1, backgroundColor: '#121212', padding: 20 },
  
  // Text color styles
  textLight: { color: '#555' },
  textDark: { color: '#ddd' },

  // Loading, error, and no-data container styles
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
  noDataContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  noDataText: { fontSize: 18, textAlign: 'center' },

  // Title style
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },

  // Leaderboard item styles
  leaderboardItemLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderboardItemDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Specific text color styles for rank, user, and score
  rank: { fontSize: 18, fontWeight: 'bold', width: 30 },
  rankLight: { color: '#007BFF' },
  rankDark: { color: '#4DA6FF' }, // A lighter blue for dark mode
  
  userName: { fontSize: 18, flex: 1 },
  score: { fontSize: 18, fontWeight: 'bold' },
  scoreLight: { color: '#28A745' },
  scoreDark: { color: '#4CAF50' }, // A lighter green for dark mode
});

export default LeaderboardPage;