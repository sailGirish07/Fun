// import React, { useState, useEffect } from 'react'; // Add useEffect for localStorage
// import axios from 'axios';
// import '../styles/DogPics.css';

// const DogPics = () => {
//   const [dogImages, setDogImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Effect to load dog images from localStorage on component mount
//  useEffect(() => {
//   try {
//     const storedDogImages = localStorage.getItem('dogImages');
//     const parsed = JSON.parse(storedDogImages);
//     if (Array.isArray(parsed) && parsed.length > 0) {
//       setDogImages(parsed);
//     }
//   } catch (e) {
//     console.error("Failed to parse dogImages from localStorage", e);
//   }
// }, []);


//   // Effect to save dog images to localStorage whenever the dogImages state changes
//   useEffect(() => {
//     localStorage.setItem('dogImages', JSON.stringify(dogImages));
//   }, [dogImages]);

//   const fetchDogPic = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axios.get('https://dog.ceo/api/breeds/image/random');
//       // Add new image to the existing list
//       setDogImages(prevImages => [...prevImages, response.data.message]);
//     } catch (err) {
//       setError('Failed to fetch dog pic. Please try again.');
//       console.error('Error fetching dog pic:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="component-container dog-pics-container">
//       <h1 className="component-heading">Random Dog Pics</h1>
//       <div className="data-display-area dog-pics-data-area scrollable-div">
//         {loading && <p>Loading image...</p>}
//         {error && <p className="error-message">{error}</p>}
//         <div className="image-grid">
//           {dogImages.map((imageUrl, index) => (
//             <div key={index} className="image-item">
//               <img src={imageUrl} alt={`Random Dog ${index}`} className="dog-image" />
//             </div>
//           ))}
//         </div>
//         {dogImages.length === 0 && !loading && !error && <p>Click the button to fetch dog pictures!</p>}
//       </div>
//       <button onClick={fetchDogPic} className="fetch-button">
//         {loading ? 'Fetching...' : 'Get New Dog Pic'}
//       </button>
//     </div>
//   );
// };


// export default DogPics;



// import React, { useState, useEffect, useMemo } from 'react'; // ✅ useMemo added
// import axios from 'axios';
// import '../styles/DogPics.css';

// const DogPics = () => {
//   const [dogImages, setDogImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ✅ Load dog images from localStorage on mount
//   useEffect(() => {
//     try {
//       const storedDogImages = localStorage.getItem('dogImages');
//       const parsed = JSON.parse(storedDogImages);
//       if (Array.isArray(parsed) && parsed.length > 0) {
//         setDogImages(parsed);
//       }
//     } catch (e) {
//       console.error("Failed to parse dogImages from localStorage", e);
//     }
//   }, []);

//   // ✅ Save dog images to localStorage on change
//   useEffect(() => {
//     localStorage.setItem('dogImages', JSON.stringify(dogImages));
//   }, [dogImages]);

//   const fetchDogPic = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axios.get('https://dog.ceo/api/breeds/image/random');
//       setDogImages(prevImages => [...prevImages, response.data.message]);
//     } catch (err) {
//       setError('Failed to fetch dog pic. Please try again.');
//       console.error('Error fetching dog pic:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ useMemo to filter only .jpg, .jpeg, .png images
//   const validDogImages = useMemo(() => {
//     return dogImages.filter(url =>
//       url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')
//     );
//   }, [dogImages]);

//   return (
//     <div className="component-container dog-pics-container">
//       <h1 className="component-heading">Random Dog Pics</h1>
//       <div className="data-display-area dog-pics-data-area scrollable-div">
//         {loading && <p>Loading image...</p>}
//         {error && <p className="error-message">{error}</p>}
        
//         <div className="image-grid">
//           {validDogImages.map((imageUrl, index) => (
//             <div key={index} className="image-item">
//               <img src={imageUrl} alt={`Random Dog ${index}`} className="dog-image" />
//             </div>
//           ))}
//         </div>

//         {validDogImages.length === 0 && !loading && !error && (
//           <p>Click the button to fetch dog pictures!</p>
//         )}
//       </div>

//       <button onClick={fetchDogPic} className="fetch-button">
//         {loading ? 'Fetching...' : 'Get New Dog Pic'}
//       </button>
//     </div>
//   );
// };

// export default DogPics;




import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import '../styles/DogPics.css';

const DogPics = () => {
  const [dogImages, setDogImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Load dog images from localStorage on mount
  useEffect(() => {
    try {
      const storedDogImages = localStorage.getItem('dogImages');
      const parsed = JSON.parse(storedDogImages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setDogImages(parsed);
      }
    } catch (e) {
      console.error("Failed to parse dogImages from localStorage", e);
    }
  }, []);

  // ✅ Save dog images to localStorage on change
  useEffect(() => {
    localStorage.setItem('dogImages', JSON.stringify(dogImages));
  }, [dogImages]);

  // ✅ useCallback for stable fetch function reference
  const fetchDogPic = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://dog.ceo/api/breeds/image/random');
      setDogImages(prevImages => [...prevImages, response.data.message]);
    } catch (err) {
      setError('Failed to fetch dog pic. Please try again.');
      console.error('Error fetching dog pic:', err);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ No external dependency needed for now

  // ✅ useMemo to filter only .jpg, .jpeg, .png images
  const validDogImages = useMemo(() => {
    return dogImages.filter(url =>
      url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')
    );
  }, [dogImages]);

  return (
    <div className="component-container dog-pics-container">
      <h1 className="component-heading">Random Dog Pics</h1>
      <div className="data-display-area dog-pics-data-area scrollable-div">
        {loading && <p>Loading image...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="image-grid">
          {validDogImages.map((imageUrl, index) => (
            <div key={index} className="image-item">
              <img src={imageUrl} alt={`Random Dog ${index}`} className="dog-image" />
            </div>
          ))}
        </div>

        {validDogImages.length === 0 && !loading && !error && (
          <p>Click the button to fetch dog pictures!</p>
        )}
      </div>

      <button onClick={fetchDogPic} className="fetch-button">
        {loading ? 'Fetching...' : 'Get New Dog Pic'}
      </button>
    </div>
  );
};

export default DogPics;
