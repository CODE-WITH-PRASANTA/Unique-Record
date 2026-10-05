import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './OurAchivmentsRecords.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faArrowRight,
  faTrophy,
  faCalendarAlt,
  faUser,
  faBuilding,
  faTimes,
  faMedal,
  faExternalLinkAlt,
  faLayerGroup,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../../Api';

const OurAchievementsRecords = () => {
  const [achievements, setAchievements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEffort, setSelectedEffort] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch Achievements & Categories with axios
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Fetch published achievements
      const achRes = await axios.get(`${API_URL}/achievements/get-published-achievements`);
      const achList = Array.isArray(achRes.data)
        ? achRes.data
        : achRes.data?.data || [];
      setAchievements(achList);

      // 2. Fetch only ACTIVE achievement categories from database
      const categoryNames = [];
      try {
        const achCatRes = await axios.get(
          `${API_URL}/achievement-categories?status=Active`
        );
        const achCatList = Array.isArray(achCatRes.data)
          ? achCatRes.data
          : achCatRes.data?.data || [];
        
        achCatList
          .filter((c) => !c.status || c.status.toLowerCase() === 'active')
          .forEach((c) => {
            const n = typeof c === 'string' ? c : c.name;
            if (n) categoryNames.push(n);
          });
      } catch (e) {
        console.warn('achievement-categories fetch note:', e.message);
      }

      // If database has no categories yet, fallback to categories from active achievements
      if (categoryNames.length === 0) {
        achList.forEach((a) => {
          if (a.category) categoryNames.push(a.category);
        });
      }

      const uniqueCats = [...new Set(categoryNames.filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      );
      setCategories(uniqueCats);
    } catch (err) {
      console.error('Error loading achievements via axios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Truncate helper
  const truncateText = (text, limit = 22) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
  };

  // Toggle Read More state for a post
  const toggleExpand = (id) => {
    setAchievements((prev) =>
      prev.map((item) => {
        const itemId = item._id || item.id;
        if (itemId === id) {
          return { ...item, expanded: !item.expanded };
        }
        return item;
      })
    );
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: achievements.length };
    achievements.forEach((a) => {
      const cat = a.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [achievements]);

  // Filtered Achievements list
  const filteredAchievements = useMemo(() => {
    return achievements.filter((a) => {
      const matchCat =
        selectedCategory === 'All' ||
        (a.category && a.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchEffort =
        selectedEffort === 'All' ||
        (a.effortType && a.effortType.toLowerCase() === selectedEffort.toLowerCase());

      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        a.title?.toLowerCase().includes(query) ||
        a.achieverName?.toLowerCase().includes(query) ||
        a.providerName?.toLowerCase().includes(query) ||
        a.shortDescription?.toLowerCase().includes(query) ||
        a.shortDesc?.toLowerCase().includes(query) ||
        (Array.isArray(a.tags) && a.tags.some((t) => t.toLowerCase().includes(query)));

      return matchCat && matchEffort && matchSearch;
    });
  }, [achievements, selectedCategory, selectedEffort, searchTerm]);

  return (
    <div className="ur-achieve-wrapper">
      <div className="ur-achieve-container">
        {/* TOP SEARCH & FILTER CONTROLS */}
        <section className="ur-top-controls">
          <div className="ur-search-input-box">
            <FontAwesomeIcon icon={faSearch} className="ur-search-icon" />
            <input
              type="text"
              placeholder="Search by title, achiever name, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="ur-search-clear-btn"
                onClick={() => setSearchTerm('')}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          <div className="ur-effort-filter-group">
            <span>Effort:</span>
            {['All', 'Individual', 'Team', 'Organizational'].map((effort) => (
              <button
                type="button"
                key={effort}
                className={`ur-effort-btn ${selectedEffort === effort ? 'active' : ''}`}
                onClick={() => setSelectedEffort(effort)}
              >
                {effort}
              </button>
            ))}
          </div>
        </section>

        {/* CATEGORY FILTER TABS */}
        <section className="ur-category-bar">
          <div className="ur-category-bar-label">
            <FontAwesomeIcon icon={faLayerGroup} />
            <span>Categories</span>
          </div>

          <div className="ur-category-pills-list">
            <button
              type="button"
              className={`ur-cat-tab ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('All')}
            >
              <span>All</span>
              <span className="ur-cat-badge">{categoryCounts['All'] || 0}</span>
            </button>

            {categories.map((cat, idx) => {
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  type="button"
                  key={idx}
                  className={`ur-cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>{cat}</span>
                  {count > 0 && <span className="ur-cat-badge">{count}</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* RESET FILTERS (IF ACTIVE) */}
        {(selectedCategory !== 'All' || selectedEffort !== 'All' || searchTerm) && (
          <div className="ur-results-bar">
            <button
              type="button"
              className="ur-clear-filters-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedEffort('All');
                setSearchTerm('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* MAIN ACHIEVEMENTS GRID */}
        {loading ? (
          <div className="ur-loading-box">
            <div className="ur-spinner" />
            <p>Loading achievements from database...</p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="ur-empty-box">
            <FontAwesomeIcon icon={faTrophy} className="ur-empty-icon" />
            <h3>No Achievements Found</h3>
            <p>
              There are no records matching your selected category or search keywords.
            </p>
            <button
              type="button"
              className="ur-btn-reset-all"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedEffort('All');
                setSearchTerm('');
              }}
            >
              View All Achievements
            </button>
          </div>
        ) : (
          <div className="ur-cards-grid">
            {filteredAchievements.map((item) => {
              const itemId = item._id || item.id;
              const imageSrc = item.image || item.imageUrl;
              const desc = item.shortDescription || item.shortDesc || '';
              const isExpanded = item.expanded || false;

              const itemTags = Array.isArray(item.tags)
                ? item.tags
                : typeof item.tags === 'string'
                ? item.tags.split(',').map((t) => t.trim()).filter(Boolean)
                : [];

              const targetSlug =
                item.slug ||
                (item.title ? item.title.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-') : itemId);

              return (
                <div key={itemId} className="ur-record-card">
                  {/* CARD IMAGE & OVERLAY */}
                  <div className="ur-record-thumb-wrap">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={item.title}
                        className="ur-record-thumb"
                        onClick={() => setPreviewImage(imageSrc)}
                      />
                    ) : (
                      <div className="ur-record-thumb-ph">
                        <FontAwesomeIcon icon={faMedal} />
                        <span>Unique Record</span>
                      </div>
                    )}

                    {/* BADGES */}
                    <div className="ur-thumb-badges">
                      <span className="ur-pill-cat">
                        <FontAwesomeIcon icon={faTrophy} /> {item.category || 'Record'}
                      </span>
                      {item.effortType && (
                        <span className="ur-pill-effort">{item.effortType}</span>
                      )}
                    </div>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="ur-record-content">
                    {/* META: DATE & ACHIEVER */}
                    <div className="ur-record-meta">
                      <span className="ur-meta-date">
                        <FontAwesomeIcon icon={faCalendarAlt} />{' '}
                        {moment(item.createdAt).format('MMMM DD, YYYY')}
                      </span>
                      {item.achieverName && (
                        <span className="ur-meta-achiever">
                          <FontAwesomeIcon icon={faUser} /> {item.achieverName}
                        </span>
                      )}
                    </div>

                    {/* TITLE */}
                    <h3 className="ur-record-title">
                      <Link to={`/archivement/${targetSlug}`}>{item.title}</Link>
                    </h3>

                    {/* PROVIDER */}
                    {item.providerName && (
                      <div className="ur-record-provider">
                        <FontAwesomeIcon icon={faBuilding} />
                        <span>Presented by: <strong>{item.providerName}</strong></span>
                        <FontAwesomeIcon icon={faCheckCircle} className="ur-verified-icon" />
                      </div>
                    )}

                    {/* DESCRIPTION */}
                    <p className="ur-record-desc">
                      {isExpanded ? desc : truncateText(desc, 22)}
                    </p>

                    {desc && desc.split(/\s+/).length > 22 && (
                      <button
                        type="button"
                        className="ur-expand-btn"
                        onClick={() => toggleExpand(itemId)}
                      >
                        {isExpanded ? 'Show Less' : 'Read More'}
                      </button>
                    )}

                    {/* TAGS */}
                    {itemTags.length > 0 && (
                      <div className="ur-record-tags">
                        {itemTags.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="ur-tag-chip">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="ur-record-actions">
                      <Link
                        to={`/archivement/${targetSlug}`}
                        className="ur-btn-enroll"
                      >
                        <span>Enroll Now</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Link>

                      {item.uruHolderLink && (
                        <a
                          href={item.uruHolderLink}
                          target="_blank"
                          rel="noreferrer"
                          className="ur-btn-holder"
                          title="View URU Record Holder Details"
                        >
                          <span>Holder Details</span>
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="ur-img-modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="ur-img-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ur-img-modal-close"
              onClick={() => setPreviewImage(null)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <img src={previewImage} alt="Enlarged Record Proof" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OurAchievementsRecords;
