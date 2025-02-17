import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "./Testimonials.css";

import profile1 from "../../assets/profile-pic.png";
import profile2 from "../../assets/profile-pic.png";
import profile3 from "../../assets/profile-pic.png";
import profile4 from "../../assets/profile-pic.png";
import profile5 from "../../assets/profile-pic.png";
import profile6 from "../../assets/profile-pic.png";
import profile7 from "../../assets/profile-pic.png";
import profile8 from "../../assets/profile-pic.png";
import profile9 from "../../assets/profile-pic.png";
import profile10 from "../../assets/profile-pic.png";

const reviews = [
  { name: "Dianne Russell", role: "Founder", image: profile1 },
  { name: "Priscilla Lucas", role: "Founder", image: profile2 },
  { name: "James Anderson", role: "CEO", image: profile3 },
  { name: "Sophia Patel", role: "Manager", image: profile4 },
  { name: "Michael Chen", role: "Entrepreneur", image: profile5 },
  { name: "Emma Johnson", role: "Developer", image: profile6 },
  { name: "William Brown", role: "Designer", image: profile7 },
  { name: "Olivia Wilson", role: "Marketer", image: profile8 },
  { name: "Liam Martinez", role: "Consultant", image: profile9 },
  { name: "Isabella Thomas", role: "Freelancer", image: profile10 },
];

const Testimonials = () => {
  return (
    <section className="Testimonials-section">
      <div className="Testimonials-header">
        <h2>What people say's about us</h2>
      </div>
      
      <div className="Testimonials-desktop">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={2}
          spaceBetween={20}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="Testimonials-card">
              <div className="Testimonials-cardHeader">
                <img src={review.image} alt={review.name} className="Testimonials-avatar" />
                <div>
                  <h4>{review.name}</h4>
                  <p>{review.role}</p>
                </div>
              </div>
              <p className="Testimonials-text">
                Campoal is great for people to bring changes to what they believe in, it's nice to see some good morals and common sense being acknowledged where modern governments fail.
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <div className="Testimonials-mobile">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={10}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="Testimonials-card">
              <div className="Testimonials-cardHeader">
                <img src={review.image} alt={review.name} className="Testimonials-avatar" />
                <div>
                  <h4>{review.name}</h4>
                  <p>{review.role}</p>
                </div>
              </div>
              <p className="Testimonials-text">
                Campoal is great for people to bring changes to what they believe in, it's nice to see some good morals and common sense being acknowledged where modern governments fail.
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
