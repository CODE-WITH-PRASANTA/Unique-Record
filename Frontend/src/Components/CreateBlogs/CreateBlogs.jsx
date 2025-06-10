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
  const [authorDesignation, setAuthorDesignation] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();

    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/blogs/all`);
        const data = await response.json();
        setBlogs(data.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

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
    formData.append("authorDesignation", authorDesignation);
    formData.append("tags", JSON.stringify(tags));
    if (image) {
      formData.append("image", image);
    }

    try {
      let response;
      if (editingBlog) {
        response = await fetch(`${API_URL}/blogs/update/${editingBlog._id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/blogs/create`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: editingBlog ? "Blog Updated Successfully!" : "Blog Created Successfully!",
          icon: "success",
          draggable: true
        });
        setBlogs(editingBlog ? blogs.map(blog => blog._id === editingBlog._id ? data.data : blog) : [...blogs, data.data]);
        setEditingBlog(null);
        setBlogTitle('');
        setShortDescription('');
        setQuotes('');
        setBlogContent('');
        setCategory('');
        setAuthorName('');
        setAuthorDesignation('');
        setTags([]);
        setImage(null);
        setImagePreview(null);
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          draggable: true
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        draggable: true
      });
    }
  };

  const handleEditBlog = async (blog) => {
    try {
      const response = await fetch(`${API_URL}/blogs/${blog._id}`);
      const data = await response.json();
      const blogData = data.data;
      setEditingBlog(blogData);
      setBlogTitle(blogData.blogTitle);
      setShortDescription(blogData.shortDescription);
      setQuotes(blogData.quotes);
      setBlogContent(blogData.blogContent);
      setCategory(blogData.category);
      setAuthorName(blogData.authorName);
      setAuthorDesignation(blogData.authorDesignation);
      setTags(blogData.tags);
      setImagePreview(blogData.imageUrl);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const handleSearch = () => {
    const filtered = blogs.filter(blog => 
      blog.blogTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.authorDesignation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredBlogs(blogs);
  };

  const copySelectedText = () => {
    const selectedText = window.getSelection().toString();
    navigator.clipboard.writeText(selectedText);
  };

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

        <div className="Create-Blog-Row">
          <div className="Create-Blog-Section Create-Blog-Section-Half">
            <label className="Create-Blog-Label">Author Designation</label>
            <input
              type="text"
              value={authorDesignation}
              onChange={(e) => setAuthorDesignation(e.target.value)}
              placeholder="Enter author designation"
              required
              className="Create-Blog-Input"
            />
          </div>
          <div className="Create-Blog-Section Create-Blog-Section-Half">
            <label className="Create-Blog-Label">Short Description</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Enter short description"
              required
              className="Create-Blog-Input"
            />
          </div>
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
  apiKey="38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv"
  value={blogContent}
  onEditorChange={handleEditorChange}
  init={{
    height: 300,
    menubar: false,
    branding: false,
    plugins:
      'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar:
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    content_style:
      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

    setup: (editor) => {
      let copyButton;

      // Detect text selection
      editor.on('NodeChange', () => {
        const selection = editor.selection.getContent({ format: 'text' });
        if (selection && selection.trim().length > 0) {
          const rect = editor.selection.getRng().getBoundingClientRect();

          if (!copyButton) {
            copyButton = document.createElement('button');
            copyButton.innerText = 'Copy';
            copyButton.style.position = 'absolute';
            copyButton.style.zIndex = '1000';
            copyButton.style.padding = '5px 10px';
            copyButton.style.background = '#333';
            copyButton.style.color = '#fff';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '5px';
            copyButton.style.cursor = 'pointer';
            copyButton.onclick = () => {
              navigator.clipboard.writeText(selection);
              copyButton.innerText = 'Copied!';
              setTimeout(() => {
                copyButton.innerText = 'Copy';
              }, 1000);
            };
            document.body.appendChild(copyButton);
          }

          // Position the button near the selection
          const iframeRect = editor.iframeElement.getBoundingClientRect();
          copyButton.style.top = `${iframeRect.top + rect.top - 35}px`;
          copyButton.style.left = `${iframeRect.left + rect.left}px`;
          copyButton.style.display = 'block';
        } else if (copyButton) {
          copyButton.style.display = 'none';
        }
      });

      // Hide on blur
      editor.on('Blur', () => {
        if (copyButton) copyButton.style.display = 'none';
      });
    },
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
          {editingBlog ? "Update Blog" : "Publish Blog"}
        </button>
      </form>

      <h2 className='Create-Blog-heading-table'>Blogs</h2>
      <div className="search-bar-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by blog title, author name, or author designation"
          className="search-bar-input"
        />
        <button className="search-bar-button" onClick={handleSearch}>Search</button>
        <button className="search-bar-button" onClick={handleReset}>Reset</button>
      </div>
      <table className="Create-Blog-Table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Title</th>
            <th>Photo</th>
            <th>Author Name</th>
            <th>Author Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBlogs.map((blog, index) => (
            <tr key={blog._id}>
              <td>{index + 1}</td>
              <td>{blog.blogTitle}</td>
              <td><img src={blog.imageUrl} alt={blog.blogTitle} /></td>
              <td>{blog.authorName}</td>
              <td>{blog.authorDesignation || "N/A"}</td>
              <td>
                <button onClick={() => handleEditBlog(blog)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateBlogs;