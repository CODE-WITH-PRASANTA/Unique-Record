import React, { useState, useEffect } from 'react';
import './OurAchivmentsRecords.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../../Api';

const OurAchievementsRecords = () => {
  const [achievements, setAchievements] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(6);
  const [showMoreCategories, setShowMoreCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/achievements/get-all-achievements`)
      .then(response => {
        setAchievements(response.data);
        setLatestPosts(response.data.slice(0, 3));
        const allTags = response.data.map(achievement => achievement.tags.split(','));
        const uniqueTags = [...new Set(allTags.flat())];
        setTags(uniqueTags.slice(0, 8));
      })
      .catch(error => {
        console.error(error);
      });

    axios.get(`${API_URL}/categories`)
      .then(response => {
        setCategories(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleShowMoreCategories = () => {
    setVisibleCategories(categories.length);
    setShowMoreCategories(false);
  };

  const handleShowLessCategories = () => {
    setVisibleCategories(6);
    setShowMoreCategories(true);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const filtered = achievements.filter(achievement => achievement.category === category.name);
    setFilteredAchievements(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    return words.slice(0, wordLimit).join(' ') + (words.length > wordLimit ? '...' : '');
  };

  return (
    <div className="our-achievements-record-container">
      <div className="our-achievements-record-main">
        <div className="our-achievements-record-posts">
          {selectedCategory ? 
            filteredAchievements.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase())).map((achievement, index) => (
              <div key={index} className="our-achievements-record-post">
                <img src={achievement.image} alt="Post 1" />
                <div className="our-achievements-record-post-details">
                  <div className="our-achievements-record-post-category">
                    <strong>🏆 {achievement.category}</strong>
                    <span className="our-achievements-record-dot"></span>
                    <span>📅 {moment(achievement.createdAt).format('MMMM DD, YYYY')}</span>

                    <div className="our-achievements-record-post-category achiever-info">
                      <span className="our-achievements-record-dot"></span>
                      <strong>👤 Achiever Name: {achievement.achieverName}</strong>
                    </div>

                    <span className="achievement-provider">🏢 Provider: {achievement.providerName}</span>
                  </div>

                  <h2>{achievement.title}</h2>
                  <p>{truncateDescription(achievement.shortDescription, 20)}</p>
                  <Link to={`/achivment-details/${achievement._id}`} className="our-achievements-record-read-post">READ POST <FontAwesomeIcon icon={faArrowRight} /></Link>
                </div>
              </div>
            )) 
            : 
            achievements.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase())).map((achievement, index) => (
              <div key={index} className="our-achievements-record-post">
                <img src={achievement.image} alt="Post 1" />
                <div className="our-achievements-record-post-details">
                  <div className="our-achievements-record-post-category">
                    <strong>🏆 {achievement.category}</strong>
                    <span className="our-achievements-record-dot"></span>
                    <span>📅 {moment(achievement.createdAt).format('MMMM DD, YYYY')}</span>

                    <div className="our-achievements-record-post-category achiever-info">
                      <span className="our-achievements-record-dot"></span>
                      <strong>👤 Achiever Name: {achievement.achieverName}</strong>
                    </div>

                    <span className="achievement-provider">🏢 Provider: {achievement.providerName}</span>
                  </div>

                  <h2>{achievement.title}</h2>
                  <p>{truncateDescription(achievement.shortDescription, 90)}</p>
                  <Link to={`/achivment-details/${achievement._id}`} className="our-achievements-record-read-post">READ POST <FontAwesomeIcon icon={faArrowRight} /></Link>
                </div>
              </div>
            ))
          }
        </div>

        <div className="our-achievements-record-sidebar">
          <div className="our-achievements-record-search-box our-achievements-record-sidebar-section">
            <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
            <button>
              <FontAwesomeIcon icon={faSearch} className="our-achievements-record-search-icon" />
            </button>
          </div>

          <div className="our-achievements-record-categories our-achievements-record-sidebar-section">
            <h2>Categories</h2>
            {categories.slice(0, visibleCategories).map((category, index) => (
              <div key={index} className="our-achievements-record-category-item" onClick={() => handleCategoryClick(category)}>
                <FontAwesomeIcon icon={faArrowRight} /> {category.name}
              </div>
            ))}
            {showMoreCategories && categories.length > 6 && (
              <button className="our-achievements-record-read-more" onClick={handleShowMoreCategories}>Read More</button>
            )}
            {!showMoreCategories && categories.length > 6 && (
              <button className="our-achievements-record-read-less" onClick={handleShowLessCategories}>Read Less</button>
            )}
          </div>

          <div className="our-achievements-record-latest-articles our-achievements-record-sidebar-section">
            <h2>Latest Articles</h2>
            {latestPosts.map((post, index) => (
              <div key={index} className="our-achievements-record-article">
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
                <div className="our-achievements-record-read-now">READ NOW <FontAwesomeIcon icon={faArrowRight} /></div>
              </div>
            ))}
          </div>

          <div className="our-achievements-record-subscribe our-achievements-record-sidebar-section">
            <h2>Subscribe To Our News</h2>
            <p>Find out about the last days and the latest promotions of our Corporation</p>
            <div className="our-achievements-record-subscribe-form">
              <input type="email" placeholder="Email" />
              <button>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
            <div className="our-achievements-record-social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </div>

          <div className="our-achievements-record-tags our-achievements-record-sidebar-section">
            <h2>Tags</h2>
            <div className="our-achievements-record-tag-list">
              {tags.map((tag, index) => (
                <span key={index} className="our-achievements-record-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurAchievementsRecords;