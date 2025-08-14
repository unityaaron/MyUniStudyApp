// screens/LoginScreen.jsx

// Part 1: Bring in the Tools (React Native Building Blocks)
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api'; // Import our API_URL constant

// Part 2: Create our React Screen Component
const LoginPage = () => {
  // Part 3: The Login Manager's Sticky Notes (State Variables)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  // A new function to handle the login process
  const handleLogin = async () => {
    // 1. Reset our loading and error states
    setLoading(true);
    setError('');

    try {
      // 2. Make an API call to our Django backend
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 3. Send the username and password in the request body
        body: JSON.stringify({ username, password }),
      });

      // 4. Check if the response was successful
      if (!response.ok) {
        // If not, read the error message from the backend
        const errorData = await response.json();
        throw new Error(errorData.non_field_errors?.[0] || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      const token = data.token;
      
      // 5. Save the token to AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      
      // 6. Alert the user and navigate to the Home screen
      Alert.alert("Success", "You have been logged in successfully!");
      navigation.navigate('Home'); 
    
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setLoading(false); // 7. Stop the loading spinner
    }
  };

  // --- What You See on the Screen (The Display Part / JSX) ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {/* Show an error message if there is one */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Hides the text as the user types
        placeholderTextColor="#888"
      />

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.linkContainer}>
        <Text style={styles.text}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Part 4: The Stylesheet (Our Style Guide)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  linkText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default LoginPage;
