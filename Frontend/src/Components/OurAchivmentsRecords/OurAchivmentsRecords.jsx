import React, { useState, useEffect } from 'react';
import './OurAchivmentsRecords.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
 import { API_URL } from '../../Api';


const OurAchivmentsRecords = () => {
  const [achievements, setAchievements] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);


useEffect(() => {
  axios.get(`${API_URL}/achievements/get-all-achievements`)
    .then(response => {
      setAchievements(response.data);
      setLatestPosts(response.data.slice(0, 3));
      const allTags = response.data.map(achievement => achievement.tags.split(','));
      const uniqueTags = [...new Set(allTags.flat())];
      setTags(uniqueTags.slice(0, 8));
    })
    .catch(error => {
      console.error(error);
    });

  axios.get(`${API_URL}/categories`)
    .then(response => {
      setCategories(response.data);
    })
    .catch(error => {
      console.error(error);
    });
}, []);

  return (
    <div>
      <div className="Our-Achievement-Record-Container">
        <div className="Our-Achievement-Record-Main-Content">
          {achievements.map((achievement, index) => (
            <div key={index} className="Our-Achievement-Record-Post">
              <img src={achievement.image} alt="Post 1" />
              <div className="Our-Achievement-Record-Post-Details">
                <div className="Our-Achievement-Record-Post-category">
                  <strong>{achievement.category}</strong>
                  <span className="Our-Achievement-Record-Dot"></span>
                 <span>{moment(achievement.createdAt).format('MMMM DD, YYYY')}</span>
                  <div className="Our-Achievement-Record-Post-category">
                    <span className="Our-Achievement-Record-Dot"></span>
                    <strong>Achiever Name: {achievement.achieverName}</strong>
                  </div>
                  <span>Provider: {achievement.providerName}</span>
                </div>
                <h2>{achievement.title}</h2>
                <p>{achievement.shortDescription}</p>
                <Link to={`/achivment-details/${achievement._id}`} className="Our-Achievement-Record-Read-Post">READ POST <FontAwesomeIcon icon={faArrowRight} /></Link>
              </div>
            </div>
          ))}
        </div>

        <div className="Our-Achievement-Record-Sidebar">
          <div className="Our-Achievement-Record-Search-Box Our-Achievement-Record-Sidebar-Section">
            <input type="text" placeholder="Search" />
            <button>
              <FontAwesomeIcon icon={faSearch} className="Our-Achievement-Record-Search-Icon" />
            </button>
          </div>

          <div className="Our-Achievement-Record-Categories Our-Achievement-Record-Sidebar-Section">
            <h2>Categories</h2>
            {categories.map((category, index) => (
              <div key={index} className="Our-Achievement-Record-Category-Item">
                <FontAwesomeIcon icon={faArrowRight} /> {category.name}
              </div>
            ))}
          </div>

            <div className="Our-Achievement-Record-Latest-Articles Our-Achievement-Record-Sidebar-Section">
      <h2>Latest Articles</h2>
      {latestPosts.map((post, index) => (
        <div key={index} className="Our-Achievement-Record-Article">
          {index === 0 ? (
            <div>
              <img src={post.image} alt="Article 1" />
              <h3>{post.title}</h3>
            </div>
          ) : (
            <div>
              <h3>{post.title}</h3>
            </div>
          )}
          <div className="Our-Achievement-Record-Read-Now">READ NOW <FontAwesomeIcon icon={faArrowRight} /></div>
        </div>
      ))}
    </div>

          <div className="Our-Achievement-Record-Subscribe Our-Achievement-Record-Sidebar-Section">
            <h2>Subscribe To Our News</h2>
            <p>Find out about the last days and the latest promotions of our Corporation</p>
            <div className="Our-Achievement-Record-Subscribe-Form">
              <input type="email" placeholder="Email" />
              <button>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
            <div className="Our-Achievement-Record-Social-Icons">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </div>

          <div className="Our-Achievement-Record-Tags Our-Achievement-Record-Sidebar-Section">
            <h2>Tags</h2>
            <div className="Our-Achievement-Record-Tag-List">
              {tags.map((tag, index) => (
                <span key={index} className="Our-Achievement-Record-Tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurAchivmentsRecords;