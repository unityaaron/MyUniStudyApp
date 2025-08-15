import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        
        // We save the data to our state. Your web version used `slice(0, 50)`,
        // but let's assume your backend is already sending the correct list.
        setLeaderboard(response.data); 
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err.response || err);
        setError("Failed to load leaderboard. Please make sure you are logged in.");
        setLoading(false);
      }
    };

    fetchLeaderboard(); // We call the function to start fetching data.
  }, [courseId]); // The effect will run again if the `courseId` ever changes.

  // 4. What our component shows on the screen
  // If we're still loading, show a spinning circle.
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  // If there's an error, show the error message.
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // If there are no scores, show a friendly message.
  if (leaderboard.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No scores yet for {courseTitle}. Be the first to play!</Text>
      </View>
    );
  }

  // Otherwise, show the list of top scorers.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard for {courseTitle}</Text>
      <FlatList
        data={leaderboard}
        // Your backend might return a different key, but `id` is a good guess.
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item, index }) => (
          <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.score}>{item.highest_score} points</Text>
          </View>
        )}
      />
    </View>
  );
};

// Simple styles for the leaderboard.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  noDataText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  leaderboardItem: {
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
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    width: 30,
  },
  userName: {
    fontSize: 18,
    flex: 1,
    color: '#333',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28A745',
  },
});

export default LeaderboardPage;
