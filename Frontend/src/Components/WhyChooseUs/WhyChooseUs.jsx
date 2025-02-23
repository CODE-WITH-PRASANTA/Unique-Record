import React from "react";
import "./WhyChooseUs.css";
import { FaBook, FaUserGraduate, FaHandsHelping, FaUniversity, FaSuitcase, FaUsers, FaGlobe, FaLightbulb, FaLeaf, FaPenFancy } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const WhyChooseUs = () => {
  const cards = [
    {
      icon: <FaBook />,
      title: "Passionate Writer",
      description: "Young, passionate and rising writer: Dr. Avishek Kumar Blessed with a multifaceted personality, he is rising like a new star in the Hindi literature world today. The passion and determination with which he is engaged day and night in literary creation, it can be easily guessed that his future is going to be bright, inspiring and pleasant. Dr. Abhishek Kumar, who wants to touch the heights, has received more than half a dozen awards at a young age. A person who is the product of struggle and hard work, is brave, whose companion is passion and whose guide is the self and who has nothing to lose and the whole world to gain, who can stop him from embracing the sky! Dr. Avishek Kumar falls in this category.",
      className: "trusted",
    },
    {
      icon: <FaUserGraduate />,
      title: "Humble Beginnings",
      description: "Writer Dr. Avishek Kumar was born on 02/11/1989 in Rasulpur village (Maternal Home) in the rural area of ​​Aurangabad district of Bihar state. Born in an ordinary family, Dr. Avishek Kumar's childhood was spent in poverty and tussle. He had to struggle all the time for essential items. From here, a fighting spirit was born in him, which increased his work-capacity a lot. His father's name is Mr. Basant Kumar Singh, mother's name is Mrs. Rina Singh. His grandfather's name was late Mr. Satyadev Singh who was a very truthful, religious and generous person. Due to spending childhood in the lap of grandfather, spirituality and truthfulness had a deep impact on the mind of child Abhishek.",
      className: "properties",
    },
    {
      icon: <FaUniversity />,
      title: "Educational Journey",
      description: "Dr. Avishek Kumar's primary education was in his maternal home in his native village. He passed the matriculation examination in the year 2005 from the high school located in village Jaihind Tendua of Nabinagar block. Thereafter he went to Patna for higher education. There he failed the intermediate science examination in 2007 because due to living in a Hindi environment and studying in Hindi medium till matriculation, he could not develop a good understanding of English and in cities like Patna, at that time, college coaching was done in English medium. Since after failing, he developed a good understanding of the English language and passed the 2008 examination with average marks. Thereafter he did his graduation in Hindi medium from Magadh University and then got his post graduation degree in Economics with first division in 2013. ",
      className: "financing",
    },
    {
      icon: <FaSuitcase />,
      title: "Professional Career",
      description: "Then in 2014, he passed the examination for the post of community coordinator in Bihar government's Jeevika project for earning livelihood and got selected and contributed to Kaimur district. There he did a lot of works related to economic, social and intellectual development. While working, he never left the path of education, obtained Masters in Rural Development, Hindi and Vedic Studies from Indira Gandhi National Open University, Diploma in Health and Nutrition, Post Graduate Diploma in Environmental Sustainable Development, and MBA from Mahatma Gandhi International Hindi University, Wardha, Maharashtra.",
      className: "financing",
    },
    {
      icon: <FaUsers />,
      title: "Social Contributions",
      description: "Dr. Abhishek, who never gives up and is always enthusiastic and excited, on the strength of his generous spirit and perseverance, joined the State Rural Livelihood Mission under the Uttar Pradesh Government in Chiraigaon Development Block of Varanasi district on 27 October 2018, but due to unsuitable office environment and inhuman pressure and getting an opportunity in the State Rural Livelihood Mission Azamgarh again under the Uttar Pradesh Government in the new recruitment, he resigned from Varanasi and was posted as Block Mission Manager-Skill and Employment/Non Farm in Lalganj Block of Azamgarh District on 16/12/2018. Since then, he is working on this post in Lalganj including Phulpur, Thekma Block. Meanwhile, he tied the knot of holy matrimony with Ms. Divya Bharti, a resident of Rohtas district and a primary school teacher in Aurangabad district of Bihar government. The specialty of this marriage was that it was dowry free.",
      className: "security",
    },
    {
      icon: <FaGlobe />,
      title: "Spiritual Influence",
      description: "In the year 2010, at the age of just 20, Dr. Abhishek Kumar took initiation in Saraswati Mantra from his Guru. Since then, he has been chanting, worshipping and praying to Goddess Saraswati every day. What can be said about his intelligence, work style and energy? His writings and activities are extraordinary and divine, which cannot be easily understood by ordinary eyes.",
      className: "support",
    },
    {
      icon: <FaLightbulb />,
      title: "Guidance and Leadership",
      description: "Due to his eagerness to learn and adopt the path of truth and goodness since childhood, Abhishek Kumar's personality improved further by working under the able leadership, guidance and proximity of the then NRLM Deputy Commissioner of Azamgarh, Mr. B. K. Mohan. With the spiritual and worldly knowledge he received from Mr. B. K. Mohan, he achieved a timeless position.",
    },
    {
      icon: <FaLeaf />,
      title: "Literary Contributions",
      description: "Dr. Avishek Kumar is constantly working on the problems related to social, economic and intellectual environment and their solutions. Actually, he has a high level writing power and the quality of a good speaker since childhood. He has also shared many platforms. While working in the National Rural Livelihood Mission from Azamgarh, due to seeing poverty and helplessness in the communities very closely and the experience of environmental balance during the Corona period, the creations related to the natural environment transformed him into a writer/literary person.",
      className: "support",
    },
    {
      icon: <FaPenFancy />,
      title: "Writing for a Cause",
      description: "Dr. Avishek Kumar is a writer of a nature type and in his writings, social aspects, human welfare/change, natural, environmental facts are described in detail. Along with this, things related to animal, animal and bird welfare are seen in great detail.",
      className: "support",
    },
    {
      icon: <FaBook />,
      title: "Founding a Platform",
      description: "Writer Dr. Avishek Kumar has done a historic work by establishing Divya Prerak Kahaniyan (Literature Genre Reading and E-Publishing Center) in the interest of the society along with the creative people. Through this literary social website, keeping in view the weak economy, he provides a free platform to the writings of the lower class writers at the global level. While on the one hand his creations are being e-published on a wide scale in front of the society with great ease, on the other hand, money is also being received in the form of royalty from online book sales.",
      className: "support",
    },
    {
      icon: <FaHandsHelping />,
      title: "Mission for Society",
      description: "The aim of writer Dr. Avishek Kumar is to work for the economic, social, intellectual, educational, character and spiritual upliftment of all the orphans, neglected, backward from the mainstream Scheduled Castes-Tribes, backward and general, weaker sections of the society. To develop the feeling of social harmony and national unity by eradicating untouchability and discrimination of high and low prevalent in the society and to always be ready/committed to do useful and welfare work for the help of the elderly, abandoned and orphaned mothers of the society. ",
      className: "support",
    },
    {
      icon: <FaGlobe />,
      title: "Commitment to Change",
      description: "Writer Mr. Avishek Kumar says that he is unhappy with the current system of change in the backward people of the society. He is in favor of the basic structure of the current development, but does not accept its dominance. He says that he has golden dreams in his eyes for the upliftment of the poor, exploitation, pain, malnutrition, unemployment, illiteracy. He is committed to make the dreams come true. He has moved forward with the determination to struggle, he is confident of victory. ",
      className: "support",
    },
  ];

  return (
    <div className="about-why-choose-us">
      <h2 className="about-why-choose-us-title">
      About CMD<span> Dr. Avishek Kumar </span>
      </h2>
      <p className="about-why-choose-us-subtitle">Unique Records of Universe™</p>

      {/* Desktop View */}
      <div className="desktop-view">
        <div className="about-why-choose-us-cards">
          {cards.map((card, index) => (
            <div key={index} className={`card ${card.className}`}>
              <div className="icon-container">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="mobile-view">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <div className={`card ${card.className}`}>
                <div className="icon-container">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default WhyChooseUs;
