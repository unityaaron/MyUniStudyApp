// src/pages/GST101_Leaderboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GST101_Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const authToken = localStorage.getItem('authToken');

                const response = await axios.get(
                    `import.meta.env.VITE_API_URL + '/api/quiz/leaderboard/GST101/`,
                    {
                        headers: {
                            Authorization: `Token ${authToken}`
                        }
                    }
                );
                
                // ✨ THIS IS THE NEW, SAFER CODE ✨
                // 1. Get the data from the API response
                const apiData = response.data;

                // 2. Check if the data is a list. If it is an object, get the values from it.
                // This handles the case where your backend might send an empty object `{}` or a list `[]`.
                let processedData = Array.isArray(apiData) ? apiData : Object.values(apiData);

                // 3. Make sure 'processedData' is a list before trying to use .map() on it
                if (Array.isArray(processedData)) {
                    // Sort the list by 'highest_score' from high to low
                    processedData.sort((a, b) => b.highest_score - a.highest_score);
                    
                    // Slice the list to only get the top 50 scores
                    const top50Scores = processedData.slice(0, 50); 
                    
                    // Set the state with the new, clean list
                    setLeaderboard(top50Scores);
                } else {
                    // If we get here, something is very wrong with the data format
                    console.error("Data received from the API is not a valid list or object:", apiData);
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
    }, []);

    // ... (rest of your component code remains the same) ...
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>GST101 Leaderboard</h2>

            {loading && <p style={{ textAlign: 'center', color: '#555' }}>Loading leaderboard...</p>}

            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            {!loading && !error && leaderboard.length === 0 && (
                <p style={{ textAlign: 'center', color: '#777' }}>No scores yet for GST101. Be the first to play!</p>
            )}

            {!loading && !error && leaderboard.length > 0 && (
                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
                    {leaderboard.map((entry, index) => (
                        <li key={entry.id} style={{
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

export default GST101_Leaderboard;