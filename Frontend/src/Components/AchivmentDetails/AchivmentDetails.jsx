import React, { useState, useEffect } from 'react';
import './AchivmentDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Api';
import { Helmet } from "react-helmet";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faQuoteLeft, faPrint, faEnvelope, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FaFacebookF, FaWhatsapp, FaEnvelope, FaShareAlt , FaInstagram  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";  // modern X logo

library.add(fab);

const AchivmentDetails = () => {
  const { id } = useParams();
  const [achivmentDetails, setAchivmentDetails] = useState({});
  const [latestAchievements, setLatestAchievements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(""); // to show success or error messages
  const [expandedComments, setExpandedComments] = useState({}); 

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
        const achievementTags = [...new Set(response.data.flatMap((achievement) => achievement.tags))];
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    address: "",
    message: "",
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
    const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${API_URL}/comment/feedback`, formData, {
      headers: { 'Content-Type': 'application/json' }
    });
    setStatus("✅ Feedback submitted successfully!");
    setFormData({ name: "", email: "", phone: "", subject: "", address: "", message: "" });
  } catch (err) {
    console.error(err.response.data);
    setStatus(`❌ Failed to submit feedback. ${err.response.data.message || 'Try again.'}`);
  }
};


   const [comments, setComments] = useState([]);
const [loadingComments, setLoadingComments] = useState(true);

useEffect(() => {
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_URL}/comment/feedbacks`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };
  fetchComments();
}, []);



    // Toggle read more
    const toggleReadMore = (id) => {
      setExpandedComments((prev) => ({
        ...prev,
        [id]: !prev[id]
      }));
    };

  return (
    <div className="Achivments-details-container">
        <Helmet>
          <title>{achivmentDetails.title}</title>
          <meta name="description" content={achivmentDetails.content?.replace(/<[^>]+>/g, '').substring(0, 150)} />

          {/* Open Graph Tags */}
          <meta property="og:title" content={achivmentDetails.title} />
          <meta property="og:description" content={`${achivmentDetails.title} - Read more inside`} />
          <meta property="og:image" content={achivmentDetails.image} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="Provider" />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={achivmentDetails.title} />
          <meta name="twitter:description" content={`${achivmentDetails.title} - Read more inside`} />
          <meta name="twitter:image" content={achivmentDetails.image} />
        </Helmet>
      <div className="Achivments-details-main-content">
        <div className="Achivments-details-content-area">
          <div className="Achivments-details-image-section-one">
            <img src={achivmentDetails.image} alt={achivmentDetails.title} />
            <div className="achievement-details-footer">
                {/* Date */}
                <div className="achievement-detail date">
                  <span className="emoji">📅</span>
                  <span className="text">Date: {new Date(achivmentDetails.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Achiever Name */}
                <div className="achievement-detail name">
                  <span className="emoji">🏆</span>
                  <span className="text">Achiever Name: {achivmentDetails.achieverName}</span>
                </div>

                {/* Address */}
                <div className="achievement-detail address">
                  <span className="emoji">📍</span>
                  <span className="text">Address: {achivmentDetails.address}</span>
                </div>

                {/* Category */}
                <div className="achievement-detail category">
                  <span className="emoji">📂</span>
                  <span className="text">Category: {achivmentDetails.category}</span>
                </div>

                {/* Effort Type */}
                <div className="achievement-detail effort">
                  <span className="emoji">💪</span>
                  <span className="text">Effort Type: {achivmentDetails.effortType}</span>
                </div>

                {/* Provider */}
                <div className="achievement-detail provider">
                  <span className="emoji">🤝</span>
                  <span className="text">Presented by: {achivmentDetails.providerName}</span>
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
               {achivmentDetails.tags?.map((tag) => (
                  <span key={tag} className="Achivments-details-tag">{tag}</span>
                ))}

              </div>
           <div className="social-share">
              <strong>Share:</strong>

              {/* Facebook */}
              <button
                className="social-Achivments-icon fb"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                    "_blank"
                  )
                }
              >
                <FontAwesomeIcon icon={['fab', 'facebook-f']} />
              </button>

              {/* Twitter (X) */}
              <button
                className="social-Achivments-icon x"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `${achivmentDetails.title}\n\n©Provider: ${achivmentDetails.providerName}\n\nRead link 👇\n${window.location.href}`
                    )}`,
                    "_blank"
                  )
                }
              >
              <FaXTwitter />

              </button>

              {/* LinkedIn */}
              <button
                className="social-Achivments-icon linkedin"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(
                      `${achivmentDetails.title}\n\n©Provider: ${achivmentDetails.providerName}\n\nRead link 👇\n${window.location.href}`
                    )}`,
                    "_blank"
                  )
                }
              >
                <FontAwesomeIcon icon={['fab', 'linkedin-in']} />
              </button>

              {/* WhatsApp */}
              <button
                className="social-Achivments-icon wa"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(
                      `${achivmentDetails.title}\n\n©Provider: ${achivmentDetails.providerName}\n\nRead link 👇\n${window.location.href}`
                    )}`,
                    "_blank"
                  )
                }
              >
                <FontAwesomeIcon icon={['fab', 'whatsapp']} />
              </button>

              {/* Telegram */}
              <button
                className="social-Achivments-icon telegram"
                onClick={() =>
                  window.open(
                    `https://telegram.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(
                      `${achivmentDetails.title}\n\n©Provider: ${achivmentDetails.providerName}\n\nRead link 👇\n${window.location.href}`
                    )}`,
                    "_blank"
                  )
                }
              >
                <FontAwesomeIcon icon={['fab', 'telegram-plane']} />
              </button>

              {/* Email */}
              <button
                className="social-Achivments-icon more"
                onClick={() =>
                  (window.location.href = `mailto:?subject=${achivmentDetails.title}&body=${encodeURIComponent(
                    `${achivmentDetails.title}\n\n©Provider: ${achivmentDetails.providerName}\n\nRead link 👇\n${window.location.href}`
                  )}`)
                }
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
            </div>

            </div>
          </div>

          <div className="comments-reply-form">
      <h2>Please Share Your Feedback or Suggestions.?</h2>
      <form onSubmit={handleSubmit}>
        <div className="Achivments-form-row">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="Achivments-form-row">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Submit Now →</button>
      </form>

      {status && <p>{status}</p>}
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
                  <a href={`/achivment-details/${post._id}`} className="Achivments-details-read-more">Read More</a>
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

        <div className="AchivmentCmt-sidebar">
              <h2 className="AchivmentCmt-title">💬 Comments</h2>

              {loadingComments ? (
                <p>Loading comments...</p>
              ) : comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                <div className="AchivmentCmt-list">
                  {comments.map((comment) => {
                    const expanded = expandedComments[comment._id] || false;
                    const truncatedMessage =
                      comment.message.length > 120
                        ? comment.message.substring(0, 120) + "..."
                        : comment.message;

                    return (
                      <div key={comment._id} className="AchivmentCmt-item">
                        <p className="AchivmentCmt-field">
                          <span>Name:</span> {comment.name}
                        </p>
                        <p className="AchivmentCmt-field">
                          <span>Email:</span> {comment.email}
                        </p>
                        <p className="AchivmentCmt-field">
                          <span>Address:</span> {comment.address}
                        </p>
                        <p className="AchivmentCmt-message">
                          {expanded ? comment.message : truncatedMessage}
                        </p>

                        {comment.message.length > 120 && (
                          <button
                            className="AchivmentCmt-readmore"
                            onClick={() => toggleReadMore(comment._id)}
                          >
                            {expanded ? "Show Less" : "Read More"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

        </aside>
      </div>
    </div>
  );
};

export default AchivmentDetails;