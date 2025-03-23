import React, { useEffect, useRef, useState } from "react";
import "./MeetOurAgent.css";
import { API_URL } from "../../Api"; // Adjust path if needed


// Icons
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
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
        const response = await fetch(`${API_URL}/team/all`);
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error("Error fetching team members:", error);
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
      { threshold: 0.3 }
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
              {agents.map((agent) => (
                <AgentSwiperSlide key={agent._id}>
                  <div className="agent-card">
                    <div className="agent-image">
                      <img src={agent.profilePic} alt={agent.memberName} />
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
                    </div>
                    <div className="agent-info">
                      <h4>{agent.memberName}</h4>
                      <p>{agent.designation}</p>
                      <div className="contact-icons">
                        <a href={`tel:${agent.phoneNumber}`}>
                          <MdCall />
                        </a>
                        <a href={`mailto:${agent.email}`}>
                          <MdEmail />
                        </a>
                      </div>
                    </div>
                  </div>
                </AgentSwiperSlide>
              ))}
            </AgentSwiper>
          </div>

          {/* Desktop & Tablet View: Grid */}
          <div className="desktop-tablet-view">
            {agents.map((agent, index) => (
              <div
                className={`agent-card ${isVisible ? "animate-card" : ""}`}
                key={agent._id}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="agent-image">
                  <img src={agent.profilePic} alt={agent.memberName} />
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
                </div>
                <div className="agent-info">
                  <h4>{agent.memberName}</h4>
                  <p>{agent.designation}</p>
                  <div className="contact-icons">
                    <a href={`tel:${agent.phoneNumber}`}>
                      <MdCall />
                    </a>
                    <a href={`mailto:${agent.email}`}>
                      <MdEmail />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetOurAgent;
