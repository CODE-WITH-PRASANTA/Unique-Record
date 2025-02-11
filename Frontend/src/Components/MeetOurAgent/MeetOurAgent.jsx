import React, { useEffect, useRef, useState } from "react";
import "./MeetOurAgent.css";

// Icons
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdCall, MdEmail } from "react-icons/md";

// Assets
import Agent1 from "../../assets/agent-1.jpg";
import Agent2 from "../../assets/agent-2.jpg";
import Agent3 from "../../assets/agent-3.jpg";
import Agent4 from "../../assets/agent-4.jpg";

// Swiper imports
import { Swiper as AgentSwiper, SwiperSlide as AgentSwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const initialAgents = [
  { id: 1, name: "Chris Patt", role: "Administrative Staff", img: Agent1 },
  { id: 2, name: "Marvin McKinney", role: "Administrative Staff", img: Agent2 },
  { id: 3, name: "Wade Warren", role: "Administrative Staff", img: Agent3 },
  { id: 4, name: "Devon Lane", role: "Administrative Staff", img: Agent4 },
];

const MeetOurAgent = () => {
  const [agents, setAgents] = useState(initialAgents);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
              <AgentSwiperSlide key={agent.id}>
                <div className="agent-card">
                  <div className="agent-image">
                    <img src={agent.img} alt={agent.name} />
                    <div className="meet-social-icons">
                      <a href="#">
                        <FaFacebookF />
                      </a>
                      <a href="#">
                        <FaTwitter />
                      </a>
                      <a href="#">
                        <FaLinkedinIn />
                      </a>
                      <a href="#">
                        <FaInstagram />
                      </a>
                    </div>
                  </div>
                  <div className="agent-info">
                    <h4>{agent.name}</h4>
                    <p>{agent.role}</p>
                    <div className="contact-icons">
                      <a href="#">
                        <MdCall />
                      </a>
                      <a href="#">
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
              key={agent.id}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="agent-image">
                <img src={agent.img} alt={agent.name} />
                <div className="meet-social-icons">
                  <a href="#">
                    <FaFacebookF />
                  </a>
                  <a href="#">
                    <FaTwitter />
                  </a>
                  <a href="#">
                    <FaLinkedinIn />
                  </a>
                  <a href="#">
                    <FaInstagram />
                  </a>
                </div>
              </div>
              <div className="agent-info">
                <h4>{agent.name}</h4>
                <p>{agent.role}</p>
                <div className="contact-icons">
                  <a href="#">
                    <MdCall />
                  </a>
                  <a href="#">
                    <MdEmail />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="footer-text">
        Become an agent and get the commission you deserve. <a href="#">Contact us</a>
      </p>
    </div>
    </div>
  );
};

export default MeetOurAgent;
