import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './MakeUserPost.css';
import { API_URL } from '../../Api'; // Import the API_URL
import Swal from 'sweetalert2';

const MakeUserPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    quotes: '',
    content: '',
    authorName: '',
    authorDesignation: '',
    phoneNumber: '',
    email: '',
    address: '',
    category: '',
    tags: [],
    image: null,
  });

  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        // Sort categories in alphabetical order
        const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      Swal.fire({
        title: "<strong>Please accept the terms and conditions</strong>",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }

    const formPayload = new FormData();
    formPayload.append("blogTitle", formData.title);
    formPayload.append("shortDescription", formData.quotes);
    formPayload.append("quotes", formData.quotes);
    formPayload.append("blogContent", formData.content);
    formPayload.append("category", formData.category);
    formPayload.append("authorName", formData.authorName || "Anonymous");
    formPayload.append("authorDesignation", formData.authorDesignation);
    formPayload.append("phoneNumber", formData.phoneNumber);
    formPayload.append("email", formData.email);
    formPayload.append("address", formData.address);
    formPayload.append("tags", JSON.stringify(formData.tags));
    formPayload.append("image", formData.image);

    try {
      const response = await fetch(`${API_URL}/blogs/create`, {
        method: "POST",
        body: formPayload,
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "<strong>Blog Post Sent Successfully!</strong>",
          icon: "success",
          html: `
            Your Blog Post has been successfully received by URU admin team. 
            After review, it will be published on the website soon and you will also be notified via email.
          `,
          showCloseButton: false,
          showCancelButton: false,
          focusConfirm: true,
          confirmButtonText: `
            <i class="fa fa-thumbs-up"></i> Great!
          `,
          confirmButtonAriaLabel: "Thumbs up, great!",
        });
        setFormData({
          title: '',
          quotes: '',
          content: '',
          authorName: '',
          authorDesignation: '',
          phoneNumber: '',
          email: '',
          address: '',
          category: '',
          tags: [],
          image: null,
        });
        setTagInput('');
        setTermsAccepted(false);
      } else {
        alert(`❌ Failed to post: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("❌ Server error. Try again later.");
    }
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleShowTerms = () => {
    setShowTerms(true);
  };

  const handleCloseTerms = () => {
    setShowTerms(false);
  };

  return (
    <div className="Make-User-Post-Container">
      <h2 className="Make-User-Post-Heading">Create a New Blog Post</h2>
      <form onSubmit={handleSubmit} className="Make-User-Post-Form">

        {/* Title & Description */}
        <div className="Make-User-Post-Row">
          <div className="Make-User-Post-FormGroup">
            <label>Title<span>*</span></label>
            <input
              type="text"
              name="title"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="Make-User-Post-FormGroup">
            <label>Quotes<span>*</span></label>
            <input
              type="text"
              name="quotes"
              placeholder="Short Quotes"
              value={formData.quotes}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Content */}
        <div className="Make-User-Post-FormGroupFull">
          <label>Content<span>*</span></label>
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
          value={formData.content}  
          onEditorChange={handleEditorChange}
        />

        </div>

        {/* Author Information */}
        <div className="Make-User-Post-Row">
          <div className="Make-User-Post-FormGroup">
            <label>Author Name</label>
            <input
              type="text"
              name="authorName"
              placeholder="Author name (default: Anonymous)"
              value={formData.authorName}
              onChange={handleChange}
            />
          </div>

          <div className="Make-User-Post-FormGroup">
            <label>Author Designation</label>
            <input
              type="text"
              name="authorDesignation"
              placeholder="Author designation"
              value={formData.authorDesignation}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="Make-User-Post-Row">
          <div className="Make-User-Post-FormGroup">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="Make-User-Post-FormGroup">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="Make-User-Post-FormGroupFull">
          <label>Address</label>
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Category & Tags */}
        <div className="Make-User-Post-Row">
          <div className="Make-User-Post-FormGroup">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="Make-User-Post-FormGroup">
            <label>Tags</label>
            <input
              type="text"
              name="tagsInput"
              placeholder="Press Enter or Comma to add"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
            />
            <div className="Make-User-Post-TagsContainer">
              {formData.tags.map((tag, index) => (
                <div key={index} className="Make-User-Post-Tag">
                  #{tag}
                  <span onClick={() => removeTag(index)} className="Make-User-Post-TagRemove">&times;</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="Make-User-Post-FormGroupFull">
          <label>Upload Image<span>*</span></label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>

        <div className="Make-User-Post-Terms">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={handleTermsChange}
          />
          <label htmlFor="terms">I accept the <span onClick={handleShowTerms} className="Make-User-Post-TermsLink">terms and conditions</span></label>
        </div>

        <button type="submit" className="Make-User-Post-SubmitButton">Post Blog</button>
      </form>

      {showTerms && (
        <div className="Make-User-Post-TermsModal">
          <div className="Make-User-Post-TermsModalContent">
            <h2>Terms and Conditions</h2>
            <p>Legal Acceptance:-</p>
            <p>By uploading this message/creation/picture, we accept that we accept the terms and social guidelines of "Unique Records of Universe Blog Post". Along with this, we also take full responsibility that this message/creation/picture has not stolen the copyright and intellectual property rights of any other person, object or place. If any such fact is found, we will be responsible for the legal action taken in this regard. "Unique Records of Universe Blog Post" will not have any responsibility in this regard.</p>
            <p>Social Guidelines:-</p>
            <ul>
              <li>"Unique Records of Universe Blog Post" does not publish any kind of obscene messages/creations/pictures. If you have such a message, creation or picture of your own or someone else, please do not upload it here.</li>
              <li>We expect you not to upload messages/creations/pictures on "Unique Records of Universe Blog Post" that spread provocation, violence or social hatred, bitterness and hatred towards each other, caste and community.</li>
              <li>Do not send misleading, confusing messages/creations/pictures under any circumstances which ignite/spread the fire of revenge.</li>
            </ul>
            <p>Therefore, I have read all the facts and points mentioned above completely and I follow the rules and principles of the "Unique Records of Universe Blog Post" 100%. If I do not do so, I myself will be responsible.</p>
            <button onClick={handleCloseTerms} className="Make-User-Post-TermsModalClose">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeUserPost;