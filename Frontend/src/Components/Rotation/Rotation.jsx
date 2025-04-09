import React, { useEffect, useState } from 'react';
import './Rotation.css';
import axios from 'axios';
import { API_URL } from '../../Api.js';

const Rotation = ({ speed = 12 }) => {
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/home-media/all`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const duplicatedImages = [...images, ...images];

  const openModal = (img) => setModalImage(img);
  const closeModal = () => setModalImage(null);

  return (
    <div className="rotation-section">
      <h2 className="rotation-heading">Our Events & Photo Gallery</h2>

      <div className="rotation-container">
        <div className="rotation-wrapper" style={{ animationDuration: `${speed}s` }}>
          {duplicatedImages.map((image, index) => (
            <div
              className="rotation-item"
              key={index}
              onClick={() => openModal(image.url)}
            >
              <img src={image.url} alt={image.name || `rotate-${index}`} />
            </div>
          ))}
        </div>
      </div>

      {modalImage && (
        <div className="image-modal" onClick={closeModal}>
          <span className="close-icon" onClick={closeModal}>✖</span>
          <img src={modalImage} alt="enlarged" className="modal-content" />
        </div>
      )}
    </div>
  );
};

export default Rotation;
