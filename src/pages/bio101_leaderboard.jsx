// src/pages/BIO101_Leaderboard.jsx

import React, { useState, useEffect } from 'react'; // ✨ MODIFIED: Added useState and useEffect
import axios from 'axios'; // ✨ NEW: For making API calls easily

const BIO101_Leaderboard = () => {
    // 1. State to hold our leaderboard data
    const [leaderboard, setLeaderboard] = useState([]);
    // 2. State to tell us if data is still loading
    const [loading, setLoading] = useState(true);
    // 3. State to hold any error messages
    const [error, setError] = useState(null);

    // This code runs when the component first shows up on the screen
    useEffect(() => {
        // Function to fetch the leaderboard data
        const fetchLeaderboard = async () => {
            try {
                // Get the authentication token from where you store it (e.g., localStorage)
                const authToken = localStorage.getItem('authToken'); // Adjust this if your token is stored elsewhere

                // Make the API call to your Django backend
                // Remember: your main project urls.py has path('api/quiz/', include('quiz.urls'))
                // and quiz/urls.py has path('leaderboard/<str:course_code>/', LeaderboardView.as_view())
                const response = await axios.get(
                    `http://localhost:8000/api/quiz/leaderboard/BIO101/`, // Hardcoded BIO101 for now
                    {
                        headers: {
                            Authorization: `Token ${authToken}` // Send the token for authentication
                        }
                    }
                );
                
                // Only take the top 50 scores, as per your requirement
                const top50Scores = response.data.slice(0, 50); 
                setLeaderboard(top50Scores); // Save the data to our state
                setLoading(false); // Data has loaded, so set loading to false
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Failed to load leaderboard. Please try again later."); // Set an error message
                setLoading(false); // Stop loading even if there's an error
            }
        };

        fetchLeaderboard(); // Call the function to fetch data when the component loads
    }, []); // The empty array [] means this effect runs only once after the first render

    // What our component shows on the screen
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>BIO101 Leaderboard</h2>

            {/* Show loading message if data is still being fetched */}
            {loading && <p style={{ textAlign: 'center', color: '#555' }}>Loading leaderboard...</p>}

            {/* Show error message if something went wrong */}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            {/* Show message if no scores are found (after loading and no error) */}
            {!loading && !error && leaderboard.length === 0 && (
                <p style={{ textAlign: 'center', color: '#777' }}>No scores yet for BIO101. Be the first to play!</p>
            )}

            {/* Display the leaderboard if data is loaded and no errors */}
            {!loading && !error && leaderboard.length > 0 && (
                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
                    {leaderboard.map((entry, index) => (
                        <li key={entry.id} style={{ 
                            marginBottom: '10px', 
                            padding: '10px', 
                            backgroundColor: index % 2 === 0 ? '#eef' : '#fff', // Alternating row colors
                            borderRadius: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: '4px solid #007bff'
                        }}>
                            <span style={{ fontWeight: 'bold', color: '#0056b3' }}>{entry.user}</span>
                            <span style={{ fontSize: '1.1em', color: '#28a745' }}>{entry.highest_score} points</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

export default BIO101_Leaderboard;