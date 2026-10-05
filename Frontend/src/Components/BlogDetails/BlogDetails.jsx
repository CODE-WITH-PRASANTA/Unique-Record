import React, { useState, useEffect } from 'react';
import './BlogDetails.css';
import rp from '../../assets/rp-1.webp';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faQuoteLeft,
  faEnvelope,
  faHome,
  faChevronRight,
  faLink,
  faCheck,
  faCommentDots,
  faTag,
  faArrowLeft,
  faShareNodes,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { API_URL } from '../../Api';

library.add(fab);

const BlogDetails = () => {
  const { slug, id } = useParams();
  const currentIdentifier = slug || id;
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Comments / Feedback
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    address: '',
    message: '',
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  // Fetch single blog by ID or Slug
  const fetchBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/blogs/${currentIdentifier}`);
      if (res.data && res.data.success && res.data.data) {
        const blogData = res.data.data;
        setBlog(blogData);
        setTags(Array.isArray(blogData.tags) ? blogData.tags : []);

        // Load comments specific to this blog
        fetchComments(blogData._id, blogData.slug || currentIdentifier);

        // If accessed via ID and slug exists, silently update the URL to /blog/slug
        if (blogData.slug && currentIdentifier !== blogData.slug) {
          navigate(`/blog/${blogData.slug}`, { replace: true });
        }
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load article. It may have been removed or unpublished.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const sortedCategories = res.data.data.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '')
        );
        setCategories(sortedCategories);
      }
    } catch (err) {
      console.warn('Error fetching categories:', err);
    }
  };

  // Fetch recent posts
  const fetchRecentPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/blogs`);
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        // Filter out current post if ID or slug matches
        const others = res.data.data.filter(
          (b) => b._id !== currentIdentifier && b.slug !== currentIdentifier && b.status !== 'Draft'
        );
        setRecentPosts(others.slice(0, 4));
      }
    } catch (err) {
      console.warn('Error fetching recent posts:', err);
    }
  };

  // Fetch comments specifically for this individual blog
  const fetchComments = async (targetBlogId, targetBlogSlug) => {
    try {
      setLoadingComments(true);
      const idToUse = targetBlogId || blog?._id;
      const slugToUse = targetBlogSlug || blog?.slug || currentIdentifier;

      const params = new URLSearchParams();
      if (idToUse) params.append('blogId', idToUse);
      if (slugToUse) params.append('blogSlug', slugToUse);

      const res = await axios.get(`${API_URL}/blogcmt/feedbacks?${params.toString()}`);
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setComments(res.data.data);
      } else if (Array.isArray(res.data)) {
        setComments(res.data);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.warn('No comments or error fetching comments:', err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchRecentPosts();
    fetchCategories();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIdentifier]);

  const toggleReadMore = (cmtId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [cmtId]: !prev[cmtId],
    }));
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    setFeedbackMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        blogId: blog?._id || undefined,
        blogTitle: blog?.title || blog?.blogTitle || '',
        blogSlug: blog?.slug || currentIdentifier || '',
      };

      const res = await axios.post(`${API_URL}/blogcmt/feedback`, payload);
      if (res.data && res.data.success) {
        setFeedbackMessage({
          type: 'success',
          text: res.data.message || 'Feedback submitted successfully!',
        });
        setFormData({ name: '', email: '', phone: '', subject: '', address: '', message: '' });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.data?.message || 'Error submitting feedback. Please try again.',
        });
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.message || 'Network error occurred while submitting feedback.',
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/blog?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Calculations & Formatters
  const blogTitle = blog?.title || blog?.blogTitle || 'Untitled Blog';
  const blogImage = blog?.image || blog?.imageUrl || rp;
  const blogContent = blog?.content || blog?.blogContent || '<p>No content available</p>';
  const authorName = blog?.author || blog?.authorName || 'Admin';
  const authorDesignation = blog?.authorDesignation || '';
  const categoryName = blog?.category || 'General';


  const getInitials = (name) => {
    if (!name) return 'UR';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const provider = 'Unique Record Of Universe';
  const currentUrl = window.location.href;
  const shareMessage = `${blogTitle}\n\n©Provider: ${provider}\n\nRead here: ${currentUrl}`;

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };
  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };
  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(blogTitle)}`, '_blank');
  };
  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };
  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareMessage)}`, '_blank');
  };
  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(blogTitle)}&body=${encodeURIComponent(shareMessage)}`;
  };

  if (loading) {
    return (
      <div className="Blog-Details-Loading-Container">
        <div className="Blog-Details-Spinner"></div>
        <h2>Loading Article...</h2>
        <p>Please wait while we retrieve the complete story for you.</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="Blog-Details-Error-Container">
        <div className="Blog-Details-Error-Icon">⚠️</div>
        <h2>Article Not Found</h2>
        <p>{error || 'The requested article could not be located in our database.'}</p>
        <Link to="/blog" className="Blog-Details-Back-Btn">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="Blog-Details-Page">
      <Helmet>
        <title>{blogTitle} | Unique Records of Universe</title>
        <meta property="og:title" content={blogTitle} />
        <meta
          property="og:description"
          content={blogContent.replace(/<[^>]+>/g, '').substring(0, 180)}
        />
        <meta property="og:image" content={blogImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* =========================================================
          BREADCRUMB & HERO HEADER
          home / blog / blog name
      ========================================================= */}
      <section className="Blog-Details-Hero-Banner">
        <div className="Blog-Details-Hero-Inner">
          {/* Breadcrumb Bar */}
          <nav className="Blog-Details-Breadcrumb" aria-label="breadcrumb">
            <Link to="/" className="Blog-Breadcrumb-Link">
              <FontAwesomeIcon icon={faHome} style={{ marginRight: '6px' }} /> Home
            </Link>
            <FontAwesomeIcon icon={faChevronRight} className="Blog-Breadcrumb-Separator" />
            <Link to="/blog" className="Blog-Breadcrumb-Link">
              Blog
            </Link>
            <FontAwesomeIcon icon={faChevronRight} className="Blog-Breadcrumb-Separator" />
            <span className="Blog-Breadcrumb-Current" title={blogTitle}>
              {blogTitle}
            </span>
          </nav>

          {/* Main Title */}
          <h1 className="Blog-Details-Main-Title">{blogTitle}</h1>
        </div>
      </section>

      {/* =========================================================
          MAIN ARTICLE & SIDEBAR LAYOUT
      ========================================================= */}
      <div className="Blog-Details-Layout-Container">
        {/* LEFT COLUMN: MAIN ARTICLE CONTENT */}
        <article className="Blog-Details-Article-Area">
          {/* Featured Image */}
          {blogImage && (
            <div className="Blog-Details-Featured-Image-Wrap">
              <img
                src={blogImage}
                alt={blogTitle}
                className="Blog-Details-Featured-Image"
                onError={(e) => {
                  e.target.src = rp;
                }}
              />
            </div>
          )}

          {/* Short Excerpt / Subtitle */}
          {blog.shortDesc && (
            <div className="Blog-Details-Lead-Excerpt">
              {blog.shortDesc}
            </div>
          )}

          {/* Rich Content Render */}
          <div
            className="Blog-Details-Rich-Content"
            dangerouslySetInnerHTML={{ __html: blogContent }}
          />

          {/* Blockquote Section (if quotes present) */}
          {blog.quotes && (
            <blockquote className="Blog-Details-Quote-Box">
              <FontAwesomeIcon icon={faQuoteLeft} className="Blog-Details-Quote-Icon" />
              <p className="Blog-Details-Quote-Text">{blog.quotes}</p>
            </blockquote>
          )}

          {/* Post Tags */}
          {tags.length > 0 && (
            <div className="Blog-Details-Tags-Section">
              <span className="Blog-Details-Tags-Label">
                <FontAwesomeIcon icon={faTag} /> Article Tags:
              </span>
              <div className="Blog-Details-Tags-List">
                {tags.map((tag, idx) => (
                  <span key={idx} className="Blog-Details-Tag-Pill">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Share Bar */}
          <div className="Blog-Details-Share-Section">
            <div className="Blog-Share-Header">
              <FontAwesomeIcon icon={faShareNodes} />
              <span>Share this Article:</span>
            </div>
            <div className="Blog-Share-Buttons-Grid">
              <button
                className="Blog-Share-Btn fb"
                onClick={handleShareFacebook}
                title="Share on Facebook"
              >
                <FontAwesomeIcon icon={['fab', 'facebook-f']} /> Facebook
              </button>
              <button
                className="Blog-Share-Btn x"
                onClick={handleShareTwitter}
                title="Share on X"
              >
                <FontAwesomeIcon icon={['fab', 'twitter']} /> X / Twitter
              </button>
              <button
                className="Blog-Share-Btn linkedin"
                onClick={handleShareLinkedIn}
                title="Share on LinkedIn"
              >
                <FontAwesomeIcon icon={['fab', 'linkedin-in']} /> LinkedIn
              </button>
              <button
                className="Blog-Share-Btn wa"
                onClick={handleShareWhatsApp}
                title="Share on WhatsApp"
              >
                <FontAwesomeIcon icon={['fab', 'whatsapp']} /> WhatsApp
              </button>
              <button
                className="Blog-Share-Btn telegram"
                onClick={handleShareTelegram}
                title="Share on Telegram"
              >
                <FontAwesomeIcon icon={['fab', 'telegram-plane']} /> Telegram
              </button>
              <button
                className="Blog-Share-Btn email"
                onClick={handleShareEmail}
                title="Share via Email"
              >
                <FontAwesomeIcon icon={faEnvelope} /> Email
              </button>
              <button
                className={`Blog-Share-Btn copy ${copiedLink ? 'copied' : ''}`}
                onClick={handleCopyLink}
                title="Copy Link"
              >
                <FontAwesomeIcon icon={copiedLink ? faCheck : faLink} />{' '}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Author Card Box */}
          <div className="Blog-Details-Author-Box">
            <div className="Blog-Author-Box-Avatar">{getInitials(authorName)}</div>
            <div className="Blog-Author-Box-Info">
              <span className="Blog-Author-Box-Badge">Article Contributor</span>
              <h4 className="Blog-Author-Box-Name">{authorName}</h4>
              {authorDesignation && (
                <p className="Blog-Author-Box-Desig">{authorDesignation}</p>
              )}
              {blog.email && (
                <p className="Blog-Author-Box-Email">
                  <FontAwesomeIcon icon={faEnvelope} />{' '}
                  <a href={`mailto:${blog.email}`}>{blog.email}</a>
                </p>
              )}
            </div>
          </div>

          {/* Feedback & Suggestions Form */}
          <div className="Blog-Details-Feedback-Card">
            <div className="Blog-Feedback-Header">
              <FontAwesomeIcon icon={faCommentDots} className="Blog-Feedback-Icon" />
              <div>
                <h3>Share Your Thoughts & Feedback</h3>
                <p>Have something to add or suggest? We’d love to hear your insights.</p>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="Blog-Feedback-Form">
              <div className="Blog-Feedback-Form-Row">
                <div className="Blog-Form-Group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="Blog-Form-Group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="yourname@example.com"
                    required
                  />
                </div>
              </div>

              <div className="Blog-Feedback-Form-Row">
                <div className="Blog-Form-Group">
                  <label>Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+91 00000 00000"
                  />
                </div>
                <div className="Blog-Form-Group">
                  <label>Subject (Optional)</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    placeholder="Regarding this article"
                  />
                </div>
                <div className="Blog-Form-Group">
                  <label>Location (Optional)</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div className="Blog-Form-Group">
                <label>Your Message / Feedback *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Write your constructive thoughts or queries here..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="Blog-Feedback-Submit-Btn"
                disabled={submittingFeedback}
              >
                {submittingFeedback ? 'Submitting...' : 'Submit Feedback →'}
              </button>
            </form>

            {feedbackMessage.text && (
              <div
                className={`Blog-Feedback-Alert ${
                  feedbackMessage.type === 'success' ? 'success' : 'error'
                }`}
              >
                {feedbackMessage.text}
              </div>
            )}
          </div>
        </article>

        {/* RIGHT COLUMN: SIDEBAR */}
        <aside className="Blog-Details-Sidebar-Area">
          {/* Search Widget */}
          <div className="Blog-Details-Widget">
            <h4 className="Blog-Widget-Title">Search Articles</h4>
            <form onSubmit={handleSearchSubmit} className="Blog-Widget-Search-Form">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search topics..."
                className="Blog-Widget-Search-Input"
              />
              <button type="submit" className="Blog-Widget-Search-Btn">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>

          {/* Categories Widget */}
          <div className="Blog-Details-Widget">
            <h4 className="Blog-Widget-Title">All Categories</h4>
            <div className="Blog-Widget-Category-List">
              {categories
                .slice(0, showAllCategories ? categories.length : 6)
                .map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/blog?category=${encodeURIComponent(cat.name)}`}
                    className={`Blog-Widget-Category-Item ${
                      cat.name === categoryName ? 'active' : ''
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="Blog-Widget-Cat-Badge">Explore</span>
                  </Link>
                ))}
            </div>
            {categories.length > 6 && (
              <button
                className="Blog-Widget-Toggle-Btn"
                onClick={() => setShowAllCategories(!showAllCategories)}
              >
                {showAllCategories ? 'View Less' : `View All (${categories.length})`}
              </button>
            )}
          </div>

          {/* Recent Articles Widget */}
          {recentPosts.length > 0 && (
            <div className="Blog-Details-Widget">
              <h4 className="Blog-Widget-Title">Recent Highlights</h4>
              <div className="Blog-Widget-Recent-List">
                {recentPosts.map((post) => {
                  const rTitle = post.title || post.blogTitle || 'Untitled';
                  const rImage = post.image || post.imageUrl || rp;
                  const rDate = new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  return (
                    <Link
                      to={`/blog/${post.slug || post._id}`}
                      key={post._id}
                      className="Blog-Widget-Recent-Item"
                    >
                      <img
                        src={rImage}
                        alt={rTitle}
                        className="Blog-Widget-Recent-Thumb"
                        onError={(e) => {
                          e.target.src = rp;
                        }}
                      />
                      <div className="Blog-Widget-Recent-Body">
                        <span className="Blog-Widget-Recent-Date">📅 {rDate}</span>
                        <h5 className="Blog-Widget-Recent-Title">{rTitle}</h5>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Popular Tags Widget */}
          {tags.length > 0 && (
            <div className="Blog-Details-Widget">
              <h4 className="Blog-Widget-Title">Related Tags</h4>
              <div className="Blog-Widget-Tag-Cloud">
                {tags.map((tag, idx) => (
                  <Link
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    key={idx}
                    className="Blog-Widget-Tag-Pill"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Community Feedback / Comments Widget */}
          <div className="Blog-Details-Widget">
            <h4 className="Blog-Widget-Title">Community Feedback</h4>
            {loadingComments ? (
              <p className="Blog-Widget-Empty-Text">Loading feedback...</p>
            ) : comments.length === 0 ? (
              <p className="Blog-Widget-Empty-Text">
                No feedback published yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="Blog-Widget-Comments-List">
                {comments.slice(0, 5).map((cmt) => {
                  const isExpanded = expandedComments[cmt._id] || false;
                  const messageText = cmt.message || '';
                  const shortMsg =
                    messageText.length > 90
                      ? messageText.substring(0, 90) + '...'
                      : messageText;

                  return (
                    <div key={cmt._id} className="Blog-Widget-Comment-Card">
                      <div className="Blog-Comment-User-Row">
                        <div className="Blog-Comment-Avatar">
                          {getInitials(cmt.name || 'User')}
                        </div>
                        <div>
                          <strong className="Blog-Comment-Name">{cmt.name || 'Anonymous'}</strong>
                          {cmt.address && (
                            <span className="Blog-Comment-Loc">📍 {cmt.address}</span>
                          )}
                        </div>
                      </div>
                      <p className="Blog-Comment-Msg">
                        {isExpanded ? messageText : shortMsg}
                      </p>
                      {messageText.length > 90 && (
                        <button
                          className="Blog-Comment-ReadMore-Btn"
                          onClick={() => toggleReadMore(cmt._id)}
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
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