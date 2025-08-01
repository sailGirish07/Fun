import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useDeferredValue,
  useOptimistic,
  startTransition,
} from 'react';
import axios from 'axios';
import '../styles/DadJokes.css';

const DadJokes = () => {
  const [jokes, setJokes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [optimisticJokes, addOptimisticJoke] = useOptimistic(
    jokes,
    (prev, newJoke) => [...prev, newJoke]
  );

  const deferredJokes = useDeferredValue(optimisticJokes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dadJokes');
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const formatted = parsed.map(j =>
          typeof j === 'string' ? { id: Date.now() + Math.random(), text: j } : j
        );
        setJokes(formatted);
      }
    } catch (e) {
      console.error('Failed to parse dadJokes from localStorage', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dadJokes', JSON.stringify(jokes));
  }, [jokes]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [jokes]);

  const fetchDadJoke = async () => {
    setLoading(true);
    setError('');

    const placeholder = {
      id: Date.now(),
      text: 'Fetching a dad joke… brace yourself! 😆',
    };

    startTransition(() => {
      addOptimisticJoke(placeholder);
    });

    try {
      const response = await axios.get('https://icanhazdadjoke.com/', {
        headers: { Accept: 'application/json' },
      });

      setJokes(prev =>
        prev.map(joke =>
          joke.id === placeholder.id
            ? { id: Date.now(), text: response.data.joke }
            : joke
        )
      );
    } catch (err) {
      setError('Failed to fetch dad joke. Please try again.');
      console.error('Error fetching dad joke:', err);
      setJokes(prev => prev.filter(joke => joke.id !== placeholder.id));
    } finally {
      setLoading(false);
    }
  };

  const deleteJoke = (idToDelete) => {
    setJokes(prev => prev.filter(joke => joke.id !== idToDelete));
    setSelectedId(null);
  };

  const handleItemClick = (id) => {
    setSelectedId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="component-container dad-jokes-container">
      <h1 className="component-heading">Random Dad Joke</h1>

      <div
        ref={containerRef}
        className="data-display-area dad-jokes-data-area scrollable-list"
      >
        {loading && <p>Loading joke...</p>}
        {error && <p className="error-message">{error}</p>}

        {deferredJokes.length > 0 ? (
          <ul className="joke-list">
            {deferredJokes.map((jokeItem, index) => (
              <li
                key={jokeItem.id || index}
                className={`joke-item ${selectedId === jokeItem.id ? 'selected' : ''}`}
                onClick={() => handleItemClick(jokeItem.id)}
              >
                <span className="joke-text">{jokeItem.text || jokeItem}</span>
                {selectedId === jokeItem.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteJoke(jokeItem.id);
                    }}
                    className="delete-button"
                    title="Delete Joke"
                  >
                    <i className="fas fa-trash"></i>
                    {/* &times; */}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>No jokes found.</p>
        )}
      </div>

      <button onClick={fetchDadJoke} className="fetch-button">
        {loading ? 'Fetching...' : 'Get New Dad Joke'}
      </button>
    </div>
  );
};

export default DadJokes;
