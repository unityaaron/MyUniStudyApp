// src/pages/SellerPage.jsx

import React, { useState } from 'react'; // Import useState for managing form input
import axios from 'axios';               // Import axios for making API requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function SellerPage() {
  // 1. State variables for each form input
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // Price will be a string initially to handle commas
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null); // State to hold the selected image file

  // State variables for displaying messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Initialize the navigate hook for redirection

  // 2. Function to handle changes in the price input specifically
  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    // This regular expression allows digits (0-9) and a period (.)
    // It also ensures that if a period is typed, it's only one.
    const cleanedValue = value.replace(/[^0-9.]/g, ''); // Remove anything that's not a digit or a period
    const parts = cleanedValue.split('.');
    if (parts.length > 2) { // If there's more than one decimal point, keep only the first part and the first decimal
      setPrice(parts[0] + '.' + parts.slice(1).join(''));
    } else {
      setPrice(cleanedValue);
    }
  };

  // 3. Function to handle file selection (for image upload)
  const handleImageChange = (e) => {
    // e.target.files is an array of selected files. We only care about the first one.
    setImage(e.target.files[0]);
  };

  // 4. Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default browser form submission (page reload)

    setError('');    // Clear previous error messages
    setSuccess('');  // Clear previous success messages

    try {
      // 5. Create a FormData object to send both text and file data
      // This is essential when you have file inputs (like images)
      const formData = new FormData();

      // Append all text fields to FormData
      formData.append('title', title);
      formData.append('description', description);

      // ✅ Important: Clean the price by removing commas before sending to Django
      const cleanPrice = price.replace(/,/g, '');
      formData.append('price', cleanPrice); // Send the cleaned price

      formData.append('whatsapp_number', whatsappNumber);
      formData.append('location', location);

      // Append the image file if one was selected
      if (image) {
        formData.append('image', image);
      }

      // 6. Get the authentication token from local storage
      const authToken = localStorage.getItem('authToken');

      // Check if token exists before making the request
      if (!authToken) {
        setError('You must be logged in to post an item.');
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      // 7. Make the POST request to your Django backend API
      const response = await axios.post(
        'http://127.0.0.1:8000/api/buyandsell/', // Your Django API endpoint for creating items
        formData, // Send the FormData object
        {
          headers: {
            // ✅ Important: When sending FormData, 'Content-Type' header is usually
            // handled automatically by the browser/axios as 'multipart/form-data'.
            // You only need to explicitly set Authorization.
            'Authorization': `Token ${authToken}`, // Include the authentication token
            // 'Content-Type': 'multipart/form-data' // You can explicitly set this, but axios often handles it
          },
        }
      );

      // 8. Handle successful response
      console.log('Item posted successfully:', response.data);
      setSuccess('Item posted successfully! Redirecting to marketplace...');

      // Clear the form fields after successful submission
      setTitle('');
      setDescription('');
      setPrice('');
      setWhatsappNumber('');
      setLocation('');
      setImage(null); // Clear the file input
      // You might need to manually clear the file input element if it doesn't reset automatically
      document.getElementById('image').value = '';


      // Redirect to the marketplace listings page after a short delay
      setTimeout(() => {
        navigate('/marketplace'); // Assuming this is your marketplace listing route
      }, 2000);

    } catch (err) {
      // 9. Handle errors
      console.error('Error posting item:', err);

      if (err.response) {
        console.error('Error response data:', err.response.data);
        let errorMessage = "Failed to post item. Please check your details.";

        // Display specific error messages from Django
        if (err.response.data.title) {
          errorMessage += ` Title: ${err.response.data.title.join(', ')}.`;
        }
        if (err.response.data.description) {
          errorMessage += ` Description: ${err.response.data.description.join(', ')}.`;
        }
        if (err.response.data.price) {
          errorMessage += ` Price: ${err.response.data.price.join(', ')}.`;
        }
        if (err.response.data.whatsapp_number) {
          errorMessage += ` WhatsApp: ${err.response.data.whatsapp_number.join(', ')}.`;
        }
        if (err.response.data.location) {
          errorMessage += ` Location: ${err.response.data.location.join(', ')}.`;
        }
        if (err.response.data.image) {
          errorMessage += ` Image: ${err.response.data.image.join(', ')}.`;
        }
        if (err.response.data.detail) { // General DRF error like "Authentication credentials were not provided."
            errorMessage = `Error: ${err.response.data.detail}`;
        }

        setError(errorMessage);
      } else if (err.request) {
        setError('No response from server. Is the Django backend running?');
        console.error('No response from server:', err.request);
      } else {
        setError('An unexpected error occurred.');
        console.error('Error setting up request:', err.message);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1>Post New Item</h1>
      <p>Fill out the form below to post your product, service, or hostel for rent.</p>
      <p>(All fills are required)</p>

      {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          ></textarea>
        </div>

        <div>
          <label htmlFor="price">Price (e.g., 15000.00):</label>
          <input
            type="text" // Keep as text to allow decimal point and handle commas
            id="price"
            name="price"
            value={price}
            onChange={handlePriceChange} // Use the special price handler
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="e.g., 15000.00"
          />
        </div>

        <div>
          <label htmlFor="whatsappNumber">WhatsApp Number (e.g., +2348012345678):</label>
          <input
            type="text"
            id="whatsappNumber"
            name="whatsapp_number"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="e.g., +2348012345678"
          />
        </div>

        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="e.g., Main Campus Area"
            required
          />
        </div>

        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file" // Input type for file uploads
            id="image"
            name="image"
            accept="image/*" // Suggests image files
            onChange={handleImageChange} // Handle file selection
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Post Item
        </button>
      </form>
    </div>
  );
}

export default SellerPage;