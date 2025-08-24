// src/pages/GST201_Leaderboard.jsx test

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GST201_Leaderboard = () => {
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
                const authToken = localStorage.getItem('authToken');

                // ✨ THIS IS THE FIXED URL LINE ✨
                // We use a template literal `${}` to build the URL correctly.
                const apiUrl = `${import.meta.env.VITE_API_URL}/api/quiz/leaderboard/GST201/`;
                
                const response = await axios.get(
                    apiUrl,
                    {
                        headers: {
                            Authorization: `Token ${authToken}`
                        }
                    }
                );
                
                // 1. Get the data from the API response.
                const apiData = response.data;

                // 2. Check if the data is a list. Your backend is set up to send a list.
                if (Array.isArray(apiData)) {
                    // Sort the list by 'highest_score' from high to low
                    apiData.sort((a, b) => b.highest_score - a.highest_score);
                    
                    // Slice the list to only get the top 50 scores
                    const top50Scores = apiData.slice(0, 50); 
                    
                    // Set the state with the new, clean list
                    setLeaderboard(top50Scores);
                } else {
                    // This error will show if your backend is not sending a list.
                    console.error("Data received from the API is not a valid list:", apiData);
                    setLeaderboard([]); // Set an empty list to prevent errors
                }

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Failed to load leaderboard. Please try again later.");
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []); // The empty array [] means this effect runs only once after the first render

    // What our component shows on the screen
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>GST201 Leaderboard</h2>

            {/* Show loading message if data is still being fetched */}
            {loading && <p style={{ textAlign: 'center', color: '#555' }}>Loading leaderboard...</p>}

            {/* Show error message if something went wrong */}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            {/* Show message if no scores are found (after loading and no error) */}
            {!loading && !error && leaderboard.length === 0 && (
                <p style={{ textAlign: 'center', color: '#777' }}>No scores yet for GST201. Be the first to play!</p>
            )}

            {/* Display the leaderboard if data is loaded and no errors */}
            {!loading && !error && leaderboard.length > 0 && (
                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
                    {leaderboard.map((entry, index) => (
                        // ✨ THIS IS THE FIX FOR THE KEY WARNING ✨
                        // We use the 'entry.id' and `index` together to create a unique key
                        <li key={entry.id || index} style={{
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: index % 2 === 0 ? '#eef' : '#fff',
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

export default GST201_Leaderboard;