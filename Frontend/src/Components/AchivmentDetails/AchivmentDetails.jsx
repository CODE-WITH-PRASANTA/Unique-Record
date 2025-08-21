import React, { useState, useEffect } from 'react';
import './AchivmentDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faQuoteLeft, faPrint, faEnvelope, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaArrowRight, 
  FaPaperPlane, 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaWhatsapp 
} from 'react-icons/fa';

library.add(fab);

const AchivmentDetails = () => {
  const { id } = useParams();
  
  const [achivmentDetails, setAchivmentDetails] = useState({});
  const [latestAchievements, setLatestAchievements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await axios.get(`${API_URL}/achievements/get-achievement/${id}`);
        setAchivmentDetails(response.data);
        localStorage.setItem('AchivmentDetails', JSON.stringify(response.data));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLatestAchievements = async () => {
      try {
        const response = await axios.get(`${API_URL}/achievements/get-all-achievements`);
        setLatestAchievements(response.data);
        const achievementCategories = [...new Set(response.data.map((achievement) => achievement.category))];
        setCategories(achievementCategories);
        const achievementTags = [...new Set(response.data.flatMap((achievement) => achievement.tags.split(',')))];
        setTags(achievementTags);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAchievement();
    fetchLatestAchievements();
  }, [id]);

  function truncateDescription(description) {
    const words = description.split(' ');
    if (words.length > 50) { 
      return words.slice(0, 50).join(' ') + '...';
    }
    return description;
  }

  const handleViewAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search term:', searchTerm);
  };

  return (
    <div className="Achivments-details-container">
      <div className="Achivments-details-main-content">
        <div className="Achivments-details-content-area">
          <div className="Achivments-details-image-section-one">
            <img src={achivmentDetails.image} alt={achivmentDetails.title} />
            <div className="Achivments-details-footer">
              <div className="date-container">
                <FaCalendarAlt className="achivement-details-icon" /> 
                <span>{new Date(achivmentDetails.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="author-container">
                <FaUser className="achivement-details-icon" /> 
                <strong>Achiever Name: {achivmentDetails.achieverName}</strong>
              </div>
              <div className="location-container">
                <strong>Category: {achivmentDetails.category}</strong>
              </div>
              <div className="email-container">
                <span className="achievement-provider">Provider: {achivmentDetails.providerName}</span>
              </div>
            </div>
          </div>

{/* 🔽 Record Holder More Details Section 🔽 */}
{achivmentDetails.uruHolderLink && (
  <div className="record-holder-link">
    <a 
      href={achivmentDetails.uruHolderLink} 
      target="_blank" 
      rel="noopener noreferrer"
      className="arrow-button"
    >
      URU Holder More Details
    </a>
  </div>
)}

<h1 className="Achivments-details-title">{achivmentDetails.title}</h1>

<div 
  className="Achivments-details-paragraph" 
  dangerouslySetInnerHTML={{ __html: achivmentDetails.content }}
></div>

{/* 🔽 Record Holder More Details Section 🔽 */}
{achivmentDetails.uruHolderLink && (
  <div className="record-holder-link">
    <a 
      href={achivmentDetails.uruHolderLink} 
      target="_blank" 
      rel="noopener noreferrer"
      className="arrow-button"
    >
      URU Holder More Details
    </a>
  </div>
)}


          <div className="Achivments-details-community">
            <div className="Achivments-details-tags-row">
              <div className="tags">
                <strong>Tags:</strong> 
                {achivmentDetails.tags?.split(',').map((tag) => (
                  <span key={tag} className="Achivments-details-tag">{tag}</span>
                ))}
              </div>
              <div className="social-share">
                <strong>Share:</strong>
                <button className="social-Achivments-icon" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                </button>
                <button className="social-Achivments-icon" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'twitter']} />
                </button>
                <button className="social-Achivments-icon" onClick={() => window.open(`https://www.linkedin.com/sharing/share?url=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'linkedin-in']} />
                </button>
                <button className="social-Achivments-icon" onClick={() => window.open(`https://wa.me/?text=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'whatsapp']} />
                </button>
                <button className="social-Achivments-icon" onClick={() => window.open(`https://telegram.me/share/url?url=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'telegram-plane']} />
                </button>
                <button className="social-Achivments-icon" onClick={() => window.print()}>
                  <FontAwesomeIcon icon={faPrint} />
                </button>
                <button className="social-Achivments-icon" onClick={() => window.location.href = `mailto:?subject=${achivmentDetails.title}&body=${window.location.href}`}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </button>
              </div>
            </div>
          </div>

          <div className="comments-reply-form">
            <h2>Please Share Your Feedback or Suggestions.?</h2>
            <form>
              <div className="Achivments-form-row">
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="Achivments-form-row">
                <input type="tel" placeholder="Phone" />
                <input type="text" placeholder="Subject" />
                <input type="text" placeholder="Address" />
              </div>
              <textarea placeholder="Message"></textarea>
              <button type="submit">Submit Now →</button>
            </form>
          </div>
        </div>

        <aside className="Achivments-details-sidebar">
          <div className="Achivments-details-search-bar">
            <form onSubmit={handleSearchSubmit}>
              <input type="search" value={searchTerm} onChange={handleSearch} placeholder="Search" />
              <button type="submit"><FontAwesomeIcon icon={faSearch} /></button>
            </form>
          </div>

          <div className="Achivments-details-categories">
            <h2>Categories</h2>
            <div className="Achivments-details-category-tags">
              {categories
                .slice(0, showAllCategories ? categories.length : 5)
                .map((category, index) => (
                  <span key={index} className="Achivments-details-category-tag">
                    {category}
                  </span>
                ))}
            </div>
            {categories.length > 5 && (
              <button
                className="view-all-categories-btn"
                onClick={handleViewAllCategories}
              >
                {showAllCategories ? "View Less" : "View All Categories"}
              </button>
            )}
          </div>

          <div className="Achivments-details-recent-posts-sidebar">
            <h2>Latest Achievements</h2>
            {latestAchievements.slice(0, 3).map((post, index) => (
              <div key={index} className="Achivments-details-recent-post">
                <img src={post.image} alt="Post" />
                <div className="Achivments-details-recent-post-content">
                  <h3>{post.title}</h3>
                  <a href={`/achievement/${post._id}`} className="Achivments-details-read-more">Read More</a>
                </div>
              </div>
            ))}
          </div>
          <div className="Achivments-details-tags-sidebar">
            <h2>Tags</h2>
            <div className="Achivments-details-tags">
              {tags.map((tag, index) => (
                <span key={index} className="Achivments-details-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      
    </div>
  );
};

export default AchivmentDetails;