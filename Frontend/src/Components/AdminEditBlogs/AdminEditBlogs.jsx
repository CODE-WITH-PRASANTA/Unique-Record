import React, { useEffect, useState } from 'react';
import './AdminEditBlogs.css';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../Api'; // Import API_URL from your config file

const AdminEditBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/blogs/all`); // Use API_URL
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const res = await axios.delete(`${API_URL}/blogs/delete/${id}`); // Use API_URL
        if (res.data.success) {
          setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        }
      } catch (error) {
        console.error('Failed to delete blog', error);
      }
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const latestBlog = blogs.length > 0 ? blogs[0] : null;
  const otherBlogs = blogs.slice(1);

  return (
    <div className="Blog-list-Container">
      <div className="Blog-list-Header">
        <h1>BLOG DETAILS</h1>
      </div>

      <div className="Blog-list-Content">
        {latestBlog && (
          <div className="Blog-list-Main">
            <div className="Blog-list-Card">
              <img src={latestBlog.imageUrl} alt="Main Blog" />
              <div className="Blog-list-Overlay">
                <p className="Blog-list-Date">{new Date(latestBlog.createdAt).toLocaleDateString()}</p>
                <h2 className="Blog-list-Title">{truncateText(latestBlog.blogTitle, 60)}</h2>
                <div className="Blog-list-Meta">
                  <span>{latestBlog.authorName}</span>
                  <span> | {latestBlog.category}</span>
                </div>
                <div className="delete-icon">
                  <FaTrash className="delete-btn" onClick={() => handleDelete(latestBlog._id)} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="Blog-list-Recent-Posts">
          {otherBlogs.slice(0, 2).map((blog) => (
            <div className="Blog-list-Post" key={blog._id}>
              <img src={blog.imageUrl} alt="Post" />
              <div className="Blog-list-Post-Info">
                <p className="Blog-list-Post-Date">
                  <strong>{new Date(blog.createdAt).getDate()}</strong> {new Date(blog.createdAt).toLocaleString('default', { month: 'long' })} {new Date(blog.createdAt).getFullYear()}
                </p>
                <h3>{truncateText(blog.blogTitle, 50)}</h3>
                <p>by: {blog.authorName}</p>
                <p className="Blog-list-Post-Excerpt">{truncateText(blog.shortDescription, 100)}</p>
              </div>
              <div className="delete-icon">
                <FaTrash className="delete-btn" onClick={() => handleDelete(blog._id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="Blog-list-Card-Section">
        {otherBlogs.slice(2).map((blog) => (
          <div className="Blog-list-Card-Item" key={blog._id}>
            <img src={blog.imageUrl} alt="Blog Thumbnail" />
            <div className="Blog-list-Card-Meta">
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              <span>|</span>
              <span>by: {blog.authorName}</span>
              <span style={{ float: 'right' }}>
                <FaTrash className="delete-btn" onClick={() => handleDelete(blog._id)} />
              </span>
            </div>
            <div className="Blog-list-Card-Content">
              <p>{truncateText(blog.blogTitle, 60)}</p>
             <p>{truncateText(blog.shortDescription, 120)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEditBlogs;