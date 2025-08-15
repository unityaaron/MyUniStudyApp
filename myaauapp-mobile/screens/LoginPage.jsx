// C:\Users\OSAGIE AARON UNITY\Desktop\github_request\MyAauApp\myaauapp-mobile\screens\LoginPage.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ We need this for saving the token.

// This is your base URL for the Django backend. Make sure it's correct.
const API_BASE_URL = 'http://172.20.10.3:8000'; 

// We'll set up an Axios instance to handle the base URL and headers.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    // 1. First, we need to get the CSRF token from the Django backend.
    try {
      // The new endpoint we created in Django.
      const csrfResponse = await api.get('/api/buyandsell/get-csrf/');
      const csrfToken = csrfResponse.data.csrfToken;

      console.log('Successfully fetched CSRF token:', csrfToken);

      // 2. Now we can make the login request with the CSRF token in the headers.
      // We set the token in the headers for this specific request.
      const loginHeaders = {
        ...api.defaults.headers,
        'X-CSRFToken': csrfToken,
      };
      
      const loginResponse = await api.post('/auth/login/', {
        username: username,
        email: email,
        password: password,
      }, {
        headers: loginHeaders,
      });

      // ✅ Now that the login is successful, we get the token from the response.
      const authToken = loginResponse.data.key; // The token is usually in a 'key' property from dj-rest-auth.
      await AsyncStorage.setItem('authToken', authToken); // ✅ And we save it!
      
      console.log('Login successful:', loginResponse.data);
      Alert.alert('Success', 'Logged in successfully!');
      
      // We call the onLoginSuccess function, which will update the state in App.js.
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
    } catch (error) {
      console.log('Full error response:', error.response);

      // This is the line that will show the correct, helpful error message.
      // We'll try to get a specific message from the server response.
      const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.non_field_errors?.[0] || 
                           'An unexpected error occurred. Please check your username, email, and password.';

      console.error(`Login Error: ${errorMessage}`);
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
