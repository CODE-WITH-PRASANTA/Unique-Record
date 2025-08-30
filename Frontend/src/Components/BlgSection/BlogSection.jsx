import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './BlogSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '../../Api'; // Import API_URL
import { faListOl } from '@fortawesome/free-solid-svg-icons';

const BlogPost = ({ post, index, totalPosts }) => {
  const [showFullImage, setShowFullImage] = useState(false);

  const handleImageClick = () => {
    setShowFullImage(true);
  };

  const handleCloseFullImage = () => {
    setShowFullImage(false);
  };


  const capitalizeDesignation = (designation) => {
    return designation
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  

  return (
    
    <div className="Blog-Section-Post" key={post._id}>
      <div className="Blog-Section-Post-Index">
        <FontAwesomeIcon icon={faListOl} />
        <span>Sl No. {totalPosts - index}</span>
      </div>
     <div className="Blog-Section-Post-Image">
        <img src={post.imageUrl} alt={post.blogTitle} onClick={handleImageClick} />
        {showFullImage && (
          <div className="Blog-Section-Full-Image-Overlay" onClick={handleCloseFullImage}>
            <div className="Blog-Section-Full-Image-Container">
              <img src={post.imageUrl} alt={post.blogTitle} />
            </div>
          </div>
        )}
      </div>
      <div className="Blog-Section-Post-Details">
        <div className="Blog-Section-Post-Category">{post.category}</div>
        <Link to={`/blog/${post._id}`}>
          <h2 className="Blog-Section-Post-Title">{post.blogTitle}</h2>
        </Link>
        <p className="Blog-Section-Post-Excerpt">
          {post.shortDescription.length > 250
            ? `${post.shortDescription.substring(0, 250)}...`
            : post.shortDescription}
        </p>
        <div className="Blog-Section-Post-Meta">
        <span>📅 {new Date(post.createdAt).toDateString()}</span>
           {post.address && (
            <span>
              <span className="Blog-Section-Post-Dot"></span>
              <span>
                📍 {post.address}
              </span>
            </span>
          )}
          {post.email && (
            <span>
              <span className="Blog-Section-Post-Dot"></span>
              <span>
                📧 {post.email}
              </span>
            </span>
          )}

          <span className="Blog-Section-Post-Dot"></span>
          <span>
            By {post.authorName}
            {post.authorDesignation && (
              <span className="author-designation">
                {' '}({capitalizeDesignation(post.authorDesignation)})
              </span>
            )}
          </span>
         
        </div>
        <Link to={`/blog/${post._id}`} className="Blog-Section-ReadMore">
          Read More →
        </Link>
      </div>
    </div>
  );
};

const RecentPost = ({ post }) => (
  <div className="Blog-Section-Recent-Post" key={post._id}>
    <img src={post.imageUrl} alt={post.blogTitle} />
    <div className="Blog-Section-Recent-Post-Info">
      <span>{new Date(post.createdAt).toDateString()}</span>
      <Link to={`/blog/${post._id}`}>
        <h3>{post.blogTitle}</h3>
      </Link>
    </div>
  </div>
);

const TagButton = ({ tag }) => (
  <button className="Blog-Section-Tag-Button">{tag}</button>
);

const CategoryItem = ({ category, handleCategoryClick }) => (
  <div className="Blog-Section-Category-Item" onClick={() => handleCategoryClick(category.name)}>
    <span>{category.name}</span>
    <span className="Blog-Section-Category-Count">({category.count})</span>
  </div>
);

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredBlogPosts, setFilteredBlogPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
     axios.get(`${API_URL}/blogs/published`) // Use API_URL
      .then(res => {
        const blogs = res.data.data;
        setBlogPosts(blogs);
        setFilteredBlogPosts(blogs);

        // Extract tags and categories from blogs
        const tagSet = new Set();
        const categoryMap = {};

        blogs.forEach(blog => {
          blog.tags.forEach(tag => tagSet.add(tag));
          categoryMap[blog.category] = (categoryMap[blog.category] || 0) + 1;
        });

        setTags(Array.from(tagSet));
        setCategories(Object.entries(categoryMap).map(([name, count]) => ({ name, count })));
      })
      .catch(err => {
        console.error("Failed to fetch blogs", err);
      });
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const filteredPosts = blogPosts.filter(post => post.category === category);
    setFilteredBlogPosts(filteredPosts);
  };


  return (
    <div className="Blog-Section-Container">
       <div className="mobile-Blog-Section-Search-Box">
          <input type="text" placeholder="Search" />
          <button><FontAwesomeIcon icon={faSearch} /></button>
        </div>

      <div className="Blog-Section-Main-Content">
        {filteredBlogPosts.map((post, index) => (
          <BlogPost key={post._id} post={post} index={index} totalPosts={filteredBlogPosts.length} />
        ))}
      </div>

      <div className="Blog-Section-Sidebar">
        <div className="Blog-Section-Search-Box">
          <input type="text" placeholder="Search" />
          <button><FontAwesomeIcon icon={faSearch} /></button>
        </div>

        <div className="Blog-Section-Categories">
          <h2>Categories</h2>
          <div className="Blog-Section-Category-List">
            {categories.map((category, index) => (
              <CategoryItem key={index} category={category} handleCategoryClick={handleCategoryClick} />
            ))}
          </div>
        </div>

        <div className="Blog-Section-Recent-Posts">
          <h2>Recent Posts</h2>
          {blogPosts.slice(0, 2).map(post => (
            <RecentPost key={post._id} post={post} />
          ))}
        </div>

        <div className="Blog-Section-Tags">
          <h2>Tags</h2>
          <div className="Blog-Section-Tag-List">
            {tags.map((tag, index) => (
              <TagButton key={index} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;