import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BlogSection.css";
import axios from "axios";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [approvedBlogs, setApprovedBlogs] = useState([]);
  const [showApproved, setShowApproved] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/blogs/all");
        setBlogs(res.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchApprovedBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/user/blog/approved");
        setApprovedBlogs(res.data);
      } catch (error) {
        console.error("Error fetching approved blogs:", error);
      }
    };

    fetchBlogs();
    fetchApprovedBlogs();
  }, []);

  const handleToggle = () => {
    setShowApproved(!showApproved);
  };

  return (
    <section className="blog-section">
      <h2 className="blog-header">Latest Insights & Trends</h2>
      <p className="blog-subtext">
        Stay updated with "Unique Records of Universe" and all the unique, amazing, innovative information of the country and the world
      </p>


      <div className="blog-container">
        {(showApproved ? approvedBlogs : blogs).map((blog) => (
          <div className="blog-card" key={blog._id}>
            <Link to={`/blog/${blog._id}`}>
              <img src={blog.image || blog.imageUrl} alt={blog.title} className="blog-image" />
            </Link>
            <div className="blog-content">
              <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString()}</span>
              <p className="blog-meta">
                <strong>{blog.authorName}</strong> • {blog.category}
              </p>
              <h3 className="blog-title">
                <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
              </h3>
              <p className="blog-description">{blog.description}</p>
              <Link to={`/blog/${blog._id}`} className="read-more">Read More →</Link>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleToggle} className="blog-toggle-button">
  {showApproved ? "Show All Blogs" : "Show User Blogs"}
</button>

    </section>
  );
};

export default BlogSection;