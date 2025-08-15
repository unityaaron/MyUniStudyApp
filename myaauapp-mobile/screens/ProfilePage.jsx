// screens/ProfileScreen.jsx

// Part 1: Bring in the Tools (Our React Native building blocks)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api'; // Assuming you have a constants/api.js file

// Part 2: Create our React Screen Component
const ProfilePage = () => {
  // Part 3: The Profile Manager's Sticky Notes (State Variables)
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use the navigation hook to move between screens
  const navigation = useNavigation();

  // A new function to handle logging out
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); // Clear the token
      // You can also clear other data here if needed
      Alert.alert("Success", "You have been logged out.");
      navigation.navigate('Login'); // Go back to the Login screen
    } catch (e) {
      console.error("Failed to log out:", e);
      Alert.alert("Error", "Could not log out. Please try again.");
    }
  };

  // --- Robot (useEffect Hook) that runs automatically ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); // Start loading
      setError('');     // Clear any previous errors

      try {
        // 1. Get the authentication token from AsyncStorage
        const authToken = await AsyncStorage.getItem('authToken');

        // 2. Check if a token exists. If not, the user is not logged in.
        if (!authToken) {
          setError('You are not logged in. Please log in to view your profile.');
          setLoading(false);
          navigation.navigate('Login'); // Redirect to login page
          return;
        }

        // 3. Make a GET request to Django's /auth/user/ endpoint
        //    We use the API_URL constant here.
        const response = await fetch(`${API_URL}/auth/user/`, {
          headers: {
            'Authorization': `Token ${authToken}` // CRITICAL: Use the correct header format
          }
        });

        // 4. Check if the response was successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch user profile.');
        }

        const data = await response.json();
        // 5. If successful, save the user data
        setUserData(data);
        console.log("User data fetched successfully:", data);

      } catch (err) {
        // 6. Handle errors (e.g., token invalid, server error)
        console.error('Failed to fetch user profile:', err);
        setError(`Error: ${err.message}. Please log in again.`);
        // Consider redirecting to login on auth error
        if (err.message.includes('Authentication credentials were not provided')) {
          await AsyncStorage.removeItem('authToken'); // Clear invalid token
          navigation.navigate('Login');
        }
      } finally {
        setLoading(false); // End loading, regardless of success or failure
      }
    };

    fetchUserProfile(); // Run the function when the screen loads
  }, [navigation]);

  // --- What You See on the Screen (The Display Part / JSX) ---

  // Display loading, error, or user data
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // If user data is available, display it
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.title}>Your Profile</Text>
        {userData ? (
          <View>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{userData.username}</Text>
            <View style={styles.divider} />
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.email}</Text>
            {/* You can display other fields here if Django provides them */}
          </View>
        ) : (
          <Text style={styles.infoText}>No user data available. Please try logging in again.</Text>
        )}
      </View>      
    </ScrollView>
  );
};

// Part 4: The Stylesheet (Our Style Guide)
const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: '#000',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  infoText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePage;