import React, { useState } from 'react';
import './FreeQuotes.css';
import axios from 'axios';
import { API_URL } from '../../Api';

// Assets 
import rightShape from '../../assets/contact-shape-3.png';
import leftImage from '../../assets/contact-img-1.jpg';

const FreeQuotes = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    designation: '',
    address: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return; // 🔒 prevent double submit

  setLoading(true);
  setSuccess('');
  setError('');

  try {
    const res = await axios.post(`${API_URL}/freequotes/create`, formData);
    setSuccess('Message sent successfully ✅');
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      designation: '',
      address: '',
      message: '',
    });
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong ❌');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="free-quotes-container">
      {/* Left Section */}
      <div className="free-quotes-left">
        <img 
          src={leftImage} 
          alt="Team collaboration" 
          className="free-quotes-image"
        />
      </div>

      {/* Right Section */}
      <div className="free-quotes-right" style={{ backgroundImage: `url(${rightShape})` }}>
        <div className="free-quotes-content">
          <p className="free-quotes-title">🟡Contact Us🟡</p>
          <h2 className="free-quotes-heading">Give Your Opinion or Suggestion.</h2>

          {/* Success/Error Message */}
          {success && <p className="success-msg">{success}</p>}
          {error && <p className="error-msg">{error}</p>}

          <form className="free-quotes-form" onSubmit={handleSubmit}>
            <div className="free-quotes-row">
              <input 
                type="text" 
                name="name"
                placeholder="Your name" 
                className="free-quotes-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email address" 
                className="free-quotes-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="free-quotes-row">
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone" 
                className="free-quotes-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="free-quotes-row">
              <input 
                type="number" 
                name="age"
                placeholder="Age" 
                className="free-quotes-input"
                value={formData.age}
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="designation"
                placeholder="Designation" 
                className="free-quotes-input"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
            <div className="free-quotes-row">
              <input 
                type="text" 
                name="address"
                placeholder="Address" 
                className="free-quotes-input"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <textarea 
              name="message"
              placeholder="Write a message" 
              className="free-quotes-textarea"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="free-quotes-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send a Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreeQuotes;
