import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CatFact.css'; // Ensure this imports common.css at the top

const CatFact = () => {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Effect to load facts from localStorage on component mount
  useEffect(() => {
    try {
      const storedFacts = localStorage.getItem('catFacts');
      if (storedFacts) {
        setFacts(JSON.parse(storedFacts));
      }
    } catch (e) {
      console.error("Failed to parse catFacts from localStorage", e);
      // Clear potentially corrupt data if parsing fails
      localStorage.removeItem('catFacts');
    }
  }, []); // Empty dependency array means this runs once on mount

  // Effect to save facts to localStorage whenever the facts state changes
  useEffect(() => {
    localStorage.setItem('catFacts', JSON.stringify(facts));
  }, [facts]); // Runs whenever 'facts' state changes

  const fetchCatFact = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://catfact.ninja/fact');
      // Add new fact to the existing list with a unique ID
      setFacts(prevFacts => [...prevFacts, { id: Date.now(), text: response.data.fact }]);
    } catch (err) {
      setError('Failed to fetch cat fact. Please try again.');
      console.error('Error fetching cat fact:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a specific fact by its ID
  const deleteFact = (idToDelete) => {
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
              <li key={factItem.id} className="fact-item"> {/* Use unique id for key */}
                <p className="fact-text">{factItem.text}</p>
                <button
                  onClick={() => deleteFact(factItem.id)}
                  className="delete-button"
                  title="Delete Fact"
                >
                  &times; {/* HTML entity for multiplication sign, often used for close/delete */}
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