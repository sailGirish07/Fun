
import React, { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/CatFact.css';

const CatFact = () => {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef();

  // Load from localStorage on mount
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

  // Save to localStorage on any update
  useEffect(() => {
    localStorage.setItem('catFacts', JSON.stringify(facts));
  }, [facts]);

  // Scroll to bottom when new fact is added
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [facts]);

  // Fetch new cat fact
  const fetchCatFact = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://catfact.ninja/fact');
      const newFact = {
        id: Date.now(), // using original ID method
        text: response.data.fact
      };
      setFacts(prevFacts => [...prevFacts, newFact]);
    } catch (err) {
      setError('Failed to fetch cat fact. Please try again.');
      console.error('Error fetching cat fact:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete fact by ID
  const deleteFact = (idToDelete) => {
    setFacts(prevFacts => prevFacts.filter(fact => fact.id !== idToDelete));
  };

  // Separate regular and long facts
  const { regularFacts, longFacts } = useMemo(() => {
    const regular = [];
    const long = [];
    for (const fact of facts) {
      if (fact.text.length > 100) {
        long.push(fact);
      } else {
        regular.push(fact);
      }
    }
    return { regularFacts: regular, longFacts: long };
  }, [facts]);

  return (
    <div className="component-container cat-fact-container">
      <h1 className="component-heading">Random Cat Fact</h1>

      <div ref={containerRef} className="data-display-area cat-fact-data-area scrollable-list">
        {loading && <p>Loading fact...</p>}
        {error && <p className="error-message">{error}</p>}
        {facts.length > 0 ? (
          <>
            {regularFacts.length > 0 && (
              <ul className="fact-list">
                {regularFacts.map((factItem) => (
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
            )}

            {longFacts.length > 0 && (
              <div className="long-facts-section">
                <h3>Long Cat Facts (100+ chars)</h3>
                <ul className="fact-list">
                  {longFacts.map((factItem) => (
                    <li key={factItem.id} className="fact-item long-fact">
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
              </div>
            )}
          </>
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
