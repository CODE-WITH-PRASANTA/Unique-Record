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
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      setMessage(response.data.message);
      setEmail(""); // clear input on success
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message); // show server error message
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.get(`${API_URL}/achievements/get-published-achievements`)
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
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    return words.slice(0, wordLimit).join(' ') + (words.length > wordLimit ? '...' : '');
  };

  // Unified filtered achievements based on category & search term
  const getFilteredAchievements = () => {
    let filtered = achievements;

    if (selectedCategory) {
      filtered = filtered.filter(achievement => achievement.category === selectedCategory.name);
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(achievement =>
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <div className="our-achievements-record-container">
      <div className="our-achievements-record-main">
        {/* Posts Section */}
        <div className="our-achievements-record-posts">
          {getFilteredAchievements().map((achievement, index) => (
            <div key={index} className="our-achievements-record-post">
              <img src={achievement.image} alt={achievement.title} />
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
                <p>{truncateDescription(achievement.shortDescription, selectedCategory ? 20 : 90)}</p>
                <Link to={`/achivment-details/${achievement._id}`} className="our-achievements-record-read-post">
                  READ POST <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Section */}
        <div className="our-achievements-record-sidebar">

          {/* Search Box */}
          <div className="our-achievements-record-search-box our-achievements-record-sidebar-section">
            <input 
              type="text" 
              placeholder="Search" 
              value={searchTerm} 
              onChange={handleSearch} 
            />
            <button>
              <FontAwesomeIcon icon={faSearch} className="our-achievements-record-search-icon" />
            </button>
          </div>

          {/* Categories */}
          <div className="our-achievements-record-categories our-achievements-record-sidebar-section">
            <h2>Categories</h2>
            {categories.slice(0, visibleCategories).map((category, index) => (
              <div 
                key={index} 
                className={`our-achievements-record-category-item ${selectedCategory?.name === category.name ? 'active' : ''}`} 
                onClick={() => handleCategoryClick(category)}
              >
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

        {/* Latest Articles */}
          <div className="our-achievements-record-latest-articles our-achievements-record-sidebar-section">
            <h2>Latest Articles</h2>
            {latestPosts.map((post, index) => (
              <div key={index} className="our-achievements-record-article">
                {index === 0 ? (
                  <div>
                    <img src={post.image} alt={post.title} />
                    <h3>{post.title}</h3>
                  </div>
                ) : (
                  <div>
                    <h3>{post.title}</h3>
                  </div>
                )}
                {/* Make READ NOW a clickable Link */}
                <Link to={`/achivment-details/${post._id}`} className="our-achievements-record-read-now">
                  READ NOW <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            ))}
          </div>

        <div className="our-achievements-record-subscribe our-achievements-record-sidebar-section">
            <h2>Subscribe To Our News</h2>
            <p>Find out about the last days and the latest promotions of our Corporation</p>
            <form className="our-achievements-record-subscribe-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
            {message && <p className="subscribe-message">{message}</p>}
          </div>

          {/* Tags */}
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
