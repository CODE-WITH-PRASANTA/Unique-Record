import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Api";
import DOMPurify from 'dompurify';
import {
  Calendar,
  MapPin,
  Tag,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Swal from 'sweetalert2';
import "./AllEvents.css";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const sharedEventId = queryParams.get("eventId");

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const fetchOngoingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      let res = await axios.get(`${API_URL}/events/status/Ongoing`);
      let list = res.data?.events || res.data?.data || [];
      
      if (!list || list.length === 0) {
        res = await axios.get(`${API_URL}/events`);
        list = res.data?.events || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      }
      
      setEvents(list);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Unable to connect to the event servers. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOngoingEvents();
  }, []);

  const handleRegister = (eventId, eventName, eventPrice) => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const targetUrl = `/event/register?eventId=${eventId}&eventName=${encodeURIComponent(eventName)}&eventPrice=${eventPrice || 0}`;

    if (!token) {
      navigate("/login", {
        state: {
          from: targetUrl
        }
      });
    } else {
      navigate(targetUrl);
    }
  };

  const toggleReadMore = (eventId) => {
    setExpanded((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const truncateText = (text, wordLimit = 35) => {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    const words = plainText.split(/\s+/);
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return plainText;
  };

  useEffect(() => {
    if (!loading && sharedEventId) {
      const element = document.getElementById(`event-${sharedEventId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [loading, sharedEventId]);

  const handleShare = async (event) => {
    const shareUrl = `${window.location.origin}/all-events?eventId=${event._id || event.id}`;
    const shareText = `🌟 Check out this event: ${event.eventName}\n📅 Date: ${formatDate(event.eventDate)}\n📍 Location: ${event.eventLocation || 'TBA'}\n🔗 ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.eventName,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Share canceled or failed', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        Swal.fire({
          icon: 'success',
          title: 'Link Copied!',
          text: 'Event share link copied to clipboard.',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } catch {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  // Categories extraction
  const categories = useMemo(() => {
    const set = new Set();
    events.forEach(e => {
      if (e.category) set.add(e.category);
      if (e.eventCategory) set.add(e.eventCategory);
    });
    return ['All', ...Array.from(set)];
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchSearch = !searchTerm || 
        e.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.eventLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.eventOrganizer?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryVal = e.category || e.eventCategory;
      const matchCategory = categoryFilter === 'All' || categoryVal === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [events, searchTerm, categoryFilter]);

  return (
    <div className="ae-wrapper">
      {/* Background ambient light */}
      <div className="ae-ambient-glow"></div>

      <div className="ae-container">
        {/* Hero Header */}
        <div className="ae-hero-header">
          <div className="ae-badge">
            <Sparkles size={16} /> Official Record Events
          </div>
          <h1 className="ae-main-title">
            Explore Ongoing Official Events & Programs
          </h1>
          <p className="ae-main-desc">
            Participate in grand record events conducted by <strong>Unique Records of Universe</strong> & <strong>DPKHRC Trust</strong>. Register online and establish your achievement.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="ae-toolbar">
          <div className="ae-search-box">
            <Search size={18} className="ae-search-icon" />
            <input
              type="text"
              placeholder="Search events by title, organizer, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                type="button" 
                className="ae-clear-search" 
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          {categories.length > 1 && (
            <div className="ae-category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`ae-category-chip ${categoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="ae-skeleton-grid">
            {[1, 2].map((n) => (
              <div key={n} className="ae-skeleton-card">
                <div className="ae-skeleton-img"></div>
                <div className="ae-skeleton-content">
                  <div className="ae-skeleton-line ae-sk-title"></div>
                  <div className="ae-skeleton-line ae-sk-sub"></div>
                  <div className="ae-skeleton-line ae-sk-desc"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="ae-state-box ae-error-box">
            <p>{error}</p>
            <button type="button" className="ae-retry-btn" onClick={fetchOngoingEvents}>
              Retry Loading Events
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="ae-state-box">
            <Calendar size={48} color="#94a3b8" />
            <h3>No Events Found</h3>
            <p>We couldn't find any ongoing events matching your search criteria.</p>
            {(searchTerm || categoryFilter !== 'All') && (
              <button 
                type="button" 
                className="ae-retry-btn"
                onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Events List */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="ae-cards-grid">
            {filteredEvents.map((event, index) => {
              const isExpanded = !!expanded[event._id || event.id];
              const price = event.pricePerTicket !== undefined 
                ? event.pricePerTicket 
                : (event.registrationFee !== undefined ? event.registrationFee : 0);

              return (
                <div
                  key={event._id || event.id}
                  id={`event-${event._id || event.id}`}
                  className="ae-card"
                >
                  {/* Left Media Container */}
                  <div className="ae-media-wrap">
                    <img
                      src={event.eventImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'}
                      alt={event.eventName}
                      className="ae-card-img"
                      loading="lazy"
                    />
                    <div className="ae-status-pill">
                      <span className="ae-live-dot"></span>
                      <span>Registration Open</span>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="ae-card-body">
                    <div className="ae-card-top-row">
                      <span className="ae-event-tag">
                        <Tag size={12} /> Event #{filteredEvents.length - index}
                      </span>
                      <div className="ae-fee-tag">
                        <span>Fee</span>
                        <strong>₹{price}</strong>
                      </div>
                    </div>

                    <h2 className="ae-event-title">{event.eventName}</h2>

                    <div className="ae-meta-grid">
                      {event.eventOrganizer && (
                        <div className="ae-meta-item">
                          <Building2 size={16} className="ae-meta-icon" />
                          <div>
                            <span className="ae-meta-label">Organizer</span>
                            <span className="ae-meta-val">{event.eventOrganizer}</span>
                          </div>
                        </div>
                      )}

                      <div className="ae-meta-item">
                        <Calendar size={16} className="ae-meta-icon" />
                        <div>
                          <span className="ae-meta-label">Event Date</span>
                          <span className="ae-meta-val">{formatDate(event.eventDate)}</span>
                        </div>
                      </div>

                      <div className="ae-meta-item">
                        <MapPin size={16} className="ae-meta-icon" />
                        <div>
                          <span className="ae-meta-label">Location</span>
                          <span className="ae-meta-val">{event.eventLocation || 'Online / Offline Venue'}</span>
                        </div>
                      </div>

                      <div className="ae-meta-item">
                        <Clock size={16} className="ae-meta-icon" />
                        <div>
                          <span className="ae-meta-label">Registration Window</span>
                          <span className="ae-meta-val">
                            {formatDate(event.openingDate)} – {formatDate(event.closingDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {event.eventDescription && (
                      <div className="ae-desc-container">
                        <div
                          className="ae-desc-text"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              isExpanded 
                                ? event.eventDescription 
                                : truncateText(event.eventDescription, 35)
                            ),
                          }}
                        />
                        {event.eventDescription.replace(/<[^>]*>/g, '').split(/\s+/).length > 35 && (
                          <button
                            type="button"
                            className="ae-expand-btn"
                            onClick={() => toggleReadMore(event._id || event.id)}
                          >
                            {isExpanded ? (
                              <><span>Read Less</span> <ChevronUp size={14} /></>
                            ) : (
                              <><span>Read Full Details</span> <ChevronDown size={14} /></>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="ae-card-actions">
                      <button
                        type="button"
                        className="ae-register-btn"
                        onClick={() => handleRegister(event._id || event.id, event.eventName, price)}
                      >
                        <span>Register & Apply</span>
                        <ArrowRight size={18} />
                      </button>

                      <button
                        type="button"
                        className="ae-share-btn"
                        title="Share this event"
                        onClick={() => handleShare(event)}
                      >
                        <Share2 size={16} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
