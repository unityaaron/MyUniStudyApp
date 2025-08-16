// screens/ScholarshipsScreen.jsx

// Part 1: Bring in the Tools (React Native Building Blocks)
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Linking
} from 'react-native';
import { API_URL } from '../constants/api'; // Import our API_URL constant
// 🟢 FIX: Import the useTheme hook
import { useTheme } from '../components/ThemeProvider';

// Part 2: Create our React Screen Component
const ScholarshipsPage = () => {
  // Part 3: The Scholarship Manager's Sticky Notes (State Variables)
  const [scholarshipPosts, setScholarshipPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 🟢 FIX: Get the current theme to style the component
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // 2. Function to fetch scholarship posts from Django API
  const fetchScholarshipPosts = useCallback(async (url) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        url || `${API_URL}/api/quiz/scholarships/`
      );

      if (!response.ok) {
        throw new Error(`Failed to load scholarships: ${response.status} ${response.statusText}.`);
      }

      const data = await response.json();
      setScholarshipPosts(data.results);
      setNextPageUrl(data.next);
      setPreviousPageUrl(data.previous);

      const currentUrl = url || `${API_URL}/api/quiz/scholarships/`;
      const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
      const pageNum = urlParams.get('page');
      setCurrentPage(pageNum ? parseInt(pageNum, 10) : 1);

      console.log('Scholarship posts fetched successfully:', data.results);

    } catch (err) {
      console.error('Error fetching scholarship posts:', err);
      setError('An error occurred. Please check your network and try again.');
      Alert.alert('Error', 'Failed to load scholarship posts. Is your Django server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. useEffect Hook: This calls fetchScholarshipPosts when the component first appears on screen
  useEffect(() => {
    fetchScholarshipPosts();
  }, [fetchScholarshipPosts]);

  // 4. Handlers for pagination buttons
  const handleNextPage = () => {
    if (nextPageUrl) {
      fetchScholarshipPosts(nextPageUrl);
    }
  };

  const handlePreviousPage = () => {
    if (previousPageUrl) {
      fetchScholarshipPosts(previousPageUrl);
    }
  };

  // Handler for "Learn More" button
  const handleLearnMore = (url) => {
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Failed to open link. Please check your internet connection.');
      console.error("Couldn't load page", err);
    });
  };

  // 5. Conditional rendering for loading, error, or no scholarships
  // 🟢 FIX: Use themed background and text colors for these containers
  if (loading) {
    return (
      <View style={[styles.centeredContainer, isDark ? styles.centeredContainerDark : styles.centeredContainerLight]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={[styles.loadingText, isDark ? styles.textDark : styles.textLight]}>Loading scholarship posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centeredContainer, isDark ? styles.centeredContainerDark : styles.centeredContainerLight]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (scholarshipPosts.length === 0 && currentPage === 1) {
    return (
      <View style={[styles.centeredContainer, isDark ? styles.centeredContainerDark : styles.centeredContainerLight]}>
        <Text style={[styles.infoText, isDark ? styles.textDark : styles.textLight]}>No scholarship posts found yet.</Text>
      </View>
    );
  }

  // 6. Main render: Display scholarship posts and pagination buttons
  return (
    // 🟢 FIX: Use themed background for the main container
    <View style={[styles.mainContainer, isDark ? styles.mainContainerDark : styles.mainContainerLight]}>
      {/* 🟢 FIX: Use themed text color for the title */}
      <Text style={[styles.pageTitle, isDark ? styles.textDark : styles.textLight]}>Scholarship Posts</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {scholarshipPosts.map(scholarship => (
          // 🟢 FIX: Use themed background for each card
          <View key={scholarship.id} style={[styles.scholarshipCard, isDark ? styles.cardDark : styles.cardLight]}>
            {scholarship.image_url ? (
              <Image
                source={{ uri: scholarship.image_url }}
                style={styles.scholarshipImage}
                resizeMode="contain"
              />
            ) : null}
            {/* 🟢 FIX: Use themed text colors for all text inside the card */}
            <Text style={[styles.scholarshipTitle, isDark ? styles.textDark : styles.textLight]}>{scholarship.title}</Text>
            <Text style={[styles.scholarshipSummary, isDark ? styles.summaryTextDark : styles.summaryTextLight]}>{scholarship.summary}</Text>
            <Text style={[styles.scholarshipInfo, isDark ? styles.infoTextDark : styles.infoTextLight]}>Source: {scholarship.source}</Text>
            <Text style={[styles.scholarshipInfo, isDark ? styles.infoTextDark : styles.infoTextLight]}>Posted: {scholarship.date_posted}</Text>

            <TouchableOpacity
              style={[styles.learnMoreButton, isDark ? styles.learnMoreButtonDark : styles.learnMoreButtonLight]}
              onPress={() => handleLearnMore(scholarship.link)}
            >
              <Text style={styles.learnMoreButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Buttons */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          disabled={!previousPageUrl || loading}
          style={[styles.paginationButton, (!previousPageUrl || loading) && styles.disabledButton, isDark ? styles.buttonDark : styles.buttonLight]}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        {/* 🟢 FIX: Use themed text color for the page number */}
        <Text style={[styles.pageNumber, isDark ? styles.textDark : styles.textLight]}>Page {currentPage}</Text>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={!nextPageUrl || loading}
          style={[styles.paginationButton, (!nextPageUrl || loading) && styles.disabledButton, isDark ? styles.buttonDark : styles.buttonLight]}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Part 4: The Stylesheet (Our Style Guide)
const styles = StyleSheet.create({
  // 🟢 FIX: Add a dark version of the main container style
  mainContainer: { flex: 1, padding: 10 },
  mainContainerLight: { backgroundColor: '#f0f4f7' },
  mainContainerDark: { backgroundColor: '#121212' },
  
  // 🟢 FIX: Add a dark version of the centered container style
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centeredContainerLight: { backgroundColor: '#f0f4f7' },
  centeredContainerDark: { backgroundColor: '#121212' },
  
  loadingText: { marginTop: 10, fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', fontSize: 16 },
  infoText: { fontSize: 16 },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  
  // 🟢 FIX: Add light and dark versions of the card
  scholarshipCard: {
    width: '100%',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
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
  
  scholarshipImage: { width: '100%', height: 160, borderRadius: 4, marginBottom: 10 },
  scholarshipTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  scholarshipSummary: { fontSize: 14, marginBottom: 10 },
  scholarshipInfo: { fontSize: 12, marginBottom: 3 },
  
  // 🟢 FIX: Add themed styles for text
  textLight: { color: '#000' },
  textDark: { color: 'white' },
  summaryTextLight: { color: '#666' },
  summaryTextDark: { color: '#bbb' },
  infoTextLight: { color: '#999' },
  infoTextDark: { color: '#888' },
  
  // 🟢 FIX: Add themed styles for buttons
  learnMoreButton: { borderRadius: 5, paddingVertical: 10, marginTop: 10 },
  learnMoreButtonLight: { backgroundColor: '#007bff' },
  learnMoreButtonDark: { backgroundColor: '#1E90FF' },
  learnMoreButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 14 },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonLight: { backgroundColor: '#007bff' },
  buttonDark: { backgroundColor: '#1E90FF' },
  disabledButton: { backgroundColor: '#cccccc' },
  paginationButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  pageNumber: { fontSize: 18, fontWeight: 'bold' },
});

export default ScholarshipsPage;