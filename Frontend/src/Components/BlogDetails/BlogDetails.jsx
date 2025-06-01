import React, { useState, useEffect } from 'react';
import './BlogDetails.css';
import rp from '../../assets/rp-1.webp';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faComments, faSearch, faQuoteLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../Api'; // Import the API_URL constant

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [tags, setTags] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data);
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (!blog) {
    return <div>Loading...</div>;
  }


  return (
    <div className="News-details-container">
      <div className="News-details-main-content">
        <div className="News-details-content-area">
          <div className="News-details-image-section-one">
            <img src={blog.imageUrl} alt={blog.blogTitle} />
            <div className="News-details-footer">
              <div className="date-container">
                <FontAwesomeIcon icon={faCalendarAlt} className="news-icon" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="author-container">
                <FontAwesomeIcon icon={faCheckCircle} className="news-icon" />
                <span>By : {blog.authorName || 'Unknown Author'}</span>
              </div>
            </div>
          </div>

          <h1 className="News-details-title">{blog.blogTitle}</h1>
          <p className="News-details-paragraph">{blog.shortDescription}</p>
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
                <button className="social-news-icon">F</button>
                <button className="social-news-icon">X</button>
                <button className="social-news-icon">in</button>
                <button className="social-news-icon">G</button>
              </div>
            </div>
          </div>

          <div className="comments-reply-form">
            <h2>Ask Any Question ?</h2>
            <form>
              <div className="news-form-row">
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="news-form-row">
                <input type="tel" placeholder="Phone" />
                <input type="text" placeholder="Subject" />
              </div>
              <textarea placeholder="Message"></textarea>
              <button type="submit">Submit Now →</button>
            </form>
          </div>
        </div>

        <aside className="News-details-sidebar">
          <div className="News-details-search-bar">
            <input type="search" value={searchTerm} onChange={handleSearch} placeholder="Search" />
            <button><FontAwesomeIcon icon={faSearch} /></button>
          </div>
          <div className="News-details-categories">
            <h2>All Categories</h2>
            <div className="News-details-category-tags">
              {categories.map((category, index) => (
                <span key={index} className="News-details-category-tag">
                  {category.name}
                </span>
              ))}
            </div>
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
        </aside>
      </div>
    </div>
  );
};

export default BlogDetails;