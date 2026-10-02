import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './BlogSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faTag, faArrowRight, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '../../Api';

const BlogCard = ({ post, index, onImageClick }) => {
  const title = post.title || post.blogTitle || 'Untitled Article';
  const image =
    post.image ||
    post.imageUrl ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';
  const shortDescription =
    post.shortDesc ||
    post.shortDescription ||
    (post.content ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : 'Explore this fascinating article...');
  const author = post.author || post.authorName || 'Admin';
  const authorDesignation = post.authorDesignation || '';
  const category = post.category || 'General';
  const postDate = new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <article className="Blog-Card-Item" key={post._id || index}>
      <div className="Blog-Card-Image-Wrap">
        <span className="Blog-Card-Category-Badge">{category}</span>
        <img
          src={image}
          alt={title}
          className="Blog-Card-Image"
          onClick={() => onImageClick(image, title)}
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </div>

      <div className="Blog-Card-Body">
        <div className="Blog-Card-Meta">
          <span className="Blog-Card-Meta-Item">
            <FontAwesomeIcon icon={faCalendarAlt} color="#d4af37" /> {postDate}
          </span>
          {post.address && (
            <span className="Blog-Card-Meta-Item">
              📍 {post.address}
            </span>
          )}
        </div>

        <Link to={`/blog/${post.slug || post._id}`} style={{ textDecoration: 'none' }}>
          <h3 className="Blog-Card-Title">{title}</h3>
        </Link>

        <p className="Blog-Card-Excerpt">{shortDescription}</p>

        <div className="Blog-Card-Footer">
          <div className="Blog-Card-Author">
            <div className="Blog-Card-Avatar">{getInitials(author)}</div>
            <div>
              <p className="Blog-Card-Author-Name">{author}</p>
              {authorDesignation && (
                <p className="Blog-Card-Author-Desig">{authorDesignation}</p>
              )}
            </div>
          </div>

          <Link to={`/blog/${post.slug || post._id}`} className="Blog-Card-Read-Btn">
            Read <FontAwesomeIcon icon={faArrowRight} size="xs" />
          </Link>
        </div>
      </div>
    </article>
  );
};

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredBlogPosts, setFilteredBlogPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightbox, setLightbox] = useState({ show: false, image: '', title: '' });

  // Fetch blogs from API
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/blogs`)
      .then((res) => {
        const blogs = ((res.data && res.data.data) || []).filter(
          (b) => b.status !== 'Draft'
        );
        setBlogPosts(blogs);
        setFilteredBlogPosts(blogs);

        const tagSet = new Set();
        const categoryMap = {};

        blogs.forEach((blog) => {
          if (Array.isArray(blog.tags)) {
            blog.tags.forEach((tag) => tagSet.add(tag));
          }
          if (blog.category) {
            categoryMap[blog.category] = (categoryMap[blog.category] || 0) + 1;
          }
        });

        setTags(Array.from(tagSet));
        setCategories(
          Object.entries(categoryMap).map(([name, count]) => ({ name, count }))
        );
      })
      .catch((err) => {
        console.error('Failed to fetch blogs:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...blogPosts];

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((post) => post.category === selectedCategory);
    }

    if (selectedTag) {
      result = result.filter(
        (post) => Array.isArray(post.tags) && post.tags.includes(selectedTag)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((post) => {
        const title = (post.title || post.blogTitle || '').toLowerCase();
        const desc = (post.shortDesc || post.shortDescription || '').toLowerCase();
        const author = (post.author || post.authorName || '').toLowerCase();
        const cat = (post.category || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || author.includes(q) || cat.includes(q);
      });
    }

    setFilteredBlogPosts(result);
  }, [selectedCategory, selectedTag, searchQuery, blogPosts]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedTag(null);
    setSearchQuery('');
  };

  const openLightbox = (image, title) => {
    setLightbox({ show: true, image, title });
  };

  const closeLightbox = () => {
    setLightbox({ show: false, image: '', title: '' });
  };

  return (
    <div className="Blog-Section-Container">
      {/* LIGHTBOX MODAL */}
      {lightbox.show && (
        <div className="Blog-Lightbox-Overlay" onClick={closeLightbox}>
          <div className="Blog-Lightbox-Content" onClick={(e) => e.stopPropagation()}>
            <button className="Blog-Lightbox-Close" onClick={closeLightbox}>
              ✕
            </button>
            <img src={lightbox.image} alt={lightbox.title} />
          </div>
        </div>
      )}

      {/* MAIN CARDS CONTENT AREA */}
      <div className="Blog-Section-Main-Content-Wrapper">
        {/* Mobile Search Bar */}
        <div className="Blog-Mobile-Search">
          <div className="Blog-Sidebar-Search-Box" style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="Blog-Sidebar-Search-Input"
            />
            <button className="Blog-Sidebar-Search-Btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        {/* Card Grid or Empty State */}
        {loading ? (
          <div className="Blog-Empty-Card">
            <div className="Blog-Empty-Icon">⏳</div>
            <h3 className="Blog-Empty-Title">Loading Articles...</h3>
            <p className="Blog-Empty-Subtitle">Fetching the latest stories from our repository.</p>
          </div>
        ) : filteredBlogPosts.length === 0 ? (
          <div className="Blog-Empty-Card">
            <div className="Blog-Empty-Icon">
              <FontAwesomeIcon icon={faFolderOpen} />
            </div>
            <h3 className="Blog-Empty-Title">No Articles Found</h3>
            <p className="Blog-Empty-Subtitle">
              We couldn't find any articles matching your search query or selected filter.
            </p>
            <button className="Blog-Clear-Btn" onClick={handleClearFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="Blog-Cards-Grid">
            {filteredBlogPosts.map((post, index) => (
              <BlogCard
                key={post._id || index}
                post={post}
                index={index}
                onImageClick={openLightbox}
              />
            ))}
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      <aside className="Blog-Section-Sidebar">
        {/* Search Widget */}
        <div className="Blog-Sidebar-Widget">
          <h4 className="Blog-Sidebar-Title">Search Blog</h4>
          <div className="Blog-Sidebar-Search-Box">
            <input
              type="text"
              placeholder="Type keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="Blog-Sidebar-Search-Input"
            />
            <button className="Blog-Sidebar-Search-Btn" onClick={() => {}}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        {/* Categories Widget */}
        <div className="Blog-Sidebar-Widget">
          <h4 className="Blog-Sidebar-Title">Categories</h4>
          <div className="Blog-Sidebar-Category-List">
            <div
              className={`Blog-Sidebar-Category-Item ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('All')}
            >
              <span>All Categories</span>
              <span className="Blog-Sidebar-Category-Count">{blogPosts.length}</span>
            </div>
            {categories.map((cat, index) => (
              <div
                key={index}
                className={`Blog-Sidebar-Category-Item ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat.name)}
              >
                <span>{cat.name}</span>
                <span className="Blog-Sidebar-Category-Count">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts Widget */}
        <div className="Blog-Sidebar-Widget">
          <h4 className="Blog-Sidebar-Title">Recent Highlights</h4>
          <div className="Blog-Sidebar-Recent-List">
            {blogPosts.slice(0, 3).map((post) => {
              const rTitle = post.title || post.blogTitle || 'Untitled';
              const rImage =
                post.image ||
                post.imageUrl ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';
              const rDate = new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <Link
                  to={`/blog/${post.slug || post._id}`}
                  key={post._id}
                  className="Blog-Sidebar-Recent-Item"
                >
                  <img
                    src={rImage}
                    alt={rTitle}
                    className="Blog-Sidebar-Recent-Thumb"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="Blog-Sidebar-Recent-Info">
                    <span className="Blog-Sidebar-Recent-Date">📅 {rDate}</span>
                    <h5 className="Blog-Sidebar-Recent-Title">{rTitle}</h5>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tags Cloud Widget */}
        {tags.length > 0 && (
          <div className="Blog-Sidebar-Widget">
            <h4 className="Blog-Sidebar-Title">Popular Tags</h4>
            <div className="Blog-Sidebar-Tag-Cloud">
              {tags.map((tag, index) => (
                <button
                  key={index}
                  className={`Blog-Sidebar-Tag-Pill ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => handleTagSelect(tag)}
                >
                  <FontAwesomeIcon icon={faTag} size="xs" style={{ marginRight: '4px' }} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default BlogSection;