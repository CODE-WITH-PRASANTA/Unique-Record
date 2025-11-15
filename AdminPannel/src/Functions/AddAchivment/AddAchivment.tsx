import React, { useState, ChangeEvent, FormEvent } from "react";
import "./AddAchivment.css";
import { FaEye, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

// ==============================
// TYPES
// ==============================
interface Achievement {
  title: string;
  provider: string;
  achiever: string;
  uruLink: string;
  address: string;
  shortDescription: string;
  content: string;
  effortType: string;
  category: string;
  tags: string;
  image: string;
  published?: boolean;
}

const AddAchivment: React.FC = () => {
  // -------------------------------
  // FORM STATE
  // -------------------------------
  const [formData, setFormData] = useState<Achievement>({
    title: "",
    provider: "",
    achiever: "",
    uruLink: "",
    address: "",
    shortDescription: "",
    content: "",
    effortType: "",
    category: "",
    tags: "",
    image: "",
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // -------------------------------
  // HANDLE INPUT CHANGE
  // -------------------------------
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // FILE INPUT
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, image: file ? file.name : "" }));
  };

  // -------------------------------
  // SUBMIT HANDLER
  // -------------------------------
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && editIndex !== null) {
      const updatedList = [...achievements];
      updatedList[editIndex] = { ...formData };
      setAchievements(updatedList);

      setIsEditing(false);
      setEditIndex(null);
    } else {
      setAchievements((prev) => [...prev, { ...formData, published: false }]);
    }

    // RESET FORM
    setFormData({
      title: "",
      provider: "",
      achiever: "",
      uruLink: "",
      address: "",
      shortDescription: "",
      content: "",
      effortType: "",
      category: "",
      tags: "",
      image: "",
    });
  };

  // -------------------------------
  // DELETE ITEM
  // -------------------------------
  const handleDelete = (index: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  // -------------------------------
  // EDIT ITEM
  // -------------------------------
  const handleEdit = (index: number) => {
    setFormData({ ...achievements[index] });
    setIsEditing(true);
    setEditIndex(index);
  };

  // -------------------------------
  // TOGGLE PUBLISH / UNPUBLISH
  // -------------------------------
  const handleTogglePublish = (index: number) => {
    const updatedList = [...achievements];
    updatedList[index].published = !updatedList[index].published;
    setAchievements(updatedList);
  };

  return (
    <div className="AddAchivment-container">

      {/* LEFT SIDE (SCROLLING FORM) */}
      <div className="AddAchivment-left">

        <div className="AddAchivment-leftHeader">
          <h2 className="AddAchivment-title">
            {isEditing ? "Edit Achievement" : "Post Achievement"}
          </h2>
        </div>

        <div className="AddAchivment-leftScroll">
          <form className="AddAchivment-form" onSubmit={handleSubmit}>
            
            <div className="AddAchivment-grid">
              
              {/* Title */}
              <div className="AddAchivment-field">
                <label>Achievement Title *</label>
                <input
                  className="AddAchivment-input"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter title"
                  required
                />
              </div>

              {/* Provider */}
              <div className="AddAchivment-field">
                <label>Provider Name *</label>
                <input
                  className="AddAchivment-input"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter provider name"
                  required
                />
              </div>

              {/* Achiever */}
              <div className="AddAchivment-field">
                <label>Achiever Name *</label>
                <input
                  className="AddAchivment-input"
                  name="achiever"
                  value={formData.achiever}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter achiever name"
                  required
                />
              </div>

              {/* URU Holder Link */}
              <div className="AddAchivment-field">
                <label>URU Holder Details Link</label>
                <input
                  className="AddAchivment-input"
                  name="uruLink"
                  value={formData.uruLink}
                  onChange={handleChange}
                  type="text"
                  placeholder="Paste link"
                />
              </div>

              {/* Address */}
              <div className="AddAchivment-field full">
                <label>Address *</label>
                <input
                  className="AddAchivment-input"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter address"
                  required
                />
              </div>

              {/* Short Description */}
              <div className="AddAchivment-field full">
                <label>Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="AddAchivment-textarea"
                  placeholder="Enter short description"
                ></textarea>
              </div>

              {/* Content */}
              <div className="AddAchivment-field full">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="AddAchivment-textarea"
                  placeholder="Enter detailed content"
                ></textarea>
              </div>

              {/* Effort */}
              <div className="AddAchivment-field">
                <label>Effort Type *</label>
                <select
                  name="effortType"
                  value={formData.effortType}
                  onChange={handleChange}
                  className="AddAchivment-select"
                  required
                >
                  <option value="">Select</option>
                  <option value="Group">Group Effort</option>
                  <option value="Individual">Individual Effort</option>
                </select>
              </div>

              {/* Category */}
              <div className="AddAchivment-field">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="AddAchivment-select"
                  required
                >
                  <option value="">Select</option>
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Innovation">Innovation</option>
                </select>
              </div>

              {/* Tags */}
              <div className="AddAchivment-field full">
                <label>Tags *</label>
                <input
                  className="AddAchivment-input"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter tags"
                  required
                />
              </div>

              {/* Upload */}
              <div className="AddAchivment-field full">
                <label>Upload Achievement Image *</label>
                <input
                  className="AddAchivment-file"
                  name="image"
                  onChange={handleFileChange}
                  type="file"
                  required={!isEditing}
                />
              </div>

            </div>

            {/* SUBMIT BUTTON */}
            <button className="AddAchivment-submit">
              {isEditing ? "Save Changes" : "Submit Achievement"}
            </button>

          </form>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="AddAchivment-right">

        <h2 className="AddAchivment-title">Achievement List</h2>

        <div className="AddAchivment-tableWrapper">
          <table className="AddAchivment-table">
            <thead>
              <tr>
                <th>Serial</th>
                <th>Title</th>
                <th>Achiever</th>
                <th>Effort</th>
                <th>Category</th>
                <th>Publish</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {achievements.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.achiever}</td>
                  <td>{item.effortType}</td>
                  <td>{item.category}</td>

                  {/* Publish Toggle */}
                  <td>
                    <button
                      className="AddAchivment-btn publish"
                      onClick={() => handleTogglePublish(index)}
                    >
                      {item.published ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </td>

                  {/* Icons */}
                  <td className="AddAchivment-actionColumn">
                    <button className="AddAchivment-btn view">
                      <FaEye />
                    </button>

                    <button
                      className="AddAchivment-btn edit"
                      onClick={() => handleEdit(index)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="AddAchivment-btn delete"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default AddAchivment;
