// src/pages/Marketplace.jsx

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import axios from 'axios';

function MarketPlace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);     // ✅ NEW: State for next page URL
  const [previousPageUrl, setPreviousPageUrl] = useState(null); // ✅ NEW: State for previous page URL
  const [currentPage, setCurrentPage] = useState(1);       // ✅ NEW: State for current page number

  // ✅ NEW: We make fetchItems a useCallback function.
  // This helps prevent unnecessary re-creations of this function.
  const fetchItems = useCallback(async (url) => {
    setLoading(true);
    setError('');

    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setError('You must be logged in to view items.');
        setLoading(false);
        navigate('/login'); // Uncomment if you want to redirect to login on missing token
        return;
      }

      // Use the URL passed to the function, or the default API URL if none is provided
      const response = await axios.get(
        import.meta.env.VITE_API_URL + '/api/buyandsell/', // Use provided URL or default
        {
          headers: {
            'Authorization': `Token ${authToken}`
          }
        }
      );

      setItems(response.data.results);
      setNextPageUrl(response.data.next);       // ✅ Set next page URL
      setPreviousPageUrl(response.data.previous); // ✅ Set previous page URL

      // If we got a URL, we need to figure out the current page.
      // This is a bit tricky because Django only gives 'next' and 'previous' URLs.
      // A simple way is to check the 'page' query parameter.
      const currentUrl = url || import.meta.env.VITE_API_URL + '/api/buyandsell/';
      const urlParams = new URLSearchParams(new URL(currentUrl).search);
      const pageNum = urlParams.get('page');
      setCurrentPage(pageNum ? parseInt(pageNum) : 1); // Set current page number

      console.log('Items fetched successfully:', response.data.results);
      console.log('Next Page URL:', response.data.next);
      console.log('Previous Page URL:', response.data.previous);


    } catch (err) {
      console.error('Error fetching items:', err);
      if (err.response) {
        setError(`Failed to load items: ${err.response.status} ${err.response.statusText}.`);
        if (err.response.status === 401 || err.response.status === 403) {
            setError('Your session has expired or you are not authorized. Please log in again.');
            localStorage.removeItem('authToken');
        }
      } else if (err.request) {
        setError('No response from server. Is the Django backend running?');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array, so fetchItems is stable

  // useEffect Hook: Calls fetchItems when the component mounts
  useEffect(() => {
    fetchItems(); // Call without arguments to fetch the first page
  }, [fetchItems]); // fetchItems is a dependency because it's defined outside useEffect now


  // Handlers for Next and Previous buttons
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


  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading marketplace items...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Marketplace Listings</h1>
      {items.length === 0 && currentPage === 1 ? ( // Only show "no items" if no items on the very first page
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No items posted yet. Be the first to post!</p>
      ) : (
        <> {/* Use a React Fragment to group elements without adding extra HTML */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {items.map(item => (
              <div key={item.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                  />
                )}
                <h3 style={{ marginBottom: '5px', color: '#333' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>{item.description}</p>
                <p style={{ fontWeight: 'bold', color: '#007bff', marginBottom: '5px' }}>Price: ₦{parseFloat(item.price).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p style={{ fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>Location: {item.location || 'N/A'}</p>
                <p style={{ fontSize: '0.8em', color: '#999', marginBottom: '10px' }}>Posted by: {item.seller_username} on {new Date(item.created_at).toLocaleDateString()}</p>

                <a
                  href={`https://wa.me/${item.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#25D366',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    marginTop: '10px',
                    fontSize: '0.9em'
                  }}
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            ))}
          </div>

          {/* ✅ NEW: Pagination Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '10px 0' }}>
            <button
              onClick={handlePreviousPage}
              disabled={!previousPageUrl || loading} // Disable if no previous page or still loading
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
            <span style={{ alignSelf: 'center', fontSize: '1.1em', fontWeight: 'bold' }}>Page {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={!nextPageUrl || loading} // Disable if no next page or still loading
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
        </>
      )}
    </div>
  );
}

export default MarketPlace;