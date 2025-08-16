// screens/MarketplaceScreen.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';
import axios from 'axios';
// 🟢 FIX: Import the useTheme hook
import { useTheme } from '../components/ThemeProvider';

function MarketplacePage({ navigation }) {
  // === 1. The Manager's Sticky Notes (State Variables) ===
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // 🟢 FIX: Get the current theme to style the component
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // === 2. The Worker Function (fetchItems) ===
  const fetchItems = useCallback(async (url) => {
    if (!isUserAuthenticated) {
      setError('You must be logged in to view items.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in.');
      }

      const response = await axios.get(
        url || `${API_URL}/api/buyandsell/`,
        {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        }
      );

      setItems(response.data.results);
      setNextPageUrl(response.data.next);
      setPreviousPageUrl(response.data.previous);

      const currentUrl = url || `${API_URL}/api/buyandsell/`;
      const urlParams = new URLSearchParams(new URL(currentUrl).search);
      const pageNum = urlParams.get('page');
      setCurrentPage(pageNum ? parseInt(pageNum) : 1);

    } catch (err) {
      console.error('Error fetching items:', err.response || err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        const errorMsg = 'Your session has expired. Please log in again.';
        setError(errorMsg);
        Alert.alert('Error', errorMsg);
        await AsyncStorage.removeItem('authToken');
        setIsUserAuthenticated(false);
      } else {
        setError(err.message || 'An unexpected error occurred.');
        Alert.alert('Error', err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [isUserAuthenticated]);

  // === 3. The Lifecycle Manager (useEffect) ===
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsUserAuthenticated(!!token);
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchItems();
    } else {
      setLoading(false);
      setError('You must be logged in to view the marketplace.');
    }
  }, [isUserAuthenticated, fetchItems]);

  // === 4. Handlers for the "Next" and "Previous" buttons ===
  const handleNextPage = () => {
    if (nextPageUrl) {
      fetchItems(nextPageUrl);
    }
  };

  const handlePreviousPage = () => {
    if (previousPageUrl) {
      fetchItems(previousPageUrl);
    }
  };

  // === 5. A helper function to open WhatsApp ===
  const handleWhatsAppChat = (whatsappNumber) => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}`;
    Linking.openURL(url).catch(err => {
      console.error('Failed to open WhatsApp:', err);
      Alert.alert('Error', 'Could not open WhatsApp. Please make sure the app is installed.');
    });
  };

  // === 6. The Screen's Drawing Board (The JSX) ===
  // 🟢 FIX: Use a dynamic style for the main container
  const containerStyle = isDark ? styles.containerDark : styles.containerLight;
  const cardStyle = isDark ? styles.itemCardDark : styles.itemCardLight;
  const titleStyle = isDark ? styles.titleDark : styles.titleLight;
  const descriptionStyle = isDark ? styles.descriptionDark : styles.descriptionLight;
  const priceStyle = isDark ? styles.priceDark : styles.priceLight;
  const locationStyle = isDark ? styles.locationDark : styles.locationLight;
  const postedByStyle = isDark ? styles.postedByDark : styles.postedByLight;
  const pageNumberStyle = isDark ? styles.pageNumberDark : styles.pageNumberLight;

  if (loading) {
    return (
      // 🟢 FIX: Use dynamic style for loading container
      <View style={[styles.loadingContainer, containerStyle]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#007bff'} />
        <Text style={[styles.loadingText, descriptionStyle]}>Loading marketplace items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      // 🟢 FIX: Use dynamic style for error container
      <View style={[styles.errorContainer, containerStyle]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchItems()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0 && currentPage === 1) {
    return (
      // 🟢 FIX: Use dynamic style for no-items container
      <View style={[styles.noItemsContainer, containerStyle]}>
        <Text style={[styles.noItemsText, descriptionStyle]}>No items posted yet. Be the first to post!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <Text style={[styles.pageTitle, titleStyle]}>Marketplace Listings</Text>
      <View style={styles.itemsGrid}>
        {items.map(item => (
          <View key={item.id} style={cardStyle}>
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            )}
            <Text style={[styles.itemTitle, titleStyle]}>{item.title}</Text>
            <Text style={[styles.itemDescription, descriptionStyle]}>{item.description}</Text>
            <Text style={[styles.itemPrice, priceStyle]}>
              Price: ₦{parseFloat(item.price).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text style={[styles.itemLocation, locationStyle]}>Location: {item.location || 'N/A'}</Text>
            <Text style={[styles.itemPostedBy, postedByStyle]}>
              Posted by: {item.seller_username} on {new Date(item.created_at).toLocaleDateString()}
            </Text>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={() => handleWhatsAppChat(item.whatsapp_number)}
            >
              <Text style={styles.whatsappButtonText}>💬 Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, !previousPageUrl && styles.disabledButton]}
          onPress={handlePreviousPage}
          disabled={!previousPageUrl || loading}
        >
          <Text style={styles.paginationButtonText}>Previous Page</Text>
        </TouchableOpacity>
        <Text style={[styles.pageNumber, pageNumberStyle]}>Page {currentPage}</Text>
        <TouchableOpacity
          style={[styles.paginationButton, !nextPageUrl && styles.disabledButton]}
          onPress={handleNextPage}
          disabled={!nextPageUrl || loading}
        >
          <Text style={styles.paginationButtonText}>Next Page</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// === 7. The Stylesheet (Our Style Guide) ===
const styles = StyleSheet.create({
  // 🟢 FIX: Added separate styles for light and dark themes
  containerLight: { padding: 20, backgroundColor: '#f0f4f7' },
  containerDark: { padding: 20, backgroundColor: '#121212' },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16 },
  
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 10 },
  retryButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  retryButtonText: { color: 'white', fontSize: 16 },

  noItemsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  noItemsText: { fontSize: 18, textAlign: 'center' },
  
  pageTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  // 🟢 FIX: Added separate styles for light and dark item cards
  itemCardLight: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemCardDark: {
    width: '48%',
    backgroundColor: '#1F1F1F', // Dark gray background for cards
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#fff', // White shadow for dark mode
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: 4,
    marginBottom: 10,
  },
  
  // 🟢 FIX: Added separate styles for light and dark text colors
  itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  itemDescription: { fontSize: 14, marginBottom: 10 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  itemLocation: { fontSize: 12, marginBottom: 5 },
  itemPostedBy: { fontSize: 10, marginBottom: 10 },
  titleLight: { color: '#000' },
  titleDark: { color: '#fff' },
  descriptionLight: { color: '#666' },
  descriptionDark: { color: '#aaa' },
  priceLight: { color: '#007bff' },
  priceDark: { color: '#2196F3' },
  locationLight: { color: '#888' },
  locationDark: { color: '#ccc' },
  postedByLight: { color: '#999' },
  postedByDark: { color: '#bbb' },
  pageNumberLight: { color: '#333' },
  pageNumberDark: { color: '#fff' },

  whatsappButton: {
    backgroundColor: '#25D366',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  whatsappButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  paginationButtonText: {
    color: 'white',
    fontSize: 16,
  },
  pageNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MarketplacePage;