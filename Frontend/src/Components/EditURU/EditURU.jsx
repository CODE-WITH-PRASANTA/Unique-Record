import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./EditURU.css";
import { API_URL } from "../../Api";

const EditURU = ({
  editingData,
  setEditingData,
  setShowModal,
  categories,
  refreshData,
}) => {
  const token = localStorage.getItem("token");
  const [formState, setFormState] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize form when editingData changes
  useEffect(() => {
    if (editingData) {
      setFormState(JSON.parse(JSON.stringify(editingData)));
    }
  }, [editingData]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormState((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Update API
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Removed items
      formData.append(
        "removedPhotos",
        JSON.stringify(formState.removedPhotos || [])
      );
      formData.append(
        "removedVideos",
        JSON.stringify(formState.removedVideos || [])
      );
      formData.append(
        "removedDocuments",
        JSON.stringify(formState.removedDocuments || [])
      );

      for (const key in formState) {
        if (
          [
            "photos",
            "videos",
            "documents",
            "removedPhotos",
            "removedVideos",
            "removedDocuments",
          ].includes(key)
        )
          continue;

        if (key === "witness1" || key === "witness2") {
          formData.append(key, JSON.stringify(formState[key]));
        } else if (Array.isArray(formState[key])) {
          formData.append(key, JSON.stringify(formState[key]));
        } else {
          formData.append(key, formState[key]);
        }
      }

      // Add files
      (formState.photos || []).forEach((p) => {
        if (p.file) formData.append("photos", p.file);
      });
      (formState.videos || []).forEach((v) => {
        if (v.file) formData.append("videos", v.file);
      });
      (formState.documents || []).forEach((d) => {
        if (d.file) formData.append("documents", d.file);
      });

      await axios.put(`${API_URL}/uru/update-uru/${formState._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success!", "URU updated successfully", "success");
      refreshData();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to update URU", "error");
    } finally {
      setLoading(false);
    }
  };

  // Remove media
  const handleRemove = (field, index) => {
    const updated = [...(formState[field] || [])];
    const removedItem = updated.splice(index, 1)[0];

    const removedKey =
      field === "photos"
        ? "removedPhotos"
        : field === "videos"
        ? "removedVideos"
        : "removedDocuments";

    setFormState((prev) => ({
      ...prev,
      [field]: updated,
      [removedKey]: [...(prev[removedKey] || []), removedItem],
    }));
  };

  // Upload files
  const handleFileUpload = (field, files) => {
    const newFiles = Array.from(files).map((f) => ({
      url: URL.createObjectURL(f),
      public_id: null,
      file: f,
    }));
    setFormState((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ...newFiles],
    }));
  };

  // Link inputs
  const LinkInputList = ({ label, field }) => {
    const values = formState[field] || [];

    const handleAdd = () => {
      setFormState((prev) => ({
        ...prev,
        [field]: [...values, ""],
      }));
    };

    const handleChangeLink = (i, val) => {
      const updated = [...values];
      updated[i] = val;
      setFormState((prev) => ({ ...prev, [field]: updated }));
    };

    const handleRemoveLink = (i) => {
      const updated = [...values];
      updated.splice(i, 1);
      setFormState((prev) => ({ ...prev, [field]: updated }));
    };

    return (
      <div className="link-section">
        <label>{label}:</label>
        {values.map((val, i) => (
          <div key={i} className="link-input-row">
            <input
              type="url"
              value={val}
              placeholder={`Enter ${label} link`}
              onChange={(e) => handleChangeLink(i, e.target.value)}
              className="form-control"
            />
            <button
              type="button"
              className="btn-remove-link"
              onClick={() => handleRemoveLink(i)}
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-add-link"
          onClick={handleAdd}
        >
          + Add
        </button>
      </div>
    );
  };

  if (!formState) return null;

  return (
    <div className="edit-modal show">
      <div className="edit-modal-content">

          {/* Position Section */}
              <h3>Position Applied For</h3>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>
                    <input
                      type="radio"
                      name="position"
                      value="Unique Record"
                      checked={formState?.position === "Unique Record"}
                      onChange={(e) =>
                        setFormState({ ...formState, position: e.target.value })
                      }
                    />
                    Unique Record
                  </label>
                </div>
                <div className="manage-uru-form-group">
                  <label>
                    <input
                      type="radio"
                      name="position"
                      value="Unique Activity"
                      checked={formState?.position === "Unique Activity"}
                      onChange={(e) =>
                        setFormState({ ...formState, position: e.target.value })
                      }
                    />
                    Unique Activity
                  </label>
                </div>
              </div>


        <h2>Edit URU Data</h2>
        <form onSubmit={handleUpdate}>
          {/* Applicant Details */}
          <h3>1. Applicant Details</h3>
          <div className="manage-uru-form-row">
            <div className="manage-uru-form-group">
              <label>Application Number:</label>
              <input
                type="text"
                name="applicationNumber"
                value={formState?.applicationNumber || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    applicationNumber: e.target.value,
                  })
                }
                readOnly
                className="form-control"
              />
            </div>

            <div className="manage-uru-form-group">
              <label>Applicant Name:</label>
              <input
                type="text"
                name="applicantName"
                value={formState?.applicantName || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    applicantName: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Sex:</label>
              <select
                name="sex"
                value={formState?.sex || ""}
                onChange={(e) =>
                  setFormState({ ...formState, sex: e.target.value })
                }
                className="form-control"
              >
                <option value="">-- Select --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="transgender">Transgender</option>
              </select>
            </div>
          </div>
          <div className="manage-uru-form-row">
            <div className="manage-uru-form-group">
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formState?.dateOfBirth?.slice(0, 10) || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    dateOfBirth: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formState?.address || ""}
                onChange={(e) =>
                  setFormState({ ...formState, address: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>District:</label>
              <input
                type="text"
                name="district"
                value={formState?.district || ""}
                onChange={(e) =>
                  setFormState({ ...formState, district: e.target.value })
                }
                className="form-control"
              />
            </div>
          </div>
          <div className="manage-uru-form-row">
            <div className="manage-uru-form-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={formState?.state || ""}
                onChange={(e) =>
                  setFormState({ ...formState, state: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={formState?.country || ""}
                onChange={(e) =>
                  setFormState({ ...formState, country: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Pin Code:</label>
              <input
                type="text"
                name="pinCode"
                value={formState?.pinCode || ""}
                onChange={(e) =>
                  setFormState({ ...formState, pinCode: e.target.value })
                }
                className="form-control"
              />
            </div>
          </div>
          <div className="manage-uru-form-row">
            <div className="manage-uru-form-group">
              <label>Educational Qualification:</label>
              <input
                type="text"
                name="educationalQualification"
                value={formState?.educationalQualification || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    educationalQualification: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Whatsapp Mobile Number:</label>
              <input
                type="text"
                name="whatsappMobileNumber"
                value={formState?.whatsappMobileNumber || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    whatsappMobileNumber: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Email Id:</label>
              <input
                type="email"
                name="emailId"
                value={formState?.emailId || ""}
                onChange={(e) =>
                  setFormState({ ...formState, emailId: e.target.value })
                }
                className="form-control"
              />
            </div>
          </div>
          <div className="manage-uru-form-row">
            <div className="manage-uru-form-group">
              <label>Occupation:</label>
              <input
                type="text"
                name="occupation"
                value={formState?.occupation || ""}
                onChange={(e) =>
                  setFormState({ ...formState, occupation: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Form Category:</label>
              <select
                name="formCategory"
                value={formState?.formCategory || ""}
                onChange={(e) =>
                  setFormState({ ...formState, formCategory: e.target.value })
                }
                className="form-control"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="manage-uru-form-group">
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={formState?.price || ""}
                readOnly
                className="form-control"
              />
            </div>
          </div>

          {/* Record / ActivityDetails */}
          <h3>2. Record / ActivityDetails</h3>
          <div className="manage-uru-form-row">
            <div className="manage-uru-form-group">
              <label>Effort Type:</label>
              <select
                name="recordCategory"
                value={formState?.recordCategory || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    recordCategory: e.target.value,
                  })
                }
                className="form-control"
              >
                <option value="">-- Select --</option>
                <option value="individual">Individual Effort</option>
                <option value="group">Group Effort</option>
              </select>
            </div>
            <div className="manage-uru-form-group">
              <label>Record / ActivityTitle:</label>
              <textarea
                name="recordTitle"
                value={formState?.recordTitle || ""}
                onChange={(e) =>
                  setFormState({ ...formState, recordTitle: e.target.value })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Record / ActivityDescription:</label>
              <textarea
                name="recordDescription"
                value={formState?.recordDescription || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    recordDescription: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>
          </div>
          <div className="manage-uru-form-row">
            <div className="manage-uru-form-group">
              <label>Purpose of Record / ActivityAttempt:</label>
              <textarea
                name="purposeOfRecordAttempt"
                value={formState?.purposeOfRecordAttempt || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    purposeOfRecordAttempt: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Date of Attempt:</label>
              <input
                type="date"
                name="dateOfAttempt"
                value={formState?.dateOfAttempt?.slice(0, 10) || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    dateOfAttempt: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>
            <div className="manage-uru-form-group">
              <label>Record / ActivityVenue:</label>
              <input
                type="text"
                name="recordVenue"
                value={formState?.recordVenue || ""}
                onChange={(e) =>
                  setFormState({ ...formState, recordVenue: e.target.value })
                }
                className="form-control"
              />
            </div>
          </div>
          <div className="manage-uru-form-group">
            <label>Organisation Name:</label>
            <input
              type="text"
              name="organisationName"
              value={formState?.organisationName || ""}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  organisationName: e.target.value,
                })
              }
              className="form-control"
            />
          </div>

          {/* Social Media Links */}
          <h3>Social Media Links</h3>
          <LinkInputList label="Google Drive" field="googleDriveLink" />
          <LinkInputList label="YouTube" field="youtubeLink" />
          <LinkInputList label="Instagram" field="instagramLink" />
          <LinkInputList label="Facebook" field="facebookLink" />
          <LinkInputList label="LinkedIn" field="linkedInLink" />
          <LinkInputList label="X (Twitter)" field="xLink" />
          <LinkInputList label="Pinterest" field="pinterestLink" />
          <LinkInputList label="Other Media" field="otherMediaLink" />

          {/* Media */}
          <h3>3. Media & Documents</h3>
          <div className="photo-section">
            <label>Photos:</label>
            <div className="media-preview">
              {formState?.photos?.length ? (
                formState.photos.map((p, i) => (
                  <div key={i} className="media-item">
                    <a href={p.url} target="_blank" rel="noreferrer">
                      <img src={p.url} alt="" />
                    </a>
                    <span
                      className="uru-remove-btn"
                      onClick={() => handleRemove("photos", i)}
                    >
                      ❌
                    </span>
                  </div>
                ))
              ) : (
                <p>No photos uploaded</p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload("photos", e.target.files)}
              className="form-control-file"
            />
          </div>

          <div className="video-section">
            <label>Videos:</label>
            <div className="media-preview">
              {formState?.videos?.length ? (
                formState.videos.map((v, i) => (
                  <div key={i} className="media-item">
                    <video src={v.url} controls />
                    <span
                      className="uru-remove-btn"
                      onClick={() => handleRemove("videos", i)}
                    >
                      ❌
                    </span>
                  </div>
                ))
              ) : (
                <p>No videos uploaded</p>
              )}
            </div>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileUpload("videos", e.target.files)}
              className="form-control-file"
            />
          </div>

<div className="document-section">
  <label>Documents:</label>
  <ul className="document-list">
    {formState?.documents?.length ? (
      formState.documents.map((d, i) => (
        <li key={i} className="document-item">
          <a
            href={d.url}
            target="_blank"
            rel="noreferrer"
            className="document-link"
          >
            View Document {i + 1}
          </a>
          <span
            className="uru-remove-btn"
            onClick={() => handleRemove("documents", i)}
          >
            ❌
          </span>
        </li>
      ))
    ) : (
      <p className="no-documents">No documents uploaded</p>
    )}
  </ul>
  <input
    type="file"
    accept=".pdf,.doc,.docx,.txt"
    multiple
    onChange={(e) => handleFileUpload("documents", e.target.files)}
    className="form-control-file document-upload"
  />
</div>

{/* Witness Details */}
<h3>4. Witness Details</h3>
{["witness1", "witness2"].map((w) => (
<div key={w}>
  <div className="manage-uru-form-row">
    <div className="manage-uru-form-group">
      <label>{w} Name:</label>
      <input
        type="text"
        name={`${w}.name`}
        value={formState?.[w]?.name || ""}
        onChange={handleChange}
        className="form-control"
      />
    </div>
    <div className="manage-uru-form-group">
      <label>{w} Designation:</label>
      <input
        type="text"
        name={`${w}.designation`}
        value={formState?.[w]?.designation || ""}
        onChange={handleChange}
        className="form-control"
      />
    </div>
    <div className="manage-uru-form-group">
      <label>{w} Address:</label>
      <input
        type="text"
        name={`${w}.address`}
        value={formState?.[w]?.address || ""}
        onChange={handleChange}
        className="form-control"
      />
    </div>
  </div>
  <div className="manage-uru-form-row">    <div className="manage-uru-form-group">
      <label>{w} Mobile Number:</label>
      <input
        type="text"
        name={`${w}.mobileNumber`}
        value={formState?.[w]?.mobileNumber || ""}
        onChange={handleChange}
        className="form-control"
      />
    </div>
    <div className="manage-uru-form-group">
      <label>{w} Email:</label>
      <input
        type="email"
        name={`${w}.emailId`}
        value={formState?.[w]?.emailId || ""}
        onChange={handleChange}
        className="form-control"
      />
    </div>
  </div>
</div>
))}

{/* Payment Details */}
<h3>5. Payment Details</h3>
<div className="manage-uru-form-row">
  <div className="manage-uru-form-group">
    <label>Razorpay Order ID:</label>
    <input
      type="text"
      name="razorpayOrderId"
      value={formState?.razorpayOrderId || ""}
      readOnly
      className="form-control"
    />
  </div>
  <div className="manage-uru-form-group">
    <label>Razorpay Payment ID:</label>
    <input
      type="text"
      name="razorpayPaymentId"
      value={formState?.razorpayPaymentId || ""}
      readOnly
      className="form-control"
    />
  </div>
  <div className="manage-uru-form-group">
    <label>Razorpay Signature:</label>
    <input
      type="text"
      name="razorpaySignature"
      value={formState?.razorpaySignature || ""}
      readOnly
      className="form-control"
    />
  </div>
</div>

{/* Buttons */}
<div
  className="manage-uru-form-row"
  style={{ justifyContent: "flex-end" }}
>
  <button
    type="button"
    className="btn-cancel"
    onClick={() => setShowModal(false)}
    disabled={loading}
  >
    Cancel
  </button>
  <button type="submit" className="btn-update" disabled={loading}>
    {loading ? "Updating..." : "Update"}
  </button>
</div>
</form>
</div>
</div>
);
};

export default EditURU;