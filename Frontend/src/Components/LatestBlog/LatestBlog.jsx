import React, { useEffect, useState } from 'react';
import './LatestBlog.css';
import { Link } from "react-router-dom";
import { API_URL } from '../../Api';

// Swiper imports
import { Swiper as AgentSwiper, SwiperSlide as AgentSwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const StyledBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short", // "Aug"
      year: "numeric", // "2025"
    });
  };

  // ✅ Fetch latest blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/blogs/all`);
        const result = await response.json();

        if (result.success) {
          // ✅ Take only the latest 6 blogs
          setBlogs(result.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <p className="loading-text">Loading blogs...</p>;
  }

  return (
    <div className="full-latest-blog-sec">
      <section className="latest-blog-section">
        <h5 className="latest-blog-subtitle">LATEST NEWS, UPDATE & BLOGS</h5>
        <h2 className="blog-main-title">Insights from Our URU Post</h2>

        {/* Mobile View: Swiper */}
        <div className="swiper-container">
          <AgentSwiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="mobile-swiper"
          >
            {blogs.map((blog) => (
              <AgentSwiperSlide key={blog._id} className="latest-blog-card">
                <div className="blog-thumbnail">
                  <img src={blog.imageUrl} alt={blog.blogTitle} />
                  <span className="blog-date-badge">
                    {formatDate(blog.createdAt)}
                  </span>
                </div>
                <div className="latest-blog-details">
                  <p className="latest-blog-author">
                    By {blog.authorName} 
                    {blog.authorDesignation && <span> ({blog.authorDesignation})</span>}
                    {blog.category && <span> | {blog.category}</span>}
                  </p>
                  <h3 className="latest-blog-title">{blog.blogTitle}</h3>
                  <p className="latest-blog-excerpt">{blog.shortDescription}</p>
                  <p className="latest-blog-meta">
                    <strong>Created:</strong> {formatDate(blog.createdAt)}
                  </p>
                  <Link to={`/blog/${blog._id}`} className="read-more-btn">Read More</Link>
                </div>
              </AgentSwiperSlide>
            ))}
          </AgentSwiper>
        </div>

        {/* Desktop & Tablet View: Grid */}
        <div className="latest-blog-grid">
          {blogs.map((blog) => (
            <article key={blog._id} className="latest-blog-card">
              <div className="blog-thumbnail">
                <img src={blog.imageUrl} alt={blog.blogTitle} />
                <span className="blog-date-badge">
                  {formatDate(blog.createdAt)}
                </span>
              </div>
              <div className="latest-blog-details">
                <p className="latest-blog-author">
                  By {blog.authorName} 
                  {blog.authorDesignation && <span> ({blog.authorDesignation})</span>}
                  {blog.category && <span> | {blog.category}</span>}
                </p>
                <h3 className="latest-blog-title">{blog.blogTitle}</h3>
                <p className="latest-blog-excerpt">{blog.shortDescription}</p>
                <p className="latest-blog-meta">
                  <strong>Created:</strong> {formatDate(blog.createdAt)}
                </p>
                <Link to={`/blog/${blog._id}`} className="latest-read-more-btn">Read More</Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="view-all-container">
          <Link to="/blog" className="view-all-btn">View All</Link>
        </div>
      </section>
    </div>
  );
};

export default StyledBlog;
