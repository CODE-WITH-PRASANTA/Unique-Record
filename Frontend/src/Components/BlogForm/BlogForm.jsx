import React, { useState } from "react";
import "./BlogForm.css";

const BlogForm = ({ onFormDataChange }) => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [postingDate, setPostingDate] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
      onFormDataChange({
        authorName,
        postingDate,
        blogDescription,
        category,
        tags: updatedTags,
      });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    onFormDataChange({
      authorName,
      postingDate,
      blogDescription,
      category,
      tags: updatedTags,
    });
  };

  const handleInputChange = () => {
    onFormDataChange({
      authorName,
      postingDate,
      blogDescription,
      category,
      tags,
    });
  };

  return (
    <div className="Blog-create-wrapper">
      <div className="blog-editing-sec-container">
        <form className="blog-editing-sec-form">
          <div className="blog-editing-sec-form-group">
            <label htmlFor="authorName" className="blog-editing-sec-label">
              Author Name
            </label>
            <input
              type="text"
              id="authorName"
              className="blog-editing-sec-input"
              placeholder="Enter Author Name"
              value={authorName}
              onChange={(e) => {
                setAuthorName(e.target.value);
                handleInputChange();
              }}
            />
          </div>

          <div className="blog-editing-sec-form-group">
            <label htmlFor="postingDate" className="blog-editing-sec-label">
              Posting Date
            </label>
            <input
              type="date"
              id="postingDate"
              className="blog-editing-sec-input"
              value={postingDate}
              onChange={(e) => {
                setPostingDate(e.target.value);
                handleInputChange();
              }}
            />
          </div>

          <div className="blog-editing-sec-form-group">
            <label htmlFor="blogDescription" className="blog-editing-sec-label">
              Blog Description
            </label>
            <textarea
              id="blogDescription"
              className="blog-editing-sec-textarea"
              placeholder="Enter Blog Description"
              value={blogDescription}
              onChange={(e) => {
                setBlogDescription(e.target.value);
                handleInputChange();
              }}
            ></textarea>
          </div>

          <div className="blog-editing-sec-form-group">
            <label htmlFor="categories" className="blog-editing-sec-label">
              Categories
            </label>
            <select
              id="categories"
              className="blog-editing-sec-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                handleInputChange();
              }}
            >
              <option value="">Select a Category</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
            </select>
          </div>

          <div className="blog-editing-sec-form-group blog-editing-sec-tags">
            <label className="blog-editing-sec-label">Tags</label>
            <div className="blog-editing-sec-tags-input">
              <input
                type="text"
                className="blog-editing-sec-input"
                placeholder="Enter a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                type="button"
                className="blog-editing-sec-add-tag-btn"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>
            <div className="blog-editing-sec-tags-list">
              {tags.map((tag, index) => (
                <div key={index} className="blog-editing-sec-tag">
                  {tag}
                  <button
                    type="button"
                    className="blog-editing-sec-remove-tag-btn"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
