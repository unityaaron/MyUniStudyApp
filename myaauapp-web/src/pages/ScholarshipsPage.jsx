// src/pages/ScholarshipsPage.jsx

import React, { useState, useEffect, useCallback } from 'react'; // Import necessary React hooks
import axios from 'axios';                                     // Import axios for API calls

function ScholarshipsPage() {
  // 1. State variables to hold data and manage UI for scholarships
  const [scholarshipPosts, setScholarshipPosts] = useState([]); // List of scholarship posts fetched from Django
  const [loading, setLoading] = useState(true);                  // True when data is being fetched, false otherwise
  const [error, setError] = useState('');                        // Stores any error messages
  const [nextPageUrl, setNextPageUrl] = useState(null);          // URL for the next page of scholarship posts
  const [previousPageUrl, setPreviousPageUrl] = useState(null);  // URL for the previous page of scholarship posts
  const [currentPage, setCurrentPage] = useState(1);             // Keeps track of the current page number

  // 2. Function to fetch scholarship posts from Django API
  //    We use `useCallback` to prevent this function from being re-created unnecessarily
  //    every time the component re-renders, which helps performance and avoids `useEffect` issues.
  const fetchScholarshipPosts = useCallback(async (url) => {
    setLoading(true); // Start loading, so user sees a "Loading..." message
    setError('');     // Clear any old error messages from previous attempts

    try {
      // Make a GET request to your Django backend's scholarships API endpoint
      // The endpoint is 'http://127.0.0.1:8000/api/quiz/scholarships/'
      const response = await axios.get(
        url || import.meta.env.VITE_API_URL + '/api/quiz/scholarships/', // Use provided URL or default base URL
      );

      // Django REST Framework's PageNumberPagination wraps results in an object:
      // { "count": ..., "next": "...", "previous": "...", "results": [...] }
      setScholarshipPosts(response.data.results);      // Save the actual list of scholarship posts
      setNextPageUrl(response.data.next);              // Save the URL for the next page
      setPreviousPageUrl(response.data.previous);      // Save the URL for the previous page

      // Figure out the current page number from the URL
      const currentUrl = url || import.meta.env.VITE_API_URL + '/api/quiz/scholarships/';
      const urlParams = new URLSearchParams(new URL(currentUrl).search);
      const pageNum = urlParams.get('page');
      setCurrentPage(pageNum ? parseInt(pageNum) : 1); // Set current page, default to 1

      console.log('Scholarship posts fetched successfully:', response.data.results);

    } catch (err) {
      // Handle any errors that occur during the API request
      console.error('Error fetching scholarship posts:', err);
      if (err.response) {
        setError(`Failed to load scholarships: ${err.response.status} ${err.response.statusText}.`);
      } else if (err.request) {
        setError('No response from server. Is the Django backend running?');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  }, []); // Empty dependency array means fetchScholarshipPosts function reference is stable

  // 3. useEffect Hook: This calls fetchScholarshipPosts when the component first appears on screen
  useEffect(() => {
    fetchScholarshipPosts(); // Call the function to fetch the first page of scholarships
  }, [fetchScholarshipPosts]); // Dependency array: run this effect when fetchScholarshipPosts changes (which it won't due to useCallback)

  // 4. Handlers for pagination buttons
  const handleNextPage = () => {
    if (nextPageUrl) { // Only fetch if there is a next page
      fetchScholarshipPosts(nextPageUrl);
    }
  };

  const handlePreviousPage = () => {
    if (previousPageUrl) { // Only fetch if there is a previous page
      fetchScholarshipPosts(previousPageUrl);
    }
  };

  // 5. Conditional rendering for loading, error, or no scholarships
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading scholarship posts...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  if (scholarshipPosts.length === 0 && currentPage === 1) { // Show message only if no scholarships on first page
    return <div style={{ padding: '20px', textAlign: 'center' }}>No scholarship posts found yet.</div>;
  }

  // 6. Main render: Display scholarship posts and pagination buttons
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Scholarship Posts</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {scholarshipPosts.map(scholarship => (
          <div key={scholarship.id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.2s'
          }}>
            {scholarship.image_url && ( // Display image if available
              <img
                src={scholarship.image_url}
                alt={scholarship.title}
                style={{ width: '100%', height: '160px', objectFit: 'contain', borderRadius: '4px', marginBottom: '10px' }}
              />
            )}
            <h3 style={{ marginBottom: '8px', color: '#333' }}>{scholarship.title}</h3>
            <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>{scholarship.summary}</p>
            <p style={{ fontSize: '0.8em', color: '#999', marginBottom: '5px' }}>Source: {scholarship.source}</p>
            <p style={{ fontSize: '0.8em', color: '#999', marginBottom: '10px' }}>Posted: {scholarship.date_posted}</p>

            <a
              href={scholarship.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                backgroundColor: '#007bff',
                color: 'white',
                padding: '8px 15px',
                borderRadius: '5px',
                textDecoration: 'none',
                textAlign: 'center',
                marginTop: '10px',
                fontSize: '0.9em',
                fontWeight: 'bold'
              }}
            >
              Learn More
            </a>
          </div>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', padding: '10px 0' }}>
        <button
          onClick={handlePreviousPage}
          disabled={!previousPageUrl || loading}
          style={{
            padding: '10px 20px',
            backgroundColor: previousPageUrl && !loading ? '#007bff' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: previousPageUrl && !loading ? 'pointer' : 'not-allowed',
            fontSize: '16px'
          }}
        >
          Previous Page
        </button>
        <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={!nextPageUrl || loading}
          style={{
            padding: '10px 20px',
            backgroundColor: nextPageUrl && !loading ? '#007bff' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: nextPageUrl && !loading ? 'pointer' : 'not-allowed',
            fontSize: '16px'
          }}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default ScholarshipsPage;
