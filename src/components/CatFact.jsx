
  import React, { useState, useEffect, useMemo, useLayoutEffect, useRef} from 'react';
  import axios from 'axios';
  import '../styles/CatFact.css';

  const CatFact = () => {
    const [facts, setFacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const containerRef = useRef();

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

    useEffect(() => {
      localStorage.setItem('catFacts', JSON.stringify(facts));
    }, [facts]);

    useLayoutEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, [facts]);

    const fetchCatFact = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://catfact.ninja/fact');
        setFacts(prevFacts => [...prevFacts, { id: Date.now(), text: response.data.fact }]);
      } catch (err) {
        setError('Failed to fetch cat fact. Please try again.');
        console.error('Error fetching cat fact:', err);
      } finally {
        setLoading(false);
      }
    };

    const deleteFact = (idToDelete) => {
      setFacts(prevFacts => prevFacts.filter(fact => fact.id !== idToDelete));
    };

    const longFacts = useMemo(() => {
      return facts.filter(f => f.text.length > 100);
    }, [facts]);

    return (
      <div className="component-container cat-fact-container">
        <h1 className="component-heading">Random Cat Fact</h1>

        <div ref={containerRef} className="data-display-area cat-fact-data-area scrollable-list">
          {loading && <p>Loading fact...</p>}
          {error && <p className="error-message">{error}</p>}
          {facts.length > 0 ? (
            <>
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

              {longFacts.length > 0 && (
                <div className="long-facts-section">
                  <h3>Long Cat Facts (100+ chars)</h3>
                  <ul className="fact-list">
                    {longFacts.map(fact => (
                      <li key={fact.id} className="fact-item">
                        <p className="fact-text">{fact.text}</p>
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
