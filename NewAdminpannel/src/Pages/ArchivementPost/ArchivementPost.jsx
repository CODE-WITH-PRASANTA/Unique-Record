import React, { useState } from 'react';
import {
  FaUndo,
  FaRedo,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaTable,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaQuoteRight,
} from 'react-icons/fa';
import './ArchivementPost.css';

const ArchivementPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    content: '',
    providerName: '',
    achieverName: '',
    holderLink: '',
    address: '',
    effortType: '',
    category: '',
    tags: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [imagePreview, setImagePreview] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection - reads the image as a data URL so it survives
  // form resets and can be stored/rendered per achievement record
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFileName('No file chosen');
      setImagePreview(null);
    }
  };

  // Form Submit / Post Achievement
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.achieverName || !formData.effortType || !formData.category) {
      alert('Please fill out all required fields (*).');
      return;
    }

    if (editingId) {
      // Update existing record
      setAchievements(
        achievements.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formData,
                fileName: selectedFile ? fileName : item.fileName,
                image: selectedFile ? imagePreview : item.image,
              }
            : item
        )
      );
      setEditingId(null);
      alert('Achievement updated successfully!');
    } else {
      // Add new record
      const newAchievement = {
        id: Date.now(),
        ...formData,
        fileName,
        image: imagePreview,
      };
      setAchievements([newAchievement, ...achievements]);
      alert('Achievement posted successfully!');
    }

    // Reset Form
    setFormData({
      title: '',
      shortDesc: '',
      content: '',
      providerName: '',
      achieverName: '',
      holderLink: '',
      address: '',
      effortType: '',
      category: '',
      tags: '',
    });
    setSelectedFile(null);
    setFileName('No file chosen');
    setImagePreview(null);
  };

  // Delete Record
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      setAchievements(achievements.filter((item) => item.id !== id));
    }
  };

  // Edit Record
  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      shortDesc: item.shortDesc,
      content: item.content,
      providerName: item.providerName,
      achieverName: item.achieverName,
      holderLink: item.holderLink,
      address: item.address,
      effortType: item.effortType,
      category: item.category,
      tags: item.tags,
    });
    setFileName(item.fileName);
    setImagePreview(item.image || null);
    setSelectedFile(null);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ap-container">
      <div className="ap-wrapper">
        {/* Main Title Section */}
        <header className="ap-header-section">
          <h1 className="ap-main-title">Post Achievement</h1>
        </header>

        {/* Post Achievement Form Card */}
        <form className="ap-form-card" onSubmit={handleSubmit}>
          {/* Achievement Title */}
          <div className="ap-form-group">
            <label className="ap-label">Achievement Title*</label>
            <input
              type="text"
              name="title"
              className="ap-text-input"
              placeholder="Enter achievement title..."
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Short Description */}
          <div className="ap-form-group">
            <label className="ap-label">Achievement Short Description*</label>
            <textarea
              name="shortDesc"
              className="ap-textarea-input"
              placeholder="Enter brief description..."
              rows="4"
              value={formData.shortDesc}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Achievement Content (Rich Text Editor Simulation) */}
          <div className="ap-form-group">
            <label className="ap-label">Achievement Content*</label>
            <div className="ap-editor-container">
              <div className="ap-editor-menubar">
                <span className="ap-menu-item">File</span>
                <span className="ap-menu-item">Edit</span>
                <span className="ap-menu-item">View</span>
                <span className="ap-menu-item">Insert</span>
                <span className="ap-menu-item">Format</span>
                <span className="ap-menu-item">Tools</span>
                <span className="ap-menu-item">Table</span>
                <span className="ap-menu-item">Help</span>
              </div>

              <div className="ap-editor-toolbar">
                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Undo">
                    <FaUndo />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Redo">
                    <FaRedo />
                  </button>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <select className="ap-editor-select">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <select className="ap-editor-select">
                    <option>System Font</option>
                  </select>
                  <select className="ap-editor-select ap-editor-select-sm">
                    <option>12pt</option>
                    <option>14pt</option>
                  </select>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Bold">
                    <FaBold />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Italic">
                    <FaItalic />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Underline">
                    <FaUnderline />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Strikethrough">
                    <FaStrikethrough />
                  </button>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Align Left">
                    <FaAlignLeft />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Align Center">
                    <FaAlignCenter />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Align Right">
                    <FaAlignRight />
                  </button>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Bullet List">
                    <FaListUl />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Numbered List">
                    <FaListOl />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Quote">
                    <FaQuoteRight />
                  </button>
                </div>

                <span className="ap-toolbar-divider" />

                <div className="ap-toolbar-group">
                  <button type="button" className="ap-tool-btn" title="Insert Link">
                    <FaLink />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Insert Image">
                    <FaImage />
                  </button>
                  <button type="button" className="ap-tool-btn" title="Insert Table">
                    <FaTable />
                  </button>
                </div>
              </div>

              <textarea
                name="content"
                className="ap-editor-textarea"
                placeholder="Write detailed content here..."
                rows="6"
                value={formData.content}
                onChange={handleChange}
              ></textarea>

              <div className="ap-editor-footer">
                <span>p</span>
                <span>Press Alt+0 for help</span>
                <span>{formData.content.length} words</span>
              </div>
            </div>
          </div>

          {/* Achievement Provider Name */}
          <div className="ap-form-group">
            <label className="ap-label">Achievement Provider Name*</label>
            <input
              type="text"
              name="providerName"
              className="ap-text-input"
              placeholder="Enter provider name..."
              value={formData.providerName}
              onChange={handleChange}
            />
          </div>

          {/* Achiever Name */}
          <div className="ap-form-group">
            <label className="ap-label">Achiever Name*</label>
            <input
              type="text"
              name="achieverName"
              className="ap-text-input"
              placeholder="Enter achiever name..."
              value={formData.achieverName}
              onChange={handleChange}
              required
            />
          </div>

          {/* URU Holder Details Link */}
          <div className="ap-form-group">
            <label className="ap-label">URU Holder Details Link</label>
            <input
              type="text"
              name="holderLink"
              className="ap-text-input"
              placeholder="https://example.com/holder"
              value={formData.holderLink}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="ap-form-group">
            <label className="ap-label">Address*</label>
            <input
              type="text"
              name="address"
              className="ap-text-input"
              placeholder="Enter full address..."
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Effort Type */}
          <div className="ap-form-group">
            <label className="ap-label">Effort Type*</label>
            <div className="ap-select-wrapper">
              <select
                name="effortType"
                className="ap-select-input"
                value={formData.effortType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Effort Type
                </option>
                <option value="Individual">Individual Effort</option>
                <option value="Team">Team Effort</option>
                <option value="Organizational">Organizational</option>
              </select>
            </div>
          </div>

          {/* Achievement Category */}
          <div className="ap-form-group">
            <label className="ap-label">Achievement Category*</label>
            <div className="ap-select-wrapper">
              <select
                name="category"
                className="ap-select-input"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
                <option value="Professional">Professional</option>
                <option value="Art & Culture">Art & Culture</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="ap-form-group">
            <label className="ap-label">Tags*</label>
            <input
              type="text"
              name="tags"
              className="ap-text-input"
              placeholder="Enter tags separated by commas..."
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          {/* Upload Achievement Image */}
          <div className="ap-form-group">
            <label className="ap-label">Upload Achievement Image*</label>
            <div className="ap-file-picker-container">
              <label className="ap-file-custom-btn">
                Choose File
                <input
                  type="file"
                  className="ap-file-hidden-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <span className="ap-file-name-display">{fileName}</span>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="ap-file-preview-thumb" />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="ap-form-actions">
            <button type="submit" className="ap-submit-btn">
              {editingId ? 'Update Achievement' : 'Post Achievement'}
            </button>
          </div>
        </form>

        {/* All Achievements Table Section */}
        <section className="ap-table-section">
          <h2 className="ap-table-heading">All Achievements</h2>
          <div className="ap-table-responsive">
            <table className="ap-data-table">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Achiever</th>
                  <th>Effort Type</th>
                  <th>Category</th>
                  <th className="ap-text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="ap-empty-row">
                      No achievements found.
                    </td>
                  </tr>
                ) : (
                  achievements.map((item, index) => (
                    <tr key={item.id} className="ap-table-row">
                      <td className="ap-col-sno">{index + 1}</td>
                      <td className="ap-col-image">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="ap-table-thumb" />
                        ) : (
                          <span className="ap-table-thumb ap-table-thumb-placeholder">
                            <FaImage />
                          </span>
                        )}
                      </td>
                      <td className="ap-col-title">
                        <strong>{item.title}</strong>
                      </td>
                      <td className="ap-col-achiever">{item.achieverName}</td>
                      <td>{item.effortType}</td>
                      <td>
                        <span className="ap-category-pill">{item.category}</span>
                      </td>
                      <td className="ap-col-actions">
                        <div className="ap-action-group">
                          <button className="ap-btn-edit" onClick={() => handleEdit(item)}>
                            Edit
                          </button>
                          <button className="ap-btn-delete" onClick={() => handleDelete(item.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArchivementPost;