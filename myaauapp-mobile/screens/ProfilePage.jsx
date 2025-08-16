// screens/ProfileScreen.jsx

// Part 1: Bring in the Tools (Our React Native building blocks)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api'; // Assuming you have a constants/api.js file
// 🟢 FIX: Import the useTheme hook
import { useTheme } from '../components/ThemeProvider'; 

// Part 2: Create our React Screen Component
const ProfilePage = () => {
  // Part 3: The Profile Manager's Sticky Notes (State Variables)
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use the navigation hook to move between screens
  const navigation = useNavigation();
  
  // 🟢 FIX: Get the current theme and check if it's dark
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
      // 🟢 FIX: Apply theme styles to the container
      <View style={[styles.centeredContainer, isDark ? styles.centeredDark : styles.centeredLight]}>
        <ActivityIndicator size="large" color={isDark ? '#007bff' : '#007bff'} />
        {/* 🟢 FIX: Apply theme styles to the text */}
        <Text style={[styles.loadingText, isDark ? styles.textDark : styles.textLight]}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      // 🟢 FIX: Apply theme styles to the container
      <View style={[styles.centeredContainer, isDark ? styles.centeredDark : styles.centeredLight]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // If user data is available, display it
  return (
    // 🟢 FIX: Apply theme styles to the container
    <ScrollView contentContainerStyle={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* 🟢 FIX: Apply theme styles to the profile card */}
      <View style={[styles.profileCard, isDark ? styles.cardDark : styles.cardLight]}>
        {/* 🟢 FIX: Apply theme styles to the title */}
        <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>Your Profile</Text>
        {userData ? (
          <View>
            {/* 🟢 FIX: Apply theme styles to the labels */}
            <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>Username:</Text>
            {/* 🟢 FIX: Apply theme styles to the values */}
            <Text style={[styles.value, isDark ? styles.textDark : styles.textLight]}>{userData.username}</Text>
            <View style={[styles.divider, isDark ? styles.dividerDark : styles.dividerLight]} />
            {/* 🟢 FIX: Apply theme styles to the labels */}
            <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>Email:</Text>
            {/* 🟢 FIX: Apply theme styles to the values */}
            <Text style={[styles.value, isDark ? styles.textDark : styles.textLight]}>{userData.email}</Text>
            {/* You can display other fields here if Django provides them */}
          </View>
        ) : (
          <Text style={[styles.infoText, isDark ? styles.textDark : styles.textLight]}>No user data available. Please try logging in again.</Text>
        )}
      </View>      
    </ScrollView>
  );
};

// Part 4: The Stylesheet (Our Style Guide)
const styles = StyleSheet.create({
  // 🟢 FIX: Define new styles for both themes
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centeredLight: {
    backgroundColor: '#f0f4f7',
  },
  centeredDark: {
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  containerLight: {
    backgroundColor: '#f0f4f7',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  profileCard: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardLight: {
    backgroundColor: '#fff',
    shadowColor: '#000',
  },
  cardDark: {
    backgroundColor: '#1F1F1F',
    shadowColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  labelLight: {
    color: '#555',
  },
  labelDark: {
    color: '#ccc',
  },
  value: {
    fontSize: 18,
    marginTop: 5,
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  dividerLight: {
    backgroundColor: '#eee',
  },
  dividerDark: {
    backgroundColor: '#333',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
  // 🟢 FIX: Add styles for light and dark text
  textLight: {
    color: 'black',
  },
  textDark: {
    color: 'white',
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