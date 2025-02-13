import React from 'react'
import './Blog.css'
import BlogSection from '../../Components/BlgSection/BlogSection'

const Blog = () => {
  return (
    <>

    <div className="Blog-section">
      <div className="Blog-content">
        <h1>
          Blogs
        </h1>
        <p>Latest News , Updates & Blogs</p>
      </div>
    </div>
<BlogSection />

    </>
  )
}

export default Blog