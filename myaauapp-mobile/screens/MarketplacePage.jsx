// screens/MarketplaceScreen.jsx

// This screen shows all the posted items and lets the user browse them.

import React, { useState, useEffect, useCallback } from 'react'; // React's core tools.
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator, // A cool spinning circle to show when we are loading.
  Linking, // Our tool to open other apps, like WhatsApp.
  Alert, // A simple way to show a message to the user.
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Our tool for getting the token.
import { API_URL } from '../constants/api'; // Our API address constant.
import axios from 'axios'; // ✨ NEW: Using axios is often easier for a beginner.

// This is our main screen component for the marketplace.
function MarketplacePage({ navigation }) {
  // === 1. The Manager's Sticky Notes (State Variables) ===
  // These notes hold the list of items and the status of our page.
  const [items, setItems] = useState([]); // A list to hold all the items we get from the server.
  const [loading, setLoading] = useState(true); // A note that is 'true' when we are waiting.
  const [error, setError] = useState(''); // A note for any error messages.
  const [nextPageUrl, setNextPageUrl] = useState(null); // The address for the next page of items.
  const [previousPageUrl, setPreviousPageUrl] = useState(null); // The address for the previous page.
  const [currentPage, setCurrentPage] = useState(1); // The number of the page we are on.
  // ✨ NEW: A note to explicitly track if the user is logged in.
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);


  // === 2. The Worker Function (fetchItems) ===
  // This is a special function that goes and gets the items from the server.
  // We use `useCallback` to make sure this function is only created once.
  const fetchItems = useCallback(async (url) => {
    // Before we even try to fetch, we check if the user is authenticated.
    if (!isUserAuthenticated) {
        setError('You must be logged in to view items.');
        setLoading(false);
        return;
    }

    setLoading(true); // Start loading, turn on the spinning circle.
    setError(''); // Clear any old errors.

    try {
      // We get the token from AsyncStorage.
      const authToken = await AsyncStorage.getItem('authToken');
      
      // If the token is missing, we don't proceed.
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in.');
      }

      // We use the `axios` tool to make a GET request to our server.
      const response = await axios.get(
        url || `${API_URL}/api/buyandsell/`, // Use the provided URL, or the default first page.
        {
          headers: {
            'Authorization': `Token ${authToken}`, // Put our token in the header.
          },
        }
      );

      setItems(response.data.results); // We save the list of items to our `items` sticky note.
      setNextPageUrl(response.data.next); // We save the next page's address.
      setPreviousPageUrl(response.data.previous); // We save the previous page's address.

      // We figure out the current page number from the URL.
      const currentUrl = url || `${API_URL}/api/buyandsell/`;
      const urlParams = new URLSearchParams(new URL(currentUrl).search);
      const pageNum = urlParams.get('page');
      setCurrentPage(pageNum ? parseInt(pageNum) : 1); // We save the page number.

    } catch (err) {
      // If anything goes wrong, we save the error message.
      console.error('Error fetching items:', err.response || err);
      // We check if the error is a 401 Unauthorized error.
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        const errorMsg = 'Your session has expired. Please log in again.';
        setError(errorMsg);
        Alert.alert('Error', errorMsg);
        await AsyncStorage.removeItem('authToken'); // We remove the bad token.
        setIsUserAuthenticated(false); // We update our state to reflect the user is no longer logged in.
      } else {
        setError(err.message || 'An unexpected error occurred.');
        Alert.alert('Error', err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // We stop loading, hide the spinning circle.
    }
  }, [isUserAuthenticated]); // ✨ MODIFIED: The function now depends on `isUserAuthenticated` state.

  // === 3. The Lifecycle Manager (useEffect) ===
  // This special function runs when the screen first opens.
  useEffect(() => {
    // We create a helper function to check the token and update our state.
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem('authToken');
      // `!!` is a quick way to turn the token (or `null`) into `true` or `false`.
      setIsUserAuthenticated(!!token); 
    };

    checkAuthentication();
  }, []); // This effect only runs once when the component is created.

  // ✨ MODIFIED: A second useEffect hook that only runs when the authentication status changes.
  // This is the key fix! It makes sure we only try to fetch items AFTER we've confirmed the user's login status.
  useEffect(() => {
    // If the user is authenticated, we start fetching the items.
    if (isUserAuthenticated) {
      fetchItems(); // We call the function to start fetching data.
    } else {
      // If the user is not authenticated, we stop loading and show an error.
      setLoading(false);
      setError('You must be logged in to view the marketplace.');
    }
  }, [isUserAuthenticated, fetchItems]); // This effect depends on our new state and the fetch function.


  // === 4. Handlers for the "Next" and "Previous" buttons ===
  const handleNextPage = () => {
    if (nextPageUrl) {
      fetchItems(nextPageUrl); // Go get the items from the next page.
    }
  };

  const handlePreviousPage = () => {
    if (previousPageUrl) {
      fetchItems(previousPageUrl); // Go get the items from the previous page.
    }
  };

  // === 5. A helper function to open WhatsApp ===
  // This is the correct way to open another app from a React Native app.
  const handleWhatsAppChat = (whatsappNumber) => {
    // We clean the number to make sure it only has numbers.
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}`;

    // We use `Linking.openURL` to try and open the WhatsApp link.
    Linking.openURL(url).catch(err => {
      console.error('Failed to open WhatsApp:', err);
      Alert.alert('Error', 'Could not open WhatsApp. Please make sure the app is installed.');
    });
  };


  // === 6. The Screen's Drawing Board (The JSX) ===
  // This is what actually shows up on the user's phone.
  
  // We show a loading indicator if we are waiting for data.
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading marketplace items...</Text>
      </View>
    );
  }

  // We show an error message if something went wrong.
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchItems()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // We show a message if there are no items to show.
  if (items.length === 0 && currentPage === 1) {
    return (
      <View style={styles.noItemsContainer}>
        <Text style={styles.noItemsText}>No items posted yet. Be the first to post!</Text>
      </View>
    );
  }

  // This is the main view with all the items.
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Marketplace Listings</Text>
      <View style={styles.itemsGrid}>
        {items.map(item => (
          // Each item gets its own card, using the unique ID as the `key`.
          <View key={item.id} style={styles.itemCard}>
            {item.image && (
              // The `Image` component needs a `source` prop with a `uri`.
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>
              Price: ₦{parseFloat(item.price).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text style={styles.itemLocation}>Location: {item.location || 'N/A'}</Text>
            <Text style={styles.itemPostedBy}>
              Posted by: {item.seller_username} on {new Date(item.created_at).toLocaleDateString()}
            </Text>
            {/* The WhatsApp button uses a `TouchableOpacity` and our `handleWhatsAppChat` function. */}
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={() => handleWhatsAppChat(item.whatsapp_number)}
            >
              <Text style={styles.whatsappButtonText}>💬 Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Pagination Buttons */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, !previousPageUrl && styles.disabledButton]}
          onPress={handlePreviousPage}
          disabled={!previousPageUrl || loading}
        >
          <Text style={styles.paginationButtonText}>Previous Page</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>Page {currentPage}</Text>
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
  container: {
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
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
    backgroundColor: '#f0f4f7',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  noItemsText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // In React Native, we need to manually add margins for spacing between items.
  },
  itemCard: {
    width: '48%', // This makes two cards fit on one line with some space in between.
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15, // Space at the bottom of each card.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android.
  },
  itemImage: {
    width: '100%',
    height: 120, // We give the image a fixed height.
    borderRadius: 4,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  itemLocation: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  itemPostedBy: {
    fontSize: 10,
    color: '#999',
    marginBottom: 10,
  },
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
    backgroundColor: '#cccccc', // Gray color for disabled buttons.
  },
  paginationButtonText: {
    color: 'white',
    fontSize: 16,
  },
  pageNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MarketplacePage;
