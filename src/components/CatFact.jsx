import React, {
  useState,
  useEffect,
  useMemo,
  useLayoutEffect,
  useRef,
} from 'react';
import axios from 'axios';
import '../styles/CatFact.css';

const CatFact = () => {
  const [facts, setFacts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
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
      console.error('Failed to parse catFacts from localStorage', e);
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
      const newFact = {
        id: Date.now(),
        text: response.data.fact,
      };
      setFacts((prev) => [...prev, newFact]);
    } catch (err) {
      setError('Failed to fetch cat fact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteFact = (idToDelete) => {
    setFacts((prev) => prev.filter((fact) => fact.id !== idToDelete));
    setSelectedId(null);
  };

  const { regularFacts, longFacts } = useMemo(() => {
    const regular = [], long = [];
    for (const fact of facts) {
      if (fact.text.length > 100) long.push(fact);
      else regular.push(fact);
    }
    return { regularFacts: regular, longFacts: long };
  }, [facts]);

  const handleItemClick = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="component-container cat-fact-container">
      <h1 className="component-heading">Random Cat Fact</h1>

      <div
        ref={containerRef}
        className="data-display-area cat-fact-data-area scrollable-list"
      >
        {loading && <p>Loading fact...</p>}
        {error && <p className="error-message">{error}</p>}

        {facts.length > 0 ? (
          <>
            {[regularFacts, longFacts].map((group, groupIndex) => (
              group.length > 0 && (
                <div
                  key={groupIndex}
                  className={groupIndex === 1 ? 'long-facts-section' : ''}
                >
                  {groupIndex === 1 && (
                    <h3 className="fact-section-heading">
                      Long Cat Facts (100+ chars)
                    </h3>
                  )}
                  <ul className="fact-list">
                    {group.map((fact) => (
                      <li
                        key={fact.id}
                        className={`fact-item ${selectedId === fact.id ? 'selected' : ''}`}
                        onClick={() => handleItemClick(fact.id)}
                      >
                        <p className="fact-text">{fact.text}</p>
                        {selectedId === fact.id && (
                          <button
                            className="delete-button"
                            title="Delete Fact"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent click bubbling
                              deleteFact(fact.id);
                            }}
                          >
                            <i className="fas fa-trash"></i>
                            {/* &times; */}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
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
