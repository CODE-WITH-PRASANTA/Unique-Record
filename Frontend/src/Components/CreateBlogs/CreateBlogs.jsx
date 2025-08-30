import React, { useState, useEffect } from 'react';
import './CreateBlogs.css';
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2';
import { API_URL } from '../../Api';
import axios from 'axios';


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
  const [email, setEmail] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
const [address, setAddress] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);


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

const handleDelete = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/blogs/delete/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          setBlogs((prev) => prev.filter((blog) => blog._id !== id));

          Swal.fire({
            title: "Deleted!",
            text: "Your blog has been deleted.",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete blog.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Failed to delete blog", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting.",
          icon: "error",
        });
      }
    }
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
  setIsSubmitting(true);

    const formData = new FormData();
    formData.append("blogTitle", blogTitle);
    formData.append("shortDescription", shortDescription);
    formData.append("quotes", quotes);
    formData.append("blogContent", blogContent);
    formData.append("category", category);
    formData.append("authorName", authorName);
    formData.append("authorDesignation", authorDesignation);
    formData.append("tags", JSON.stringify(tags));
    formData.append("email", email);
    formData.append("address", address);
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
      setIsSubmitting(false);
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
      setEmail(blogData.email);
    setAddress(blogData.address);
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

const handleTogglePublish = async (id, isCurrentlyPublished) => {
  try {
    const url = `${API_URL}/blogs/${isCurrentlyPublished ? 'unpublish' : 'publish'}/${id}`;
    const response = await axios.put(url);

    if (response.data.success) {
      Swal.fire({
        title: response.data.message,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Update the blog state to reflect the new publish status
      setBlogs(
        blogs.map((blog) =>
          blog._id === id ? { ...blog, isPublished: !isCurrentlyPublished } : blog
        )
      );
    } else {
      Swal.fire({
        title: "Error",
        text: response.data.message,
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Publish/Unpublish error:", error);
    Swal.fire({
      title: "Error",
      text: "Something went wrong!",
      icon: "error",
    });
  }
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
                init={{
                  height: 500,
                  plugins:
                    'anchor autolink charmap codesample emoticons image link lists media ' +
                    'searchreplace table visualblocks visualchars wordcount code paste preview ' +
                    'fullscreen insertdatetime advlist help',
                  toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough ' +
                    '| forecolor backcolor | link image media table | align lineheight | numlist bullist indent outdent ' +
                    '| emoticons charmap codesample | copy cut paste | removeformat | fullscreen preview code help',
                  menubar: 'file edit view insert format tools table help',
                  toolbar_mode: 'sliding',
                  branding: false,
                  contextmenu: 'copy cut paste link image table',
                  mobile: {
                    menubar: true,
                    plugins: 'autosave lists autolink paste',
                    toolbar:
                      'undo redo | bold italic underline | forecolor backcolor | ' +
                      'align bullist numlist | copy cut paste',
                  },
                  paste_data_images: true,
                  paste_as_text: true,
                }}
                value={blogContent}  
                onEditorChange={handleEditorChange}
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

        <div className="Create-Blog-Row">
  <div className="Create-Blog-Section Create-Blog-Section-Half">
    <label className="Create-Blog-Label">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter email"
      required
      className="Create-Blog-Input"
    />
  </div>
  
<div className="Create-Blog-Section Create-Blog-Section-Half">
  <label className="Create-Blog-Label">Address</label>
  <textarea
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    placeholder="Enter address"
    className="Create-Blog-TextArea"
  />
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

       <button type="submit" className="Create-Blog-SubmitBtn" disabled={isSubmitting}>
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
      <th>Date Received</th> {/* New Column */}
      <th>Title</th>
      <th>Photo</th>
      <th>Author Name</th>
      <th>Author Designation</th>
      <th>Phone Number</th>
      <th>Email</th>
      <th>Address</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredBlogs.map((blog, index) => (
      <tr key={blog._id}>
        <td>{index + 1}</td>
        <td>
          {new Date(blog.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </td>
        <td>{blog.blogTitle}</td>
        <td><img src={blog.imageUrl} alt={blog.blogTitle} /></td>
        <td>{blog.authorName}</td>
        <td>{blog.authorDesignation || "N/A"}</td>
        <td>{blog.phoneNumber || "N/A"}</td>
        <td>{blog.email || "N/A"}</td>
        <td>{blog.address || "N/A"}</td>
        <td className='Action-Btn'>
          <button className="edit-btn" onClick={() => handleEditBlog(blog)}>Edit</button>
          <button onClick={() => handleDelete(blog._id)}>Delete</button>
          <button
            className={`publish-toggle-btn ${blog.isPublished ? 'published' : 'unpublished'}`}
            onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
          >
            {blog.isPublished ? 'Published' : 'Unpublished'}
          </button>

        </td>

      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default CreateBlogs;