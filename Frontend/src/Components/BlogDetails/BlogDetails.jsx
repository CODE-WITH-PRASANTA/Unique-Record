import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import './BlogDetails.css';
import featuredImage1 from '../../assets/blog-03.jpg';
import featuredImage2 from '../../assets/blog-04.jpg';
import featuredImage3 from '../../assets/blog-05.jpg';

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`http://localhost:5002/api/blogs/${id}`);
                setBlog(res.data.blog);
            } catch (err) {
                console.error("Error fetching blog:", err);
            }
        };
        fetchBlog();
    }, [id]);

    if (!blog) return <div className="Blog-Details-Container">Loading...</div>;

    return (
        <div className="Blog-Details-Container">
            <div className="Blog-Details-Content">
                <h1 className="Blog-Details-Title">{blog.title}</h1>
                <div className="Blog-Details-Meta">
                    <span>📌 {blog.authorName}</span> | <span>📂 {blog.category}</span> | <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="Blog-Details-Description">{blog.description}</p>
                <img src={blog.imageUrl} alt={blog.title} className="Blog-Details-MainImage" />
                
                <div className="Blog-Details-Text" dangerouslySetInnerHTML={{ __html: blog.content }}></div>

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

            {/* Sidebar */}
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
                        <div>
                            <p>Key Real Estate Trends To Watch In 2024</p>
                            <span>📅 February 15, 2024</span>
                        </div>
                    </div>
                    <div className="Blog-Details-FeaturedItem">
                        <img src={featuredImage2} alt="Featured 2" />
                        <div>
                            <p>Expert Tips For Profitable Real Estate Investments</p>
                            <span>📅 February 15, 2024</span>
                        </div>
                    </div>
                    <div className="Blog-Details-FeaturedItem">
                        <img src={featuredImage3} alt="Featured 3" />
                        <div>
                            <p>10 Steps To Prepare For A Successful Real Estate...</p>
                            <span>📅 February 15, 2024</span>
                        </div>
                    </div>
                </div>

                <div className="Blog-Details-Newsletter">
                    <h3>Join Our Newsletter</h3>
                    <p>Signup to get the latest news and updates.</p>
                    <input type="email" placeholder="Enter your email" />
                    <button>Subscribe</button>
                </div>

                <div className="Blog-Details-PopularTags">
                    <h3>Popular Tags</h3>
                    <div className="Blog-Details-Tags">
                        {Array.isArray(blog.tags)
                            ? blog.tags.map((t, idx) => (
                                <span key={idx} className="Blog-Details-Tag">{t}</span>
                            ))
                            : blog.tags?.split(',').map((t, idx) => (
                                <span key={idx} className="Blog-Details-Tag">{t.trim()}</span>
                            ))
                        }
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default BlogDetails;