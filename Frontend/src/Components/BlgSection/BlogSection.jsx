import React from "react";
import { Link } from "react-router-dom";
import "./BlogSection.css";

// Import Assets
import Blog1 from "../../assets/blog-01.jpg";
import Blog2 from "../../assets/blog-02.jpg";
import Blog3 from "../../assets/blog-03.jpg";
import Blog4 from "../../assets/blog-04.jpg";
import Blog5 from "../../assets/blog-05.jpg";
import Blog6 from "../../assets/blog-06.jpg";
import Blog7 from "../../assets/blog-07.jpg";
import Blog8 from "../../assets/blog-08.jpg";
import Blog9 from "../../assets/blog-09.jpg";

const blogs = [
  { id: 1, date: "January 28, 2024", image: Blog1, author: "Jerome Bell", category: "Furniture", title: "Building Gains Into Housing Stocks And How To Trade The Sector", description: "Learn the key strategies for investing in real estate stocks and boosting your portfolio..." },
  { id: 2, date: "January 31, 2024", image: Blog2, author: "Angel", category: "Interior", title: "92% Of Millennial Homebuyers Say Inflation Has Impacted Their Plans", description: "How inflation is shaping the real estate market for young buyers and investors..." },
  { id: 3, date: "January 28, 2024", image: Blog3, author: "Colleen", category: "Architecture", title: "We Are Hiring ‘Moderately,’ Says Compass CEO", description: "An insight into job opportunities and hiring trends in the real estate sector..." },
  { id: 4, date: "February 01, 2024", image: Blog4, author: "Shane", category: "Property", title: "Expert Tips For Profitable Real Estate Investments.", description: "Top strategies to maximize ROI when investing in property..." },
  { id: 5, date: "February 06, 2024", image: Blog5, author: "Eduardo", category: "Realtor", title: "The Art Of Staging: How To Sell Your Home Quickly At A High Price.", description: "Proven home staging techniques that increase selling price and attract buyers..." },
  { id: 6, date: "February 09, 2024", image: Blog6, author: "Dianne", category: "HomeBuying", title: "Key Real Estate Trends To Watch In 2024", description: "Upcoming real estate trends shaping the industry this year..." },
  { id: 7, date: "February 16, 2024", image: Blog7, author: "Philip", category: "Furniture", title: "10 Steps To Prepare For A Successful Real Estate Purchase.", description: "A step-by-step guide to navigating the real estate buying process..." },
  { id: 8, date: "February 18, 2024", image: Blog8, author: "Sohan", category: "Interior", title: "Transforming An Old House Into A Modern Home.", description: "Key renovation ideas for updating an old house with a modern touch..." },
  { id: 9, date: "February 22, 2024", image: Blog9, author: "Gladys", category: "DreamHome", title: "Choosing A Reliable Real Estate Agent. What You Need To Know", description: "How to find the best real estate agent for your home buying or selling needs..." },
];

const BlogSection = () => {
  return (
    <section className="blog-section">
      <h2 className="blog-header">Latest Insights & Trends</h2>
      <p className="blog-subtext">Stay updated with the latest in real estate, interior design, and investment trends.</p>
      
      <div className="blog-container">
        {blogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            <Link to={`/blog/${blog.id}`}>
              <img src={blog.image} alt={blog.title} className="blog-image" />
            </Link>
            <div className="blog-content">
              <span className="blog-date">{blog.date}</span>
              <p className="blog-meta">
                <strong>{blog.author}</strong> • {blog.category}
              </p>
              <h3 className="blog-title">
                <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
              </h3>
              <p className="blog-description">{blog.description}</p>
              <Link to={`/blog/${blog.id}`} className="read-more">Read More →</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
