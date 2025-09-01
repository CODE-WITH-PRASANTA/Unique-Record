import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./EditURU.css";
import { API_URL } from "../../Api";

const EditURU = ({ editingData, setEditingData, setShowModal, categories, refreshData }) => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  if (!editingData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditingData({ ...editingData, [parent]: { ...editingData[parent], [child]: value } });
    } else setEditingData({ ...editingData, [name]: value });
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();

    // Track removed media before submitting
    formData.append("removedPhotos", JSON.stringify(editingData.removedPhotos || []));
    formData.append("removedVideos", JSON.stringify(editingData.removedVideos || []));
    formData.append("removedDocuments", JSON.stringify(editingData.removedDocuments || []));

    for (const key in editingData) {
  if (["photos", "videos", "documents", "removedPhotos", "removedVideos", "removedDocuments"].includes(key)) continue;

  if (key === "witness1" || key === "witness2") {
    formData.append(key, JSON.stringify(editingData[key]));
  } 
  // ✅ Handle array fields properly
  else if (Array.isArray(editingData[key])) {
    formData.append(key, JSON.stringify(editingData[key]));
  } 
  else {
    formData.append(key, editingData[key]);
  }
}


    // Add files
    (editingData.photos || []).forEach((p) => {
      if (p.file) formData.append("photos", p.file);
    });
    (editingData.videos || []).forEach((v) => {
      if (v.file) formData.append("videos", v.file);
    });
    (editingData.documents || []).forEach((d) => {
      if (d.file) formData.append("documents", d.file);
    });

    await axios.put(`${API_URL}/uru/update-uru/${editingData._id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
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

    const handleRemove = (field, index) => {
    const updated = [...(editingData[field] || [])];
    const removedItem = updated.splice(index, 1)[0];

    const removedKey =
      field === "photos" ? "removedPhotos" :
      field === "videos" ? "removedVideos" :
      "removedDocuments";

    setEditingData({
      ...editingData,
      [field]: updated,
      [removedKey]: [...(editingData[removedKey] || []), removedItem]
    });
  };


  // 🔹 Add new links
  const handleAddLink = (field, newLink) => {
    if (!newLink) return;
    const updated = [...(editingData[field] || []), newLink];
    setEditingData({ ...editingData, [field]: updated });
  };

 const handleFileUpload = (field, files) => {
  const newFiles = Array.from(files).map(f => ({
    url: URL.createObjectURL(f),  // preview
    public_id: null,              // will be filled after backend upload
    file: f                       // keep actual file to send in FormData
  }));
  setEditingData({
    ...editingData,
    [field]: [...(editingData[field] || []), ...newFiles]
  });
};


  // 🔹 Reusable form fields
  const Input = ({ label, ...props }) => (
    <div className="manage-uru-form-group"><label>{label}</label><input {...props} /></div>
  );
  const TextArea = ({ label, ...props }) => (
    <div className="manage-uru-form-group"><label>{label}</label><textarea {...props} /></div>
  );
  const Select = ({ label, name, value, options }) => (
    <div className="manage-uru-form-group">
      <label>{label}</label>
      <select name={name} value={value} onChange={handleChange}>
        <option value="">-- Select --</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  
  
  
  return (
    <div className="edit-modal show">
      <div className="edit-modal-content">
        <h2>Edit URU Data</h2>
        <form onSubmit={handleUpdate}>
          {/* Applicant Details */}
          <h3>1. Applicant Details</h3>
          <div className="manage-uru-form-row">
            <Input label="Application Number:" name="applicationNumber" value={editingData.applicationNumber} onChange={handleChange} readOnly />
            <Input label="Applicant Name:" name="applicantName" value={editingData.applicantName} onChange={handleChange} readOnly />
            <Select label="Sex:" name="sex" value={editingData.sex || ""} options={["male","female","transgender"]} />
          </div>
          <div className="manage-uru-form-row">
            <Input label="Date of Birth:" type="date" name="dateOfBirth" value={editingData.dateOfBirth?.slice(0,10) || ""} onChange={handleChange} />
            <Input label="Address:" name="address" value={editingData.address} onChange={handleChange} />
            <Input label="District:" name="district" value={editingData.district} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-row">
            <Input label="Country:" name="country" value={editingData.country} onChange={handleChange} />
            <Input label="State:" name="state" value={editingData.state} onChange={handleChange} />
            <Input label="Pin Code:" name="pinCode" value={editingData.pinCode} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-row">
            <Input label="Educational Qualification:" name="educationalQualification" value={editingData.educationalQualification} onChange={handleChange} />
            <Input label="Whatsapp Mobile Number:" name="whatsappMobileNumber" value={editingData.whatsappMobileNumber} onChange={handleChange} />
            <Input label="Email Id:" type="email" name="emailId" value={editingData.emailId} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-row">
            <Input label="Occupation:" name="occupation" value={editingData.occupation} onChange={handleChange} />
            <div className="manage-uru-form-group">
              <label>Form Category:</label>
              <select name="formCategory" value={editingData.formCategory} onChange={handleChange}>
                <option value="">-- Select Category --</option>
                {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <Input label="Price:" type="number" name="price" value={editingData.price} readOnly />
          </div>

          {/* Record Details */}
          <h3>2. Record Details</h3>
          <div className="manage-uru-form-row">
            <Select label="Effort Type:" name="recordCategory" value={editingData.recordCategory || ""} options={["individual","group"]} />
            <TextArea label="Record Title:" name="recordTitle" value={editingData.recordTitle} onChange={handleChange} />
            <TextArea label="Record Description:" name="recordDescription" value={editingData.recordDescription} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-row">
            <TextArea label="Purpose of Record Attempt:" name="purposeOfRecordAttempt" value={editingData.purposeOfRecordAttempt} onChange={handleChange} />
            <Input label="Date of Attempt:" type="date" name="dateOfAttempt" value={editingData.dateOfAttempt?.slice(0,10) || ""} onChange={handleChange} />
            <Input label="Record Venue:" name="recordVenue" value={editingData.recordVenue} onChange={handleChange} />
          </div>
          <Input label="Organisation Name:" name="organisationName" value={editingData.organisationName} onChange={handleChange} />


         <h3>Social Media Links</h3>
          {["googleDriveLink","youtubeLink","instagramLink","facebookLink","linkedInLink","xLink","pinterestLink","otherMediaLink"].map((key) => (
            <div key={key} className="link-section">
              <label>{key.replace(/([A-Z])/g," $1") + "s"}:</label>
            <ul>
                {editingData[key]?.length ? editingData[key].map((l,i)=>(
                    <li key={i}>
                    <a href={l} target="_blank" rel="noreferrer">{l}</a>
                    <span className="uru-remove-btn" onClick={()=>handleRemove(key,i)}>❌</span>
                    </li>
                )) : <p>No {key} links</p>}
                </ul>
              <input type="url" placeholder="Add new link" 
                onKeyDown={(e)=>{ if(e.key==="Enter"){ e.preventDefault(); handleAddLink(key, e.target.value); e.target.value=""; }}} />
            </div>
          ))}

          {/* ✅ Photos */}
          <h3>3. Media & Documents</h3>
          <div className="photo-section">
            <label>Photos:</label>
            <div className="media-preview">
                  {editingData.photos?.length ? editingData.photos.map((p,i)=>(
                  <div key={i} className="media-item">
                    <a href={p.url} target="_blank" rel="noreferrer">
                      <img src={p.url} alt="" />
                    </a>
                    <span className="uru-remove-btn" onClick={()=>handleRemove("photos",i)}>❌</span>
                  </div>
                )) : <p>No photos uploaded</p>}
            </div>
            <input type="file" accept="image/*" multiple onChange={(e)=>handleFileUpload("photos", e.target.files)} />
          </div>

          {/* ✅ Videos */}
          <div className="video-section">
            <label>Videos:</label>
            <div className="media-preview">       
              {editingData.videos?.length ? editingData.videos.map((v,i)=>(
                <div key={i} className="media-item">
                  <video src={v.url} controls />
                  <span className="uru-remove-btn" onClick={()=>handleRemove("videos",i)}>❌</span>
                </div>
              )) : <p>No videos uploaded</p>}
            </div>
            <input type="file" accept="video/*" multiple onChange={(e)=>handleFileUpload("videos", e.target.files)} />
          </div>

          {/* ✅ Documents */}
          <div className="document-section">
            <label>Documents:</label>
            <ul>  
              {editingData.documents?.length ? editingData.documents.map((d,i)=>(
              <li key={i}>
                <a href={d.url} target="_blank" rel="noreferrer">View Document {i+1}</a>
                <span className="uru-remove-btn" onClick={()=>handleRemove("documents",i)}>❌</span>
              </li>
            )) : <p>No documents uploaded</p>}
            </ul>
            <input type="file" accept=".pdf,.doc,.docx,.txt" multiple onChange={(e)=>handleFileUpload("documents", e.target.files)} />
          </div>

          {/* Payment Details */}
          <h3>4. Payment Details</h3>
          <div className="manage-uru-form-row">
            <Input label="Razorpay Order ID:" name="razorpayOrderId" value={editingData.razorpayOrderId} readOnly />
            <Input label="Razorpay Payment ID:" name="razorpayPaymentId" value={editingData.razorpayPaymentId} readOnly />
            <Input label="Razorpay Signature:" name="razorpaySignature" value={editingData.razorpaySignature} readOnly />
          </div>

          {/* Witness Details */}
          <h3>5. Witness Details</h3>
          {["witness1","witness2"].map((w) => (
            <div key={w}>
              <div className="manage-uru-form-row">
                <Input label={`${w} Name:`} name={`${w}.name`} value={editingData[w]?.name || ""} onChange={handleChange} />
                <Input label={`${w} Designation:`} name={`${w}.designation`} value={editingData[w]?.designation || ""} onChange={handleChange} />
                <Input label={`${w} Address:`} name={`${w}.address`} value={editingData[w]?.address || ""} onChange={handleChange} />
              </div>
              <div className="manage-uru-form-row">
                <Input label={`${w} Mobile Number:`} name={`${w}.mobileNumber`} value={editingData[w]?.mobileNumber || ""} onChange={handleChange} />
                <Input label={`${w} Email:`} type="email" name={`${w}.emailId`} value={editingData[w]?.emailId || ""} onChange={handleChange} />
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="manage-uru-form-row" style={{ justifyContent:"flex-end" }}>
            <button type="button" className="btn-cancel" onClick={()=>setShowModal(false)} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-update" disabled={loading}>{loading ? "Updating..." : "Update"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditURU;
