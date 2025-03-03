import React, { Suspense, lazy, useState } from "react";
import "./CreateBlog.css";
import axios from "axios";
import BlogForm from "../BlogForm/BlogForm";

// Lazy load TinyMCE Editor for better performance
const Editor = lazy(() => import("@tinymce/tinymce-react").then((module) => ({ default: module.Editor })));

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    authorName: "",
    category: "",
    tags: [],
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle file drop for drag and drop image upload
  const handleDrop = (event) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile));
    }
  };

  // Handle file selection via input field
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile));
    }
  };

  const handleFormData = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data, // Merge new data with existing formData
    }));
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData); // Debugging Step
    setIsLoading(true);
    setError(null);
    setSuccess(false);
  
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title || "Untitled"); // Ensure default values
    formDataToSend.append("description", formData.description || "No description provided");
    formDataToSend.append("content", formData.content || ""); // Avoid undefined content
    formDataToSend.append("authorName", formData.authorName || "Anonymous");
    formDataToSend.append("category", formData.category.trim() ? formData.category : "Uncategorized");
    formDataToSend.append("tags", formData.tags.length > 0 ? formData.tags.join(",") : "General");
    formDataToSend.append("image", file);
  
    try {
      const response = await axios.post("http://localhost:5000/api/blogs/create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 201) {
        console.log("Blog successfully posted:", response.data);
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting blog:", error.response?.data);
      setError(error.response?.data?.message || "Failed to post blog.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <div className="Blog-create-wrapper">
        <div className="Blog-create-container">
          <h2 className="Blog-create-title">Create a New Post</h2>

          <div className="Blog-create-breadcrumb">
            <span className="Blog-create-link">Dashboard</span> &gt;
            <span className="Blog-create-link"> Blog</span> &gt;
            <span className="Blog-create-current"> Create</span>
          </div>

          <div className="Blog-create-section">
            <h3 className="Blog-create-subtitle">Post Details</h3>
            <p className="Blog-create-description">
              Add a title, short description, and a featured image.
            </p>

            <div className="Blog-create-field">
              <label className="Blog-create-label">Post Title</label>
              <input
                type="text"
                className="Blog-create-input"
                placeholder="Enter post title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="Blog-create-field">
              <label className="Blog-create-label">Description</label>
              <textarea
                className="Blog-create-textarea"
                placeholder="Enter a short description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="Blog-create-section">
            <h3 className="Blog-create-subtitle">Post Content</h3>
            <div className="Blog-create-editor">
              <Suspense fallback={<div>Loading editor...</div>}>
                <Editor
                  apiKey="lwbh5is93mouewxge9c02qw3dd1l95x1iljyuzj46imho5eh"
                  init={{
                    plugins: [
                      "anchor",
                      "autolink",
                      "charmap",
                      "codesample",
                      "emoticons",
                      "image",
                      "link",
                      "lists",
                      "media",
                      "searchreplace",
                      "table",
                      "visualblocks",
                      "wordcount",
                      "paste",
                      "textcolor",
                    ],
                    toolbar:
                      "undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media ",
                    menubar: false,
                    branding: false,
                    height: 400,
                    content_style: "body { font-family:Arial, sans-serif; font-size:14px; }",
                    statusbar: false,
                    remove_linebreaks: false,
                  }}
                  initialValue="Write your content here..."
                  onEditorChange={(content) =>
                    setFormData((prevData) => ({ ...prevData, content }))
                  }
                  
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <div className="Blog-create-wrapper">
        <div className="Blog-create-upload-container">
          <label className="Blog-create-upload-label">Cover</label>
          <div
            className="Blog-create-upload-box"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {previewUrl ? (
              <div className="Blog-create-upload-preview">
                <img src={previewUrl} alt="Preview" className="Blog-create-upload-preview-image" />
              </div>
            ) : (
              <div className="Blog-create-upload-placeholder">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3616/3616729.png"
                  alt="Upload Illustration"
                  className="Blog-create-upload-icon"
                />
                <p className="Blog-create-upload-text">Drop or select file</p>
              </div>
            )}
            <input
              type="file"
              className="Blog-create-upload-input"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>
      </div>

      <BlogForm onFormDataChange={handleFormData} />

      <div className="Blog-create-wrapper">
        <button
          type="submit"
          className="blog-editing-sec-submit-btn"
          onClick={handleFormSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Publishing..." : "PUBLISH"}
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Blog posted successfully!</div>}
      </div>
    </>
  );
};

export default CreateBlog;
