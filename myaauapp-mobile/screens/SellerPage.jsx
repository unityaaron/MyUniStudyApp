// screens/SellerScreen.jsx

// This is where we bring in all the tools we need to build our screen.
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { API_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
// 🟢 FIX: Import the useTheme hook from your ThemeProvider.
import { useTheme } from '../components/ThemeProvider';

// This is our main screen component.
const SellerPage = ({ navigation }) => {
  // 🟢 FIX: Get the current theme and check if it's dark
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // === 1. The Manager's Sticky Notes (State Variables) ===
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // === 2. A function to get our login token ===
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (e) {
      console.error("Failed to fetch the auth token from storage", e);
      return null;
    }
  };

  // === 3. A function to handle price changes ===
  const handlePriceChange = (value) => {
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      setPrice(parts[0] + '.' + parts.slice(1).join(''));
    } else {
      setPrice(cleanedValue);
    }
  };

  // === 4. Our new and correct function for picking an image with Expo ===
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Sorry, we need camera roll permissions to make this work!'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // === 5. The function to send the form to the server ===
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const authToken = await getAuthToken();

    if (!authToken) {
      const authErrorMsg = 'You must be logged in to post an item.';
      setError(authErrorMsg);
      Alert.alert('Error', authErrorMsg);
      setLoading(false);
      return;
    }

    if (!title || !description || !price || !whatsappNumber || !location || !image) {
      const requiredErrorMsg = 'Please fill in all the required fields, including an image.';
      setError(requiredErrorMsg);
      Alert.alert('Error', requiredErrorMsg);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price.replace(/,/g, ''));
      formData.append('whatsapp_number', whatsappNumber);
      formData.append('location', location);
      
      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: image.fileName || 'photo.jpg',
          type: image.type || 'image/jpeg',
        });
      }

      const response = await fetch(`${API_URL}/api/buyandsell/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to post item.';
        if (data && typeof data === 'object') {
            errorMessage = Object.values(data).flat().join('\n');
        }
        throw new Error(errorMessage);
      }

      Alert.alert('Success', 'Item posted successfully!');
      console.log('Item posted successfully:', data);

      setTitle('');
      setDescription('');
      setPrice('');
      setWhatsappNumber('');
      setLocation('');
      setImage(null);

    } catch (err) {
      console.error('Error posting item:', err);
      setError(err.message || 'An unexpected error occurred.');
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // 🟢 FIX: Create a dynamic styles object based on the current theme.
  const themedStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: isDark ? '#121212' : '#f0f4f7',
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },
    infoText: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 5,
      color: isDark ? '#ddd' : '#555',
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#333',
    },
    input: {
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#555' : '#ccc',
      color: isDark ? '#fff' : '#000',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
    },
    imagePickerButton: {
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#555' : '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
    },
    imagePickerButtonText: {
      color: isDark ? '#00bfff' : '#007bff',
      fontSize: 16,
    },
    submitButton: {
      backgroundColor: isDark ? '#00bfff' : '#007bff',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  // === 6. The Screen's Drawing Board (The JSX) ===
  return (
    <ScrollView contentContainerStyle={themedStyles.container}>
      <Text style={themedStyles.pageTitle}>Post New Item</Text>
      <Text style={themedStyles.infoText}>Fill out the form to post your product, service, or hostel.</Text>
      <Text style={themedStyles.infoText}>(All fields are required)</Text>

      <View style={styles.inputGroup}>
        <Text style={themedStyles.label}>Title:</Text>
        <TextInput
          style={themedStyles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Apple iPhone 12 Pro"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={themedStyles.label}>Description:</Text>
        <TextInput
          style={[themedStyles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
          placeholder="Describe your item..."
          placeholderTextColor={isDark ? '#aaa' : '#888'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={themedStyles.label}>Price (e.g., 15000.00):</Text>
        <TextInput
          style={themedStyles.input}
          value={price}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
          placeholder="e.g., 15000.00"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={themedStyles.label}>WhatsApp Number (e.g., +2348012345678):</Text>
        <TextInput
          style={themedStyles.input}
          value={whatsappNumber}
          onChangeText={setWhatsappNumber}
          keyboardType="phone-pad"
          placeholder="e.g., +2348012345678"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={themedStyles.label}>Location:</Text>
        <TextInput
          style={themedStyles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Main Campus Area"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={themedStyles.label}>Image:</Text>
        <TouchableOpacity style={themedStyles.imagePickerButton} onPress={handleImagePicker}>
          <Text style={themedStyles.imagePickerButtonText}>
            {image ? 'Image Selected' : 'Choose an image'}
          </Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}
      </View>

      <TouchableOpacity
        style={themedStyles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={themedStyles.submitButtonText}>
          {loading ? 'Posting...' : 'Post Item'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// === 7. The Stylesheet (We leave the static styles here) ===
const styles = StyleSheet.create({
  // 🟢 FIX: We only keep the styles that do not change with the theme.
  // We'll use a new `themedStyles` object for all the color changes.
  inputGroup: {
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default SellerPage;