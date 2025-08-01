import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import '../styles/DogPics.css';

const DogPics = () => {
  const [dogImages, setDogImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // ✅ New state

  // ✅ Load from localStorage
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

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem('dogImages', JSON.stringify(dogImages));
  }, [dogImages]);

  // ✅ Fetch random dog pic
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
  }, []);

  // ✅ Only .jpg/.jpeg/.png
  const validDogImages = useMemo(() => {
    return dogImages.filter(url =>
      url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')
    );
  }, [dogImages]);

  // ✅ Delete function by image URL
  const deleteImage = (urlToDelete) => {
    setDogImages(prev => prev.filter(url => url !== urlToDelete));
    setSelectedImage(null); // Deselect after deletion
  };

  return (
    <div className="component-container dog-pics-container">
      <h1 className="component-heading">Random Dog Pics</h1>

      <div className="data-display-area dog-pics-data-area scrollable-div">
        {loading && <p>Loading image...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="image-grid">
          {validDogImages.map((imageUrl, index) => (
            <div
              key={index}
              className={`image-item ${selectedImage === imageUrl ? 'selected' : ''}`}
              onClick={() =>
                setSelectedImage(prev => (prev === imageUrl ? null : imageUrl))
              }
            >
              <img
                src={imageUrl}
                alt={`Random Dog ${index}`}
                className="dog-image"
              />
              {selectedImage === imageUrl && (
                 <button
  className="delete-button"
  onClick={(e) => {
    e.stopPropagation();
    deleteImage(imageUrl);
  }}
  title="Delete Image"
>
  <i className="fas fa-trash"></i>
</button>
              )}
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
