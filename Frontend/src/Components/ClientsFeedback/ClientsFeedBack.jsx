import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Assets
import Client1 from "../../assets/client-1.jpg";
import Client2 from "../../assets/client-2.jpg";
import Client3 from "../../assets/client-3.jpg";
import Client4 from "../../assets/client-4.jpg";
import Client5 from "../../assets/client-5.jpg";
import Client6 from "../../assets/client-6.jpg";

import "./ClientsFeedBack.css";

const feedbacks = [
  {
    id: 1,
    name: "James Carter",
    role: "Selling Agents",
    feedback: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua.",
    image: Client1,
  },
  {
    id: 2,
    name: "Jacob William",
    role: "Selling Agents",
    feedback: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua.",
    image: Client2,
  },
  {
    id: 3,
    name: "Kelian Anderson",
    role: "Selling Agents",
    feedback: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua.",
    image: Client3,
  },
  {
    id: 4,
    name: "Sarah Johnson",
    role: "Selling Agents",
    feedback: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua.",
    image: Client4,
  },
  {
    id: 5,
    name: "Michael Brown",
    role: "Selling Agents",
    feedback: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua.",
    image: Client5,
  },
  {
    id: 6,
    name: "Emily Davis",
    role: "Selling Agents",
    feedback: "Precious ipsum dolor sit amet consectetur adipisicing elit, sed dos mod tempor incididunt ut labore et dolore magna aliqua.",
    image: Client6,
  },
];

const ClientFeedBack = () => {
  return (
    <div className="full-feedback-sec">
      <div className="client-feedback">
        <h2 className="client-section-title">Clients Feedback</h2>
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          pagination={{ clickable: true }}
          className="feedback-swiper"
          breakpoints={{
            // For mobile screens
            0: {
              slidesPerView: 1,
            },
            // For tablets
            768: {
              slidesPerView: 2,
            },
            // For desktops
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {feedbacks.map((client) => (
            <SwiperSlide key={client.id}>
              <div className="feedback-card">
                <p className="feedback-text">&ldquo;{client.feedback}&rdquo;</p>
                <div className="client-info">
                  <img src={client.image} alt={client.name} className="client-image" />
                  <div>
                    <h3 className="client-name">{client.name}</h3>
                    <p className="client-role">{client.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ClientFeedBack;
