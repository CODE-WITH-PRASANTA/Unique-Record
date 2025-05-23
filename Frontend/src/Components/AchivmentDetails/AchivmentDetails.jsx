import React, { useState, useEffect } from 'react';
import './AchivmentDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Api';


import {
  FaCalendarAlt,
  FaUser,
  FaSearch,
  FaArrowRight,
  FaPaperPlane,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa';

const AchivmentDetails = () => {
  const { id } = useParams();
  
  const [achivmentDetails, setAchivmentDetails] = useState({});
  const [latestAchievements, setLatestAchievements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

 
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
  if (words.length > 50) { // adjust the number of words as needed
    return words.slice(0, 50).join(' ') + '...';
  }
  return description;
}

  return (
    <>
      <div className="achivement-details-container">
        <div className="achivement-details-main-content">
          <img src={achivmentDetails.image} alt="Main Banner" className="achivement-details-main-banner" />

          <div className="achivement-details-post-meta-bar">
            <span><FaCalendarAlt className="achivement-details-icon" /> {achivmentDetails.createdAt && new Date(achivmentDetails.createdAt).toLocaleDateString()}</span>
            <span><FaUser className="achivement-details-icon" /> By {achivmentDetails.achieverName}</span>
          </div>

          <p className="achivement-details-intro-paragraph">
            {achivmentDetails.shortDescription}
          </p>

         <section className="achivement-details-feature-section">
  <div className="achivement-details-feature-intro">
    <h2>{achivmentDetails.title}</h2>
    <div dangerouslySetInnerHTML={{ __html: achivmentDetails.content }} />
  </div>
</section>

          <div className="achivement-details-tags-social-container">
            <div className="achivement-details-tag-list">
              {achivmentDetails.tags?.split(',').map((tag) => (
                <span key={tag} className="achivement-details-tag">{tag}</span>
              ))}
            </div>
            <div className="achivement-details-social-icons">
              <a href="#"><i className="fab fa-facebook-f"> </i>< FaFacebookF /></a>
              <a href="#"><i className="fab fa-instagram"></i> < FaInstagram /></a>
              <a href="#"><i className="fab fa-twitter"></i> < FaTwitter /> </a>
              <a href="#"><i className="fab fa-whatsapp"></i> < FaWhatsapp /></a>
            </div>
          </div>
        </div>

        <div className="achivement-details-sidebar">
          <div className="achivement-details-sidebar-items">
            <div className="achivement-details-sidebar-section achivement-details-search-box">
              <input type="text" placeholder="Search" />
              <button>
                <FaSearch className="achivement-details-search-icon" />
              </button>
            </div>

          
          <div className="achivement-details-sidebar-section achivement-details-categories">
    <h2>Categories</h2>
    {categories.map((category) => (
      <div key={category} className="achivement-details-category-item">
        <FaArrowRight /> {category}
      </div>
    ))}
  </div>

<div className="achivement-details-sidebar-section achivement-details-latest-articles">
  <h2>Latest Articles</h2>
  {latestAchievements.slice(0, 3).map((post, index) => (
    <div key={index} className="Our-Achievement-Record-Article">
      {index === 0 ? (
        <div>
          <img src={post.image} alt="Article 1" />
          <h3>{post.title}</h3>
        </div>
      ) : (
        <div>
          <h3>{post.title}</h3>
        </div>
      )}
      <div className="Our-Achievement-Record-Read-Now">READ NOW <FaArrowRight /></div>
    </div>
  ))}
</div>
            <div className="achivement-details-sidebar-section achivement-details-subscribe">
              <h2>Subscribe To Our News</h2>
              <p>Find out about the last days and the latest promotions of our Corporation</p>
              <div className="achivement-details-subscribe-form">
                <input type="email" placeholder="Email" />
                <button>
                  <FaPaperPlane />
                </button>
              </div>
              <div className="achivement-details-social-icons achivement-details-dark-icons">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaWhatsapp /></a>
              </div>
            </div>

  <div className="achivement-details-sidebar-section achivement-details-tags">
    <h2>Tags</h2>
    <div className="achivement-details-tag-list">
      {tags.map((tag) => (
        <span key={tag} className="achivement-details-tag">{tag}</span>
      ))}
    </div>
  </div>
          </div>
        </div>
      </div>

      <section className="achivement-details-latest-posts">
        <h2>Latest Posts</h2>
        <div className="achivement-details-posts-row">
          {latestAchievements.map((latestAchievement) => (
            <div key={latestAchievement._id} className="achivement-details-post-card">
              <img src={latestAchievement.image} alt={latestAchievement.title} />
              <div className="achivement-details-meta">
                <span className="achivement-details-category">{latestAchievement.category}</span>
                <span className="achivement-details-dot">•</span>
                <span className="achivement-details-date">{new Date(latestAchievement.createdAt).toLocaleDateString()}</span>
              </div>
              <h3>{latestAchievement.title}</h3>
              <p>
               {truncateDescription(latestAchievement.shortDescription)}
              </p>
              <a href="#" className="achivement-details-read-post">READ POST →</a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AchivmentDetails;