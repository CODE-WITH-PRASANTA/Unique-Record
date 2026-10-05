import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./MeetOurAgent.css";
import { API_URL } from "../../Api";

// Icons
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaUser } from "react-icons/fa";
import { MdCall, MdEmail } from "react-icons/md";

// Swiper imports
import { Swiper as AgentSwiper, SwiperSlide as AgentSwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const MeetOurAgent = () => {
  const [agents, setAgents] = useState([]);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${API_URL}/teams`);
        const data = response.data;
        if (Array.isArray(data)) {
          setAgents(data);
        } else if (data && Array.isArray(data.data)) {
          setAgents(data.data);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        try {
          const res = await axios.get(`${API_URL}/team/all`);
          const d = res.data;
          if (Array.isArray(d)) {
            setAgents(d);
          } else if (d && Array.isArray(d.data)) {
            setAgents(d.data);
          }
        } catch (fallbackErr) {
          console.error("Fallback error fetching team members:", fallbackErr);
        }
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="meetouragent">
      <div ref={sectionRef} className={`meet-our-agent ${isVisible ? "animate" : ""}`}>
        <h3>OUR TEAMS</h3>
        <h2>Meet Our Team</h2>

        <div className="agents-container">
          {/* Mobile View: Swiper */}
          <div className="meet-mobile-view">
            <AgentSwiper
              spaceBetween={20}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              breakpoints={{
                0: { slidesPerView: 1 }, // Mobile view
                768: { slidesPerView: 2 }, // Tablet view
                1024: { slidesPerView: 3 }, // Desktop view
              }}
              className="agent-swiper"
            >
              {agents.map((agent, index) => {
                const memberName = agent.name || agent.memberName || "Team Member";
                const memberPhone = agent.phone || agent.phoneNumber;
                const memberEmail = agent.email;
                const memberPhoto = agent.profilePic || defaultAvatar;

                return (
                  <AgentSwiperSlide key={agent._id || agent.id || index}>
                    <div className="agent-card">
                      <div className="agent-image">
                        <img
                          src={memberPhoto}
                          alt={memberName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultAvatar;
                          }}
                        />
                        {(agent.facebook || agent.twitter || agent.linkedin || agent.instagram) && (
                          <div className="meet-social-icons">
                            {agent.facebook && (
                              <a href={agent.facebook} target="_blank" rel="noopener noreferrer">
                                <FaFacebookF />
                              </a>
                            )}
                            {agent.twitter && (
                              <a href={agent.twitter} target="_blank" rel="noopener noreferrer">
                                <FaTwitter />
                              </a>
                            )}
                            {agent.linkedin && (
                              <a href={agent.linkedin} target="_blank" rel="noopener noreferrer">
                                <FaLinkedinIn />
                              </a>
                            )}
                            {agent.instagram && (
                              <a href={agent.instagram} target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="agent-info">
                        <h4>{memberName}</h4>
                        <p>{agent.designation || "Executive"}</p>
                        <div className="contact-icons">
                          {memberPhone && (
                            <a href={`tel:${memberPhone}`} title="Call">
                              <MdCall />
                            </a>
                          )}
                          {memberEmail && (
                            <a href={`mailto:${memberEmail}`} title="Email">
                              <MdEmail />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </AgentSwiperSlide>
                );
              })}
            </AgentSwiper>
          </div>

          {/* Desktop & Tablet View: Grid */}
          <div className="desktop-tablet-view">
            {agents.map((agent, index) => {
              const memberName = agent.name || agent.memberName || "Team Member";
              const memberPhone = agent.phone || agent.phoneNumber;
              const memberEmail = agent.email;
              const memberPhoto = agent.profilePic || defaultAvatar;

              return (
                <div
                  className={`agent-card ${isVisible ? "animate-card" : ""}`}
                  key={agent._id || agent.id || index}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="agent-image">
                    <img
                      src={memberPhoto}
                      alt={memberName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultAvatar;
                      }}
                    />
                    {(agent.facebook || agent.twitter || agent.linkedin || agent.instagram) && (
                      <div className="meet-social-icons">
                        {agent.facebook && (
                          <a href={agent.facebook} target="_blank" rel="noopener noreferrer">
                            <FaFacebookF />
                          </a>
                        )}
                        {agent.twitter && (
                          <a href={agent.twitter} target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                          </a>
                        )}
                        {agent.linkedin && (
                          <a href={agent.linkedin} target="_blank" rel="noopener noreferrer">
                            <FaLinkedinIn />
                          </a>
                        )}
                        {agent.instagram && (
                          <a href={agent.instagram} target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="agent-info">
                    <h4>{memberName}</h4>
                    <p>{agent.designation || "Executive"}</p>
                    <div className="contact-icons">
                      {memberPhone && (
                        <a href={`tel:${memberPhone}`} title="Call">
                          <MdCall />
                        </a>
                      )}
                      {memberEmail && (
                        <a href={`mailto:${memberEmail}`} title="Email">
                          <MdEmail />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetOurAgent;
