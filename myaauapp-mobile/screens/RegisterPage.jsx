// screens/RegisterScreen.jsx

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
import { API_URL } from '../constants/api'; // Import our API_URL constant

// Part 2: Create our React Screen Component
const RegisterPage = () => {
  // Part 3: The Register Manager's Sticky Notes (State Variables)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  // Function to handle form submission
  const handleRegister = async () => {
    setLoading(true);
    setError('');

    // Frontend validation: Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    
    // Frontend validation: Check if fields are not empty
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      // 1. Prepare the data to send to your Django backend
      const registrationData = {
        username: username,
        email: email,
        password: password, // Note: Django's djoser requires 'password' not 'password1'
        re_password: confirmPassword, // djoser requires 're_password'
      };

      // 2. Make an API call to our Django backend
      const response = await fetch(`${API_URL}/auth/registration/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      // 3. Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Registration failed. Please check your details.";
        // Handle specific error messages from Django
        if (errorData.username) {
            errorMessage += ` Username: ${errorData.username.join(', ')}.`;
        }
        if (errorData.email) {
            errorMessage += ` Email: ${errorData.email.join(', ')}.`;
        }
        if (errorData.password) {
            errorMessage += ` Password: ${errorData.password.join(', ')}.`;
        }
        if (errorData.re_password) {
            errorMessage += ` ${errorData.re_password.join(', ')}`;
        }
        if (errorData.non_field_errors) {
            errorMessage += ` ${errorData.non_field_errors.join(', ')}`;
        }
        if (errorData.detail) {
            errorMessage += ` ${errorData.detail}`;
        }
        throw new Error(errorMessage);
      }

      // 4. Handle a successful response from Django
      console.log('Registration successful:', response.data);
      Alert.alert('Success', 'Registration successful! You can now log in.');

      // 5. Redirect the user to the login page after a short delay
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000); // Wait for 2 seconds (2000 milliseconds)

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false); // 6. Stop the loading spinner
    }
  };

  // --- What You See on the Screen (The Display Part / JSX) ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

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

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />

      {/* Register Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={styles.text}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Log In</Text>
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

export default RegisterPage;
