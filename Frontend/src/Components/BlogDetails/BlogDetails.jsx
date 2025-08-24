import React, { useState, useEffect } from 'react';
import './BlogDetails.css';
import rp from '../../assets/rp-1.webp';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSearch, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../Api'; // Import the API_URL constant
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fab);

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [loading, setLoading] = useState(false);
   const [expandedComments, setExpandedComments] = useState({});

 const [comments, setComments] = useState([]);
const [loadingComments, setLoadingComments] = useState(true);

const fetchComments = async () => {
  try {
    const res = await fetch(`${API_URL}/blogcmt/feedbacks`);
    const data = await res.json();

    if (res.ok && data.success) {
      setComments(data.data);
    } else {
      setComments([]);
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    setComments([]);
  } finally {
    setLoadingComments(false);
  }
};

useEffect(() => {
  fetchComments();
}, []);


  // Toggle "Read More / Show Less"
  const toggleReadMore = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };



  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    address: "",
    message: ""
  });

  const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmitFeedback = async (e) => {
  e.preventDefault();
  setLoading(true);
  setFeedbackMessage("");

  try {
    const res = await fetch(`${API_URL}/blogcmt/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setFeedbackMessage("✅ Feedback submitted successfully! Awaiting approval.");
      setFormData({ name: "", email: "", phone: "", subject: "", address: "", message: "" });
    } else {
      setFeedbackMessage(`❌ ${data.message || "Error submitting feedback."}`);
    }
  } catch (error) {
    setFeedbackMessage("❌ Network error, please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleViewAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to search results page or filter blog posts
    window.location.href = `/search?q=${searchTerm}`;
  };

 const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
    setCategories(sortedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${API_URL}/blogs/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setBlog(data.data);
        setTags(data.data.tags || []);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/blogs/all`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setRecentPosts(data.data.slice(0, 2));
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchRecentPosts();
    fetchCategories();
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  const capitalizeDesignation = (designation) => {
  return designation
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};


  return (
    <div className="News-details-container">
    <div className="news-top-heading-container">
        <h1 className="news-top-heading">Uru Post</h1>
      </div>

      <div className="News-details-main-content">
        <div className="News-details-content-area">
          <div className="News-details-image-section-one">
            <img src={blog.imageUrl} alt={blog.blogTitle} />
        <div className="News-details-footer">
  <div className="date-container">
    📅 <span>
      {new Date(blog.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).replace(/\//g, "-")}
    </span>
  </div>

  <div className="author-container">
    ✍️ <span>By: {blog.authorName || 'Unknown Author'}</span>
    {blog.authorDesignation && (
      <span> &mdash; ({capitalizeDesignation(blog.authorDesignation)})</span>
    )}
  </div>

  <div className="location-container">
    📍 <span>Location: {blog.address || 'Unknown Location'}</span>
  </div>

  <div className="email-container">
    📧 <span>Email: <a href={`mailto:${blog.email}`}>{blog.email || 'Not Provided'}</a></span>
  </div>

  {/* New Category Section */}
  <div className="category-container">
    🏷️ <span>Category: {blog.category || 'Uncategorized'}</span>
  </div>
</div>

          </div>

          <h1 className="News-details-title">{blog.blogTitle}</h1>
          <p className="News-details-paragraph" dangerouslySetInnerHTML={{ __html: blog.blogContent }}></p>

          {blog.quotes && (
            <div className="News-details-quote">
              <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
              <p>"{blog.quotes}"</p>
            </div>
          )}

          <div className="News-details-community">
            <div className="News-details-tags-row">
              <div className="tags">
                <strong>Tags:</strong> <span>{tags.join(', ')}</span>
              </div>
              <div className="social-share">
                <strong>Share:</strong>
                <button className="social-news-icon fb" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                </button>
                <button className="social-news-icon x" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'twitter']} />
                </button>
                <button className="social-news-icon linkedin" onClick={() => window.open(`https://www.linkedin.com/sharing/share?url=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'linkedin-in']} />
                </button>
                <button className="social-news-icon wa" onClick={() => window.open(`https://wa.me/?text=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'whatsapp']} />
                </button>
                <button className="social-news-icon telegram" onClick={() => window.open(`https://telegram.me/share/url?url=${window.location.href}`, '_blank')}>
                  <FontAwesomeIcon icon={['fab', 'telegram-plane']} />
                </button>
                <button className="social-news-icon more" onClick={() => window.location.href = `mailto:?subject=${blog.blogTitle}&body=${window.location.href}`}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </button>
              </div>
            </div>
          </div>

        <div className="comments-reply-form">
          <h2>Please Share Your Feedback or Suggestions.?</h2>
          <form onSubmit={handleSubmitFeedback}>
            <div className="news-form-row">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            </div>
            <div className="news-form-row">
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
            </div>
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" required></textarea>
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Now →"}
            </button>
          </form>
          {feedbackMessage && <p className="feedback-status">{feedbackMessage}</p>}
        </div>

        </div>

        <aside className="News-details-sidebar">
          <div className="News-details-search-bar">
            <form onSubmit={handleSearchSubmit}>
              <input type="search" value={searchTerm} onChange={handleSearch} placeholder="Search" />
              <button type="submit"><FontAwesomeIcon icon={faSearch} /></button>
            </form>
          </div>

          <div className="News-details-categories">
            <h2>All Categories</h2>
            <div className="News-details-category-tags">
              {categories
                .slice(0, showAllCategories ? categories.length : 5)
                .map((category, index) => (
                  <span key={index} className="News-details-category-tag">
                    {category.name}
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

          <div className="News-details-recent-posts-sidebar">
            <h2>Recent Posts</h2>
            {recentPosts.map((post, index) => (
              <div key={index} className="News-details-recent-post">
                <img src={post.imageUrl || rp} alt="Post" />
                <div className="News-details-recent-post-content">
                  <h3>{post.blogTitle}</h3>
                  <a href={`/blog/${post._id}`} className="News-details-read-more">Read More</a>
                </div>
              </div>
            ))}
          </div>
          <div className="News-details-tags-sidebar">
            <h2>Tags</h2>
            <div className="News-details-tags">
              {tags.map((tag, index) => (
                <span key={index} className="News-details-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        <div className="BlogCmt-sidebar">
          <h2 className="BlogCmt-title">💬 Comments</h2>

          {loadingComments ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <div className="BlogCmt-list">
              {comments.map((comment) => {
                const expanded = expandedComments[comment._id] || false;
                const truncatedMessage =
                  comment.message.length > 120
                    ? comment.message.substring(0, 120) + "..."
                    : comment.message;

                return (
                  <div key={comment._id} className="BlogCmt-item">
                    <p className="BlogCmt-field">
                      <span>Name:</span> {comment.name}
                    </p>
                    <p className="BlogCmt-field">
                      <span>Email:</span> {comment.email}
                    </p>
                    <p className="BlogCmt-field">
                      <span>Address:</span> {comment.address}
                    </p>
                    <p className="BlogCmt-message">
                      {expanded ? comment.message : truncatedMessage}
                    </p>

                    {comment.message.length > 120 && (
                      <button
                        className="BlogCmt-readmore"
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

export default BlogDetails;