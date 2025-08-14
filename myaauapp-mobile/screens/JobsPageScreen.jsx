// screens/JobsScreen.jsx

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

// Part 2: Create our React Screen Component
const JobsPage = () => {
  // Part 3: The Job Manager's Sticky Notes (State Variables)
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Function to fetch job posts from Django API
  const fetchJobPosts = useCallback(async (url) => {
    setLoading(true);
    setError('');

    try {
      // Make a GET request to your Django backend's jobs API endpoint
      const response = await fetch(
        url || `${API_URL}/api/quiz/jobs/` // Use provided URL or default base URL
      );

      if (!response.ok) {
        throw new Error(`Failed to load jobs: ${response.status} ${response.statusText}.`);
      }

      const data = await response.json();

      // Save the actual list of job posts and pagination URLs
      setJobPosts(data.results);
      setNextPageUrl(data.next);
      setPreviousPageUrl(data.previous);

      // Extract the current page number from the URL
      const currentUrl = url || `${API_URL}/api/quiz/jobs/`;
      const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
      const pageNum = urlParams.get('page');
      setCurrentPage(pageNum ? parseInt(pageNum, 10) : 1);

      console.log('Job posts fetched successfully:', data.results);

    } catch (err) {
      console.error('Error fetching job posts:', err);
      setError('An error occurred. Please check your network and try again.');
      Alert.alert('Error', 'Failed to load job posts. Is your Django server running?');
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  }, []);

  // 3. useEffect Hook: This calls fetchJobPosts when the component first appears on screen
  useEffect(() => {
    fetchJobPosts();
  }, [fetchJobPosts]);

  // 4. Handlers for pagination buttons
  const handleNextPage = () => {
    if (nextPageUrl) {
      fetchJobPosts(nextPageUrl);
    }
  };

  const handlePreviousPage = () => {
    if (previousPageUrl) {
      fetchJobPosts(previousPageUrl);
    }
  };
  
  // Handler for "Apply Now" button
  const handleApplyNow = (url) => {
    // This function will open the job link in the user's mobile browser
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Failed to open link. Please check your internet connection.');
      console.error("Couldn't load page", err);
    });
  };

  // 5. Conditional rendering for loading, error, or no jobs
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading job posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (jobPosts.length === 0 && currentPage === 1) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.infoText}>No job posts found yet.</Text>
      </View>
    );
  }

  // 6. Main render: Display job posts and pagination buttons
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.pageTitle}>Job Posts</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {jobPosts.map(job => (
          <View key={job.id} style={styles.jobCard}>
            {job.image_url ? (
              <Image
                source={{ uri: job.image_url }}
                style={styles.jobImage}
                resizeMode="contain"
              />
            ) : null}
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobSummary}>{job.summary}</Text>
            <Text style={styles.jobInfo}>Source: {job.source}</Text>
            <Text style={styles.jobInfo}>Posted: {job.date_posted || new Date(job.scraped_at).toLocaleDateString()}</Text>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => handleApplyNow(job.link)}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Buttons */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          disabled={!previousPageUrl || loading}
          style={[styles.paginationButton, (!previousPageUrl || loading) && styles.disabledButton]}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>Page {currentPage}</Text>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={!nextPageUrl || loading}
          style={[styles.paginationButton, (!nextPageUrl || loading) && styles.disabledButton]}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Part 4: The Stylesheet (Our Style Guide)
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20, // Add padding for the pagination buttons
  },
  jobCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  jobImage: {
    width: '100%',
    height: 160,
    borderRadius: 4,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  jobSummary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  jobInfo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  applyButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
  },
  applyButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  paginationButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  paginationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default JobsPage;
