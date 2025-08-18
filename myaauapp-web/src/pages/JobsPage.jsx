// src/pages/JobsPage.jsx

import React, { useState, useEffect, useCallback } from 'react'; // Import necessary React hooks
import axios from 'axios';                                   // Import axios for API calls

function JobsPage() {
  // 1. State variables to hold data and manage UI
  const [jobPosts, setJobPosts] = useState([]);      // List of job posts fetched from Django
  const [loading, setLoading] = useState(true);        // True when data is being fetched, false otherwise
  const [error, setError] = useState('');              // Stores any error messages
  const [nextPageUrl, setNextPageUrl] = useState(null);    // URL for the next page of job posts
  const [previousPageUrl, setPreviousPageUrl] = useState(null); // URL for the previous page of job posts
  const [currentPage, setCurrentPage] = useState(1);   // Keeps track of the current page number

  // 2. Function to fetch job posts from Django API
  //    We use `useCallback` to prevent this function from being re-created unnecessarily
  //    every time the component re-renders, which helps performance and avoids `useEffect` issues.
  const fetchJobPosts = useCallback(async (url) => {
    setLoading(true); // Start loading, so user sees a "Loading..." message
    setError('');     // Clear any old error messages from previous attempts

    try {
      // Get the authentication token from local storage
      // (Jobs are public by default in your API, but it's good practice
      // to include the token if the endpoint might become protected later,
      // or if other parts of your app send tokens always).
      // However, for JobPostListView, permission_classes = [IsAuthenticatedOrReadOnly]
      // means it doesn't strictly *require* a token to just view (read).
      // Let's omit the token for simplicity as it's a public listing.
      // const authToken = localStorage.getItem('authToken');

      // Make a GET request to your Django backend's jobs API endpoint
      const response = await axios.get(
        import.meta.env.VITE_API_URL + '/api/quiz/jobs/', // Use provided URL or default base URL
        // No headers needed for public API endpoint
        // If you wanted to send the token for a protected endpoint:
        // {
        //   headers: {
        //     'Authorization': `Token ${authToken}`
        //   }
        // }
      );

      // Django REST Framework's PageNumberPagination wraps results in an object:
      // { "count": ..., "next": "...", "previous": "...", "results": [...] }
      setJobPosts(response.data.results);       // Save the actual list of job posts
      setNextPageUrl(response.data.next);       // Save the URL for the next page
      setPreviousPageUrl(response.data.previous); // Save the URL for the previous page

      // Figure out the current page number from the URL
      const currentUrl = url || import.meta.env.VITE_API_URL + '/api/quiz/jobs/';
      const urlParams = new URLSearchParams(new URL(currentUrl).search);
      const pageNum = urlParams.get('page');
      setCurrentPage(pageNum ? parseInt(pageNum) : 1); // Set current page, default to 1

      console.log('Job posts fetched successfully:', response.data.results);

    } catch (err) {
      // Handle any errors that occur during the API request
      console.error('Error fetching job posts:', err);
      if (err.response) {
        setError(`Failed to load jobs: ${err.response.status} ${err.response.statusText}.`);
        // If it's a 401/403, and you later protect this endpoint, you might clear token/redirect
      } else if (err.request) {
        setError('No response from server. Is the Django backend running?');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  }, []); // Empty dependency array means fetchJobPosts function reference is stable

  // 3. useEffect Hook: This calls fetchJobPosts when the component first appears on screen
  useEffect(() => {
    fetchJobPosts(); // Call the function to fetch the first page of jobs
  }, [fetchJobPosts]); // Dependency array: run this effect when fetchJobPosts changes (which it won't due to useCallback)

  // 4. Handlers for pagination buttons
  const handleNextPage = () => {
    if (nextPageUrl) { // Only fetch if there is a next page
      fetchJobPosts(nextPageUrl);
    }
  };

  const handlePreviousPage = () => {
    if (previousPageUrl) { // Only fetch if there is a previous page
      fetchJobPosts(previousPageUrl);
    }
  };

  // 5. Conditional rendering for loading, error, or no jobs
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading job posts...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  if (jobPosts.length === 0 && currentPage === 1) { // Show message only if no jobs on first page
    return <div style={{ padding: '20px', textAlign: 'center' }}>No job posts found yet.</div>;
  }

  // 6. Main render: Display job posts and pagination buttons
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Job Posts</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {jobPosts.map(job => (
          <div key={job.id} style={{
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
            {job.image_url && ( // Display image if available
              <img
                src={job.image_url}
                alt={job.title}
                style={{ width: '100%', height: '160px', objectFit: 'contain', borderRadius: '4px', marginBottom: '10px' }}
              />
            )}
            <h3 style={{ marginBottom: '8px', color: '#333' }}>{job.title}</h3>
            <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>{job.summary}</p>
            <p style={{ fontSize: '0.8em', color: '#999', marginBottom: '5px' }}>Source: {job.source}</p>
            <p style={{ fontSize: '0.8em', color: '#999', marginBottom: '10px' }}>Posted: {job.date_posted || new Date(job.scraped_at).toLocaleDateString()}</p>

            <a
              href={job.link}
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
              Apply Now
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

export default JobsPage;