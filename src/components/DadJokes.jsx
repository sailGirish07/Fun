
// import React, { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react';
// import axios from 'axios';
// import '../styles/DadJokes.css';

// const DadJokes = () => {
//   const [jokes, setJokes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const containerRef = useRef(); // ✅ added ref

//   useEffect(() => {
//     try {
//       const storedJokes = localStorage.getItem('dadJokes');
//       const parsed = JSON.parse(storedJokes);
//       if (Array.isArray(parsed) && parsed.length > 0) {
//         setJokes(parsed);
//       }
//     } catch (e) {
//       console.error("Failed to parse dadJokes from localStorage", e);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('dadJokes', JSON.stringify(jokes));
//   }, [jokes]);

//   // ✅ Scroll to bottom after joke is added
//   useLayoutEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollTop = containerRef.current.scrollHeight;
//     }
//   }, [jokes]);

//   const fetchDadJoke = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axios.get('https://icanhazdadjoke.com/', {
//         headers: { 'Accept': 'application/json' }
//       });
//       setJokes(prevJokes => [...prevJokes, response.data.joke]);
//     } catch (err) {
//       setError('Failed to fetch dad joke. Please try again.');
//       console.error('Error fetching dad joke:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalJokes = useMemo(() => jokes.length, [jokes]);

//   const minLengthJoke = useMemo(() => {
//     if (jokes.length === 0) return null;
//     return jokes.reduce((min, curr) =>
//       curr.length < min.length ? curr : min
//     );
//   }, [jokes]);

//   const maxLengthJoke = useMemo(() => {
//     if (jokes.length === 0) return null;
//     return jokes.reduce((max, curr) =>
//       curr.length > max.length ? curr : max
//     );
//   }, [jokes]);

//   return (
//     <div className="component-container dad-jokes-container">
//       <h1 className="component-heading">Random Dad Joke</h1>

//       {totalJokes > 0 && (
//         <>
//           <p className="joke-count">Total Jokes Fetched: {totalJokes}</p>
//           <p className="joke-count">Shortest Joke: {minLengthJoke}</p>
//           <p className="joke-count">Longest Joke: {maxLengthJoke}</p>
//         </>
//       )}

//       <div ref={containerRef} className="data-display-area dad-jokes-data-area scrollable-list">
//         {loading && <p>Loading joke...</p>}
//         {error && <p className="error-message">{error}</p>}

//         {jokes.length > 0 ? (
//           <ul className="joke-list">
//             {jokes.map((jokeItem, index) => (
//               <li key={index} className="joke-item">
//                 <p className="joke-text">{jokeItem}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           !loading && !error && <p>Click the button to fetch dad jokes!</p>
//         )}
//       </div>

//       <button onClick={fetchDadJoke} className="fetch-button">
//         {loading ? 'Fetching...' : 'Get New Dad Joke'}
//       </button>
//     </div>
//   );
// };

// export default DadJokes;

import React, { useState, useEffect, useMemo, useLayoutEffect, useRef, useDeferredValue } from 'react';
import axios from 'axios';
import '../styles/DadJokes.css';

const DadJokes = () => {
  const [jokes, setJokes] = useState([]);
  const deferredJokes = useDeferredValue(jokes); // 👈 defer the jokes only during fetch

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef();

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
    try {
      const response = await axios.get('https://icanhazdadjoke.com/', {
        headers: { 'Accept': 'application/json' }
      });
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

      <div ref={containerRef} className="data-display-area dad-jokes-data-area scrollable-list">
        {loading && <p>Loading joke...</p>}
        {error && <p className="error-message">{error}</p>}

        {deferredJokes.length > 0 ? (
          <ul className="joke-list">
            {deferredJokes.map((jokeItem, index) => (
              <li key={index} className="joke-item">
                <p className="joke-text">{jokeItem}</p>
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
