import React, { useState, useEffect } from 'react';
import './OurAchivmentsRecords.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
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

  const [previewImage, setPreviewImage] = useState(null);
  const handleImageClick = (imageUrl) => setPreviewImage(imageUrl);
  const closePreview = () => setPreviewImage(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email.trim()) return setMessage("Please enter your email");

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      setMessage(error.response?.data.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.get(`${API_URL}/achievements/get-published-achievements`)
      .then(res => {
        setAchievements(res.data);
        setLatestPosts(res.data.slice(0, 3));
        const allTags = res.data.map(a => a.tags.split(','));
        setTags([...new Set(allTags.flat())].slice(0, 8));
      })
      .catch(console.error);

    axios.get(`${API_URL}/categories`)
      .then(res => setCategories(res.data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(console.error);
  }, []);

  const handleShowMoreCategories = () => { setVisibleCategories(categories.length); setShowMoreCategories(false); };
  const handleShowLessCategories = () => { setVisibleCategories(6); setShowMoreCategories(true); };
  const handleCategoryClick = (category) => setSelectedCategory(category);
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const truncateDescription = (desc, wordLimit) => {
    const words = desc.split(' ');
    return words.slice(0, wordLimit).join(' ') + (words.length > wordLimit ? '...' : '');
  };

  const getFilteredAchievements = () => {
    let filtered = achievements;
    if (selectedCategory) filtered = filtered.filter(a => a.category === selectedCategory.name);
    if (searchTerm.trim() !== '') filtered = filtered.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered;
  };

  return (
    <div className="our-achievements-record-container">
      <div className="our-achievements-record-main">

        {/* POSTS SECTION */}
        <div className="our-achievements-record-posts">
          {getFilteredAchievements().map((achievement, idx) => (
            <div key={idx} className="our-achievements-record-post">
              <img 
                src={achievement.image} 
                alt={achievement.title} 
                className="clickable-image"
                onClick={() => handleImageClick(achievement.image)} 
              />

              {previewImage && (
                <div className="image-preview-overlay show" onClick={closePreview}>
                  <div className="image-preview-content" onClick={e => e.stopPropagation()}>
                    <img src={previewImage} alt="Preview" />
                    <button className="close-preview" onClick={closePreview}>×</button>
                  </div>
                </div>
              )}

              <div className="our-achievements-record-post-details">
                {/* CATEGORY, DATE, ACHIEVER, PROVIDER */}
                <div className="our-achievements-record-post-category">
                  <strong>🏆 {achievement.category}</strong>
                  <span className="our-achievements-record-dot"></span>
                  <span>📅 {moment(achievement.createdAt).format('MMMM DD, YYYY')}</span>

                  <div className="our-achievements-record-post-category achiever-info">
                    <strong>👤 Achiever Name: {achievement.achieverName}</strong>
                  </div>
                  <span className="achievement-provider">🏢 Provider: {achievement.providerName}</span>
                </div>

                {/* TITLE & DESCRIPTION */}
                <h2>{achievement.title}</h2>
                <p>{truncateDescription(achievement.shortDescription, selectedCategory ? 20 : 90)}</p>

                {/* READ POST BUTTON */}
                <Link to={`/achivment-details/${achievement._id}`} className="our-achievements-record-read-post">
                  READ POST <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* SIDEBAR */}
        <div className="our-achievements-record-sidebar">

          {/* SEARCH BOX */}
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

          {/* CATEGORIES */}
          <div className="our-achievements-record-categories our-achievements-record-sidebar-section">
            <h2>Categories</h2>
            <div className="our-achievements-record-category-list">
              {categories.slice(0, visibleCategories).map((category, idx) => (
                <div
                  key={idx}
                  className={`our-achievements-record-category-item ${selectedCategory?.name === category.name ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <FontAwesomeIcon icon={faArrowRight} /> {category.name}
                </div>
              ))}
              {showMoreCategories && categories.length > 6 && (
                <div className="our-achievements-record-category-toggle" onClick={handleShowMoreCategories}>
                  Read More
                </div>
              )}
              {!showMoreCategories && categories.length > 6 && (
                <div className="our-achievements-record-category-toggle" onClick={handleShowLessCategories}>
                  Read Less
                </div>
              )}
            </div>
          </div>

          {/* LATEST ARTICLES */}
          <div className="our-achievements-record-latest-articles our-achievements-record-sidebar-section">
            <h2>Latest Articles</h2>
            {latestPosts.map((post, idx) => (
              <div key={idx} className="our-achievements-record-article">
                {idx === 0 && <img src={post.image} alt={post.title} />}
                <h3>{post.title}</h3>
                <Link to={`/achivment-details/${post._id}`} className="our-achievements-record-read-now">
                  READ NOW <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            ))}
          </div>

          {/* SUBSCRIBE */}
          <div className="our-achievements-record-subscribe our-achievements-record-sidebar-section">
            <h2>Subscribe To Our News</h2>
            <p>Find out about the last days and the latest promotions of our Corporation</p>
            <form className="our-achievements-record-subscribe-form" onSubmit={handleSubscribe}>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit" disabled={loading}><FontAwesomeIcon icon={faPaperPlane} /></button>
            </form>
            {message && <p className="subscribe-message">{message}</p>}
          </div>

          {/* TAGS */}
          <div className="our-achievements-record-tags our-achievements-record-sidebar-section">
            <h2>Tags</h2>
            <div className="our-achievements-record-tag-list">
              {tags.map((tag, idx) => (
                <span key={idx} className="our-achievements-record-tag">{tag}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OurAchievementsRecords;
