import React from "react";
import { FiUser, FiMessageCircle, FiList, FiLink  } from "react-icons/fi";
import "./NoticeContent.css";
import noticeImg1 from "../../assets/Notice-img.png"; // Update with actual image paths
import noticeImg2 from "../../assets/Notice-img.png";
import noticeImg3 from "../../assets/Notice-img.png";

const notices = [
  {
    id: 1,
    date: { day: "31", month: "May" , year:"2025" },
    img: noticeImg1,
    title: "New Features Added to Our Web Platform",
    description:
      "We have introduced several new features that enhance the user experience. Stay tuned for more updates!",
  },
  {
    id: 2,
    date: { day: "15", month: "Jun" , year:"2025" },
    img: noticeImg2,
    title: "Important Security Update Released",
    description:
      "A major security patch has been applied to our system. We recommend all users to update their accounts.",
  },
  {
    id: 3,
    date: { day: "05", month: "Jul" , year:"2025" },
    img: noticeImg3,
    title: "Upcoming Maintenance Notice",
    description:
      "Scheduled maintenance will take place on July 10th. Expect some downtime during the process.",
  },
  {
    id: 1,
    date: { day: "31", month: "May" , year:"2025"},
    img: noticeImg1,
    title: "New Features Added to Our Web Platform",
    description:
      "We have introduced several new features that enhance the user experience. Stay tuned for more updates!",
  },
  {
    id: 2,
    date: { day: "15", month: "Jun" , year:"2025" },
    img: noticeImg2,
    title: "Important Security Update Released",
    description:
      "A major security patch has been applied to our system. We recommend all users to update their accounts.",
  },
  {
    id: 3,
    date: { day: "05", month: "Jul" , year:"2025" },
    img: noticeImg3,
    title: "Upcoming Maintenance Notice",
    description:
      "Scheduled maintenance will take place on July 10th. Expect some downtime during the process.",
  },
];

const NoticeSection = () => {
  return (
    <div className="notice-section">
      {notices.map((notice, index) => (
        <div className="notice-card" key={notice.id}>
          <div className="notice-image">
            <img src={notice.img} alt="Notice" />
            <div className="notice-date">
              <span>{notice.date.day}</span>
              <span>{notice.date.month}</span>
              <span>{notice.date.year}</span>
            </div>
          </div>
          <div className="notice-content">
            <div className="notice-meta">
              <span><FiUser /> By Admin</span>
              <span><FiList /> Sl No. {index + 1}</span>
            </div>
            <h2 className="notice-title">{notice.title}</h2>
            <p className="notice-description">{notice.description}</p>
            <a href="#" className="link-more">
              Link <FiLink  />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticeSection;
