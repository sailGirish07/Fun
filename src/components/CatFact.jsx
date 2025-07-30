import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CatFact.css'; // Assume this also includes common styles

const CatFact = () => {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Load all facts from global localStorage (not per-user)
  // This useEffect runs once on component mount to load existing facts.
  useEffect(() => {
  try {
    const storedFacts = localStorage.getItem('catFacts');
    const parsed = JSON.parse(storedFacts);
    if (Array.isArray(parsed) && parsed.length > 0) {
      setFacts(parsed);
    }
  } catch (e) {
    console.error("Failed to parse catFacts from localStorage", e);
  }
}, []);
 // Empty dependency array means it runs only once on mount

  // ✅ Save facts globally whenever changed
  // This useEffect runs whenever the 'facts' state changes, saving it to localStorage.
  useEffect(() => {
    localStorage.setItem('catFacts', JSON.stringify(facts));
  }, [facts]); // Dependency array includes 'facts', so it runs on every 'facts' update

  const fetchCatFact = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://catfact.ninja/fact');
      // Add new fact to the existing list, ensuring a unique ID
      setFacts(prevFacts => [...prevFacts, { id: Date.now(), text: response.data.fact }]);
    } catch (err) {
      setError('Failed to fetch cat fact. Please try again.');
      console.error('Error fetching cat fact:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFact = (idToDelete) => {
    // Filter out the fact to delete, creating a new array for immutability
    setFacts(prevFacts => prevFacts.filter(fact => fact.id !== idToDelete));
  };

  return (
    <div className="component-container cat-fact-container">
      <h1 className="component-heading">Random Cat Fact</h1>
      <div className="data-display-area cat-fact-data-area scrollable-list">
        {loading && <p>Loading fact...</p>}
        {error && <p className="error-message">{error}</p>}
        {facts.length > 0 ? (
          <ul className="fact-list">
            {facts.map((factItem) => (
              <li key={factItem.id} className="fact-item">
                <p className="fact-text">{factItem.text}</p>
                <button
                  onClick={() => deleteFact(factItem.id)}
                  className="delete-button"
                  title="Delete Fact"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>Click the button to fetch cat facts!</p>
        )}
      </div>
      <button onClick={fetchCatFact} className="fetch-button">
        {loading ? 'Fetching...' : 'Get New Cat Fact'}
      </button>
    </div>
  );
};

export default CatFact;
