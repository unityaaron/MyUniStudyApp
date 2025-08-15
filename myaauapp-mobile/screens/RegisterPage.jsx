// screens/RegisterScreen.jsx

// Part 1: Bring in the Tools (React Native Building Blocks)
// We import React and the special "useState" and "useEffect" tools.
// These let us manage and save information on the screen.
import React, { useState, useEffect } from 'react';
import {
  View, // A simple container, like a <div>
  Text, // For showing text on the screen
  StyleSheet, // For writing down how our components should look
  TextInput, // For letting the user type things in
  TouchableOpacity, // A button that becomes see-through when you press it
  ActivityIndicator, // The little spinning loading circle
  Alert // For showing pop-up messages
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // A tool to let us move between screens
import axios from 'axios'; // The tool we use to talk to our Django backend
import { API_URL } from '../constants/api'; // Our special file that holds the backend address

// Part 2: Create our React Screen Component
// This is like a mini-program for our screen. We call it RegisterPage.
const RegisterPage = () => {
  // Part 3: The Register Manager's Sticky Notes (State Variables)
  // These are like temporary memory slots. When they change, React knows to update the screen.
  const [username, setUsername] = useState(''); // Holds the username the user types in
  const [email, setEmail] = useState(''); // Holds the email
  const [password, setPassword] = useState(''); // Holds the password
  const [confirmPassword, setConfirmPassword] = useState(''); // Holds the confirmed password
  const [loading, setLoading] = useState(false); // A true/false switch to show the loading circle
  const [error, setError] = useState(''); // Holds any error messages we need to show
  const [csrfToken, setCsrfToken] = useState(''); // This is where we will save the security token

  const navigation = useNavigation(); // This gives us a tool to navigate to other pages

  // A function whose only job is to get the CSRF token from the backend
  const fetchCsrfToken = async () => {
    try {
      // ✅ THE FIX: We are telling the app the full address to find the token.
      // Your Django urls.py has 'api/buyandsell/' before the 'get-csrf/'.
      const response = await axios.get(`${API_URL}/api/buyandsell/get-csrf/`);
      const token = response.data.csrfToken;
      setCsrfToken(token); // We save the token in our sticky note
      console.log('CSRF Token fetched:', token);
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
      // We set a general error to let the user know something is wrong
      setError('Could not connect to the server to get the CSRF token. Please try again later.');
    }
  };

  // This will run one time when the screen first opens.
  // It calls our new function to get the CSRF token right away.
  // We use the empty brackets [] to tell React to only run this once.
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  // Function to handle form submission (what happens when you press the button)
  const handleRegister = async () => {
    setLoading(true); // Turn on the loading spinner
    setError(''); // Clear any old error messages

    // Frontend validation: Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return; // Stop the function right here
    }
    
    // Frontend validation: Check if fields are not empty
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return; // Stop the function
    }

    // Also check if the CSRF token is available
    if (!csrfToken) {
        setError('Could not get CSRF token. Please restart the app or try again.');
        setLoading(false);
        return; // Stop the function
    }

    try {
      // The backend expects 'password1' and 'password2'
      const registrationData = {
        username: username,
        email: email,
        password1: password, 
        password2: confirmPassword,
      };

      // This is the important line where we send the data to Django
      const response = await axios.post(
        `${API_URL}/auth/registration/`, 
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json',
            // Now we add the CSRF token to our headers, like a secret password for Django
            'X-CSRFToken': csrfToken,
          },
        }
      );

      // 4. Handle a successful response from Django
      console.log('Registration successful:', response.data);
      Alert.alert('Success', 'Registration successful! You can now log in.');

      // 5. Redirect the user to the login page after a short delay
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000); // Wait for 2 seconds (2000 milliseconds)

    } catch (err) {
      // If something goes wrong, we will catch the error here
      console.error('Registration error:', err);
      let errorMessage = "Registration failed. Please check your details.";
      if (err.response) {
        const errorData = err.response.data;
        if (errorData.username) { errorMessage += ` Username: ${errorData.username.join(', ')}.`; }
        if (errorData.email) { errorMessage += ` Email: ${errorData.email.join(', ')}.`; }
        if (errorData.password) { errorMessage += ` Password: ${errorData.password.join(', ')}.`; }
        if (errorData.password2) { errorMessage += ` ${errorData.password2.join(', ')}`; }
        if (errorData.non_field_errors) { errorMessage += ` ${errorData.non_field_errors.join(', ')}`; }
        if (errorData.detail) { errorMessage += ` ${errorData.detail}`; }
      } else if (err.request) {
        errorMessage = 'No response from server. Is the Django backend running?';
      } else {
        errorMessage = 'An unexpected error occurred.';
      }

      setError(errorMessage);
      Alert.alert('Registration Failed', errorMessage);
      
    } finally {
      setLoading(false); // 6. Stop the loading spinner no matter what happens
    }
  };

  // --- What You See on the Screen (The Display Part / JSX) ---
  // This is the visual part of our screen, made from our React Native building blocks.
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
        disabled={loading || !csrfToken} // The button is disabled while loading or if we don't have a token
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
// This is where we define how each component looks, like colors, sizes, and spacing.
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
