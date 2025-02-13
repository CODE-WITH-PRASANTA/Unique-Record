import React from 'react';
import { useParams } from "react-router-dom";
import './BlogDetails.css';
import blogImage1 from '../../assets/blog-01.jpg';
import blogImage2 from '../../assets/blog-02.jpg';
import featuredImage1 from '../../assets/blog-03.jpg';
import featuredImage2 from '../../assets/blog-04.jpg';
import featuredImage3 from '../../assets/blog-05.jpg';

const BlogDetails = () => {
    const { id } = useParams();

    return (
        <div className="Blog-Details-Container">
            <div className="Blog-Details-Content">
                <h1 className="Blog-Details-Title">Building gains into housing stocks and how to trade the sector</h1>
                <div className="Blog-Details-Meta">
                    <span>📌 Kathryn Murphy</span> | <span>📂 Furniture</span> | <span>📅 April 6, 2023</span>
                </div>
                <p className="Blog-Details-Description">
                    The housing sector has long been a focal point for investors seeking stability and growth. Understanding the dynamics of housing stocks and effectively trading within this sector can lead to substantial gains.
                </p>
                <img src={blogImage1} alt="Housing Sector" className="Blog-Details-MainImage" />

                <h2 className="Blog-Details-Heading">Understanding Housing Stocks</h2>
                <p className="Blog-Details-Text">
                    Housing stocks encompass companies involved in various aspects of the real estate industry, including homebuilders, developers, and related service providers. Factors influencing these stocks range from interest rates and economic indicators to trends in homeownership rates.
                </p>
                <blockquote className="Blog-Details-Quote">
                    “Lower rates can boost homebuying activity, benefiting housing stocks, while higher rates may have the opposite effect.”
                </blockquote>
                <p className="Blog-Details-QuoteAuthor">- Mike Fratantoni, MBA’s Chief Economist</p>

                <img src={blogImage2} alt="Housing Market Trends" className="Blog-Details-SecondaryImage" />
                
                <h2 className="Blog-Details-Heading">Identify Emerging Trends</h2>
                <p className="Blog-Details-Text">
                    Paying close attention to economic indicators such as employment rates, GDP growth, and consumer confidence is crucial. A strong economy often correlates with increased demand for housing, benefiting related stocks.
                </p>

                <div className="Blog-Details-CommentSection">
    <h2>Leave A Comment</h2>
    <p>Your email address will not be published. Required fields are marked *</p>
    <form className="Blog-Details-CommentForm">
        <div className="Comment-Row">
            <input type="text" placeholder="Your name" required />
            <input type="email" placeholder="Your email" required />
        </div>
        <textarea placeholder="Write comment" required></textarea>
        <button type="submit">Post Comment</button>
    </form>
</div>

            </div>

            <aside className="Blog-Details-Sidebar">
                <div className="Blog-Details-SearchBar">
                    <input type="text" placeholder="Search..." />
                </div>

                <div className="Blog-Details-Categories">
                    <h3>Categories</h3>
                    <ul>
                        <li>Market Updates (50)</li>
                        <li>Buying Tips (34)</li>
                        <li>Interior Inspiration (69)</li>
                        <li>Investment Insights (25)</li>
                        <li>Home Construction (12)</li>
                        <li>Legal Guidance (12)</li>
                        <li>Community Spotlight (69)</li>
                    </ul>
                </div>

                <div className="Blog-Details-FeaturedListings">
                    <h3>Featured Listings</h3>
                    <div className="Blog-Details-FeaturedItem">
                        <img src={featuredImage1} alt="Featured 1" />
                        <p>Key Real Estate Trends To Watch In 2024</p>
                        <span>📅February 15, 2024</span>
                    </div>
                    <div className="Blog-Details-FeaturedItem">
                        <img src={featuredImage2} alt="Featured 2" />
                        <p>Expert Tips For Profitable Real Estate Investments</p>
                        <span>📅February 15, 2024</span>
                    </div>
                    <div className="Blog-Details-FeaturedItem">
                        <img src={featuredImage3} alt="Featured 3" />
                        <p>10 Steps To Prepare For A Successful Real Estate...</p>
                        <span>📅February 15, 2024</span>
                    </div>
                </div>

                <div className="Blog-Details-Newsletter">
                    <h3>Join Our Newsletter</h3>
                    <p>Signup to hear about exclusive deals, special offers, and upcoming collections.</p>
                    <input type="email" placeholder="Enter your email" />
                    <button>Subscribe</button>
                </div>

                <div className="Blog-Details-PopularTags">
                    <h3>Popular Tags</h3>
                    <div className="Blog-Details-Tags">
                        <span>Property</span>
                        <span>Office</span>
                        <span>Finance</span>
                        <span>Legal</span>
                        <span>Market</span>
                        <span>Invest</span>
                        <span>Renovate</span>
                    </div>
                </div>
            </aside>
        </div>
    );
}

export default BlogDetails;
