// screens/SellerScreen.jsx

// This is where we bring in all the tools we need to build our screen.
// We are now using 'expo-image-picker'.
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
import * as ImagePicker from 'expo-image-picker'; // ✅ NEW: We import the Expo Image Picker library.

// This is our main screen component.
const SellerPage = ({ navigation }) => {
  // === 1. The Manager's Sticky Notes (State Variables) ===
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null); // This will hold the information about the picture.

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
    // We first check if the app has permission to access the photo gallery.
    // This is the correct way to handle permissions with Expo.
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      // If the user says no, we show an alert telling them why we need permission.
      Alert.alert(
        'Permission required',
        'Sorry, we need camera roll permissions to make this work!'
      );
      return;
    }

    // Now that we have permission, we can open the photo gallery.
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // We only want to see images.
      allowsEditing: true, // This allows the user to crop or edit the picture after they pick it.
      aspect: [4, 3], // The picture will be cropped to a 4:3 size.
      quality: 1, // We want the best quality picture.
    });

    console.log(result);

    // If the user did not cancel, we save the picture information.
    if (!result.canceled) {
      // The information is inside `result.assets`. We get the first one.
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
      
      // ✅ This part is still the same: we format the file information correctly.
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

  // === 6. The Screen's Drawing Board (The JSX) ===
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Post New Item</Text>
      <Text style={styles.infoText}>Fill out the form to post your product, service, or hostel.</Text>
      <Text style={styles.infoText}>(All fields are required)</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Apple iPhone 12 Pro"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
          placeholder="Describe your item..."
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Price (e.g., 15000.00):</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
          placeholder="e.g., 15000.00"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>WhatsApp Number (e.g., +2348012345678):</Text>
        <TextInput
          style={styles.input}
          value={whatsappNumber}
          onChangeText={setWhatsappNumber}
          keyboardType="phone-pad"
          placeholder="e.g., +2348012345678"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Main Campus Area"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Image:</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
          <Text style={styles.imagePickerButtonText}>
            {image ? 'Image Selected' : 'Choose an image'}
          </Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Posting...' : 'Post Item'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// === 7. The Stylesheet ===
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
    color: '#555',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  submitButton: {
    backgroundColor: '#007bff',
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

export default SellerPage;
