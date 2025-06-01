import React, { useState, useEffect } from 'react';
import './CreateBlogs.css';
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2';
import { API_URL } from '../../Api';

const CreateBlogs = () => {
  const [blogTitle, setBlogTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [quotes, setQuotes] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((tag, i) => i !== index));
  };

  const handleEditorChange = (content, editor) => {
    setBlogContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("blogTitle", blogTitle);
    formData.append("shortDescription", shortDescription);
    formData.append("quotes", quotes);
    formData.append("blogContent", blogContent);
    formData.append("category", category);
    formData.append("authorName", authorName);
    formData.append("tags", JSON.stringify(tags));
    formData.append("image", image);

    try {
      const response = await fetch(`${API_URL}/blogs/create`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Blog Created Successfully!",
          icon: "success",
          draggable: true
        });
        // Reset form fields or redirect to another page
      } else {
        Swal.fire({
          title: "Error Creating Blog",
          text: data.message,
          icon: "error",
          draggable: true
        });
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      Swal.fire({
        title: "Error Creating Blog",
        text: error.message,
        icon: "error",
        draggable: true
      });
    }
  };
  ;

  return (
    <div className="Create-Blog-Container">
      <h1 className="Create-Blog-Title">Create Blog</h1>
      <form onSubmit={handleSubmit} className="Create-Blog-Form">
        <div className="Create-Blog-Row">
          <div className="Create-Blog-Section Create-Blog-Section-Half">
            <label className="Create-Blog-Label">Blog Title</label>
            <input
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Enter blog title"
              required
              className="Create-Blog-Input"
            />
          </div>
          <div className="Create-Blog-Section Create-Blog-Section-Half">
            <label className="Create-Blog-Label">Author Name</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Enter author name"
              required
              className="Create-Blog-Input"
            />
          </div>
        </div>

        <div className="Create-Blog-Section">
          <label className="Create-Blog-Label">Short Description</label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Enter short description"
            required
            className="Create-Blog-TextArea"
          />
        </div>

        <div className="Create-Blog-Section">
          <label className="Create-Blog-Label">Quotes</label>
          <textarea
            value={quotes}
            onChange={(e) => setQuotes(e.target.value)}
            placeholder="Enter quotes"
            className="Create-Blog-TextArea"
          />
        </div>

        <div className="Create-Blog-Section">
        <label className="Create-Blog-Label">Blog Content</label>
        <Editor
          apiKey='38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv'
          value={blogContent}
          onEditorChange={handleEditorChange}
          init={{
            height: 300,
            menubar: false,
            branding: false, // Add this line to remove branding
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
      </div>
      
        <div className="Create-Blog-Row">
          <div className="Create-Blog-Section Create-Blog-Section-Half">
            <label className="Create-Blog-Label">Choose Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="Create-Blog-Select"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="Create-Blog-Section Create-Blog-Section-Half">
            <label className="Create-Blog-Label">Tags</label>
            <div className="Create-Blog-Tags">
              {tags.map((tag, index) => (
                <span key={index} className="Create-Blog-Tag">
                  {tag}
                  <button
                    type="button"
                    className="Create-Blog-Tag-Remove"
                    onClick={() => handleRemoveTag(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag"
                className="Create-Blog-Input-Tag"
              />
              <button
                type="button"
                className="Create-Blog-Tag-Add"
                onClick={handleAddTag}
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>

        <div className="Create-Blog-Section">
          <label className="Create-Blog-Label">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            required
            className="Create-Blog-FileInput"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Uploaded Image"
              className="Create-Blog-ImagePreview"
            />
          )}
        </div>

        <button type="submit" className="Create-Blog-SubmitBtn">
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlogs;