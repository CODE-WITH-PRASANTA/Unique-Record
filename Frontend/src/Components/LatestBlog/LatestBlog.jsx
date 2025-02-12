import React from 'react';
import './LatestBlog.css'

// Swiper imports
import { Swiper as AgentSwiper, SwiperSlide as AgentSwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

// Assets
import Blog1 from '../../assets/blog-1.jpg';
import Blog2 from '../../assets/blog-02.jpg';
import Blog3 from '../../assets/blog-01.jpg';

const StyledBlog = () => {
  return (
    <div className="full-latest-blog-sec">
    <section className="latest-blog-section">
      <h5 className="latest-blog-subtitle">Latest News</h5>
      <h2 className="blog-main-title">Insights from Our Blog</h2>

      {/* Mobile View: Swiper */}
      <div className="swiper-container">
        <AgentSwiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mobile-swiper"
        >
          {[Blog1, Blog2, Blog3].map((blog, index) => (
            <AgentSwiperSlide key={index} className="latest-blog-card">
              <div className="blog-thumbnail">
                <img src={blog} alt={`Blog Post ${index + 1}`} />
                <span className="blog-date-badge">Jan 28, 2024</span>
              </div>
              <div className="latest-blog-details">
                <p className="latest-blog-author">By Jerome Bell <span> | Furniture</span></p>
                <h3 className="latest-blog-title">
                  Building Gains Into Housing Stocks and How to Trade the Sector
                </h3>
                <p className="latest-blog-excerpt">
                  Discover the latest insights on mortgage rates, investment strategies, and how to navigate market fluctuations...
                </p>
                <a href="#" className="read-more-btn">Read More</a>
              </div>
            </AgentSwiperSlide>
          ))}
        </AgentSwiper>
      </div>

      {/* Desktop & Tablet View: Grid */}
      <div className="latest-blog-grid">
        {[Blog1, Blog2, Blog3].map((blog, index) => (
          <article key={index} className="latest-blog-card">
            <div className="blog-thumbnail">
              <img src={blog} alt={`Blog Post ${index + 1}`} />
              <span className="blog-date-badge">Jan 28, 2024</span>
            </div>
            <div className="latest-blog-details">
              <p className="latest-blog-author">By Jerome Bell <span> | Furniture</span></p>
              <h3 className="latest-blog-title">
                Building Gains Into Housing Stocks and How to Trade the Sector
              </h3>
              <p className="latest-blog-excerpt">
                Discover the latest insights on mortgage rates, investment strategies, and how to navigate market fluctuations...
              </p>
              <a href="#" className="read-more-btn">Read More</a>
            </div>
          </article>
        ))}
      </div>
    </section>
    </div>
  );
};

export default StyledBlog;
