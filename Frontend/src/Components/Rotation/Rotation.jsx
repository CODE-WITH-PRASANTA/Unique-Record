import React from 'react';
import './Rotation.css'; // Import the CSS for animations

// Assets for the rotation
import rotate1image from '../../assets/rotate-01.jpg';
import rotate2image from '../../assets/rotate-02.jpg';
import rotate3image from '../../assets/rotate-03.jpg';
import rotate4image from '../../assets/rotate-04.jpg';
import rotate5image from '../../assets/rotate-03.jpg';
import rotate6image from '../../assets/rotate-06.jpg';
import rotate7image from '../../assets/rotate-01.jpg';
import rotate8image from '../../assets/rotate-02.jpg';
import rotate9image from '../../assets/rotate-03.jpg';

const Rotation = ({ speed = 12 }) => {
  const images = [
    rotate1image,
    rotate2image,
    rotate3image,
    rotate4image,
    rotate5image,
    rotate6image,
    rotate7image,
    rotate8image,
    rotate9image,
  ];

  // Duplicate the images to make the infinite loop effect seamless
  const duplicatedImages = [...images, ...images];

  return (
    <div className="rotation-section">
      <h2 className="rotation-heading">Our Events & Photo Gallery</h2>
      <div className="rotation-container">
        <div className="rotation-wrapper" style={{ animationDuration: `${speed}s` }}>
          {duplicatedImages.map((image, index) => (
            <div className="rotation-item" key={index}>
              <img src={image} alt={`rotate-${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rotation;
