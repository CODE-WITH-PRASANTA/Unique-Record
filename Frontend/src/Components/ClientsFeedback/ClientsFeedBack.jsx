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
    name: "S. Anandakrishnan",
    role: "Keen Participant",
    feedback: "I really like the idea that Unique Records of Universe records records in more than 100 categories. This diversity gives everyone a chance to showcase their talent. The idea of ​​digital certificates is also great, it is modern and secure.",
    image: Client1,
  },
  {
    id: 2,
    name: "Rajesh Ratan Bhardwaj",
    role: "Social Worker",
    feedback: "I appreciate the emphasis on social and humanitarian categories. It is not just about physical or scientific achievements, but also about honoring people who are working to make the world a better place. The point that 'in no way endangers life and encourages record-making' is great." ,
    image: Client2,
  },
  {
    id: 3,
    name: "Gundal Vijay Kumar ",
    role: "Technician",
    feedback: "The digital certificate initiative by Unique Records of Universe is a great innovation. It is not only secure, but also easy to share and verify.  Checking the authenticity of records through QR code is a very modern method." ,
    image: Client3,
  },
  {
    id: 4,
    name: "Prof. Janak Singh Mina",
    role: "Educationist",
    feedback: "I was very impressed to see the wide range of categories related to literature, art and culture. This platform encourages creativity and recognizes various art forms. The rainbow colour of the logo is also very beautiful." ,
    image: Client4,
  },
  {
    id: 5,
    name: " Rima Bachar",
    role: "Young Inventor",
    feedback: "I really liked the idea that Unique Records of Universe includes modern categories like 'AI Technology'. It shows that they are moving with the times and recognizing new technologies. The idea of ​​digital certificate is also great, it will be very useful for young inventors like me." ,
    image: Client5,
  },
  {
    id: 6,
    name: "Angad Kishor ",
    role: "Historian",
    feedback: "I am glad to see that URU also recognises categories like Indian Civilization, Culture, Yoga and Spirituality. This will help preserve our rich cultural heritage and inspire people to stay connected to their roots. This platform is not just about current achievements but also about passing on our cultural heritage to future generations." ,
    image: Client6,
  },
  {
    id: 7,
    name: "Dr.  Rakesh Vashishth ",
    role: "Senior Journalist",
    feedback:"I am very happy to see that URU also recognizes children's talent. This will encourage children to develop their talent and will give them confidence. The idea of ​​digital certificate is also very good, it will be a memorable experience for the children." 
 ,
    image: Client5,
  },
  {
    id: 8,
    name: "Sauhard Shiromani Dr. Saurabh Pandey",
    role: "Founder, Dharadham International ",
    feedback: "It is great to see that Unique Records of Universe also recognizes categories like World Peace. This will help promote world peace and inspire people to come together. This platform is not just about creating records but also about making the world a better place." 
,
    image: Client6,
  },
];

const ClientFeedBack = () => {
  return (
    <div className="full-feedback-sec">
      <div className="client-feedback">
        <h2 className="client-section-title">Your Responses</h2>
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
