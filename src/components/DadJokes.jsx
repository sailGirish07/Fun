import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DadJokes.css'; // Ensure this imports common.css at the top

const DadJokes = () => {
  const [jokes, setJokes] = useState([]); // Changed to an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Effect to load jokes from localStorage on component mount
  useEffect(() => {
  try {
    const storedJokes = localStorage.getItem('dadJokes');
    const parsed = JSON.parse(storedJokes);
    if (Array.isArray(parsed) && parsed.length > 0) {
      setJokes(parsed);
    }
  } catch (e) {
    console.error("Failed to parse dadJokes from localStorage", e);
  }
}, []);


  // Effect to save jokes to localStorage whenever the jokes state changes
  useEffect(() => {
    localStorage.setItem('dadJokes', JSON.stringify(jokes));
  }, [jokes]);

  const fetchDadJoke = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://icanhazdadjoke.com/', {
        headers: {
          'Accept': 'application/json'
        }
      });
      // Add new joke to the existing list
      setJokes(prevJokes => [...prevJokes, response.data.joke]);
    } catch (err) {
      setError('Failed to fetch dad joke. Please try again.');
      console.error('Error fetching dad joke:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container dad-jokes-container">
      <h1 className="component-heading">Random Dad Joke</h1>
      <div className="data-display-area dad-jokes-data-area scrollable-list"> {/* Added scrollable-list class */}
        {loading && <p>Loading joke...</p>}
        {error && <p className="error-message">{error}</p>}
        {/* Map through jokes to display them */}
        {jokes.length > 0 ? (
          <ul className="joke-list">
            {jokes.map((jokeItem, index) => (
              <li key={index} className="joke-item">
                <p className="joke-text">{jokeItem}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>Click the button to fetch dad jokes!</p>
        )}
      </div>
      <button onClick={fetchDadJoke} className="fetch-button">
        {loading ? 'Fetching...' : 'Get New Dad Joke'}
      </button>
    </div>
  );
};

export default DadJokes;