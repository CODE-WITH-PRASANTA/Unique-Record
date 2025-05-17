import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Api';
import './ManageURU.css'

const ManageURU = () => {
  const [urus, setUrus] = useState([]);
  const [editing, setEditing] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/uru/get-all-urus`)
      .then(response => {
        setUrus(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleEdit = (id) => {
    setEditing((prevEditing) => ({ ...prevEditing, [id]: true }));
  };

  const handleSave = (id) => {
    const uru = urus.find((uru) => uru._id === id);
    axios.put(`${API_URL}/uru/update-uru/${id}`, uru)
      .then(response => {
        setEditing((prevEditing) => ({ ...prevEditing, [id]: false }));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleChange = (id, field, value) => {
    setUrus((prevUrus) =>
      prevUrus.map((uru) => {
        if (uru._id === id) {
          return { ...uru, [field]: value };
        }
        return uru;
      })
    );
  };

  const handleStatusChange = (id, status) => {
    axios.put(`${API_URL}/uru/update-uru-status/${id}`, { status })
      .then(response => {
        setUrus((prevUrus) =>
          prevUrus.map((uru) => {
            if (uru._id === id) {
              return { ...uru, status };
            }
            return uru;
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="manage-uru-container">
      <h2 className="manage-uru-title">Manage URU</h2>
      <div className="manage-uru-table-container">
        <table className="manage-uru-table">
          <thead>
            <tr>
              <th className="manage-uru-table-header">S.No.</th>
              <th className="manage-uru-table-header" colSpan="2">Applicant Details</th>
            </tr>
          </thead>
          <tbody>
            {urus.map((uru, index) => (
              <React.Fragment key={uru._id}>
                <tr>
                  <td className="manage-uru-table-data" rowSpan="25">{index + 1}</td>
                  <th className="manage-uru-table-sub-header">Applicant Name</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.applicantName}
                        onChange={(e) =>
                          handleChange(uru._id, 'applicantName', e.target.value)
                        }
                      />
                    ) : (
                      uru.applicantName
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Sex</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.sex}
                        onChange={(e) =>
                          handleChange(uru._id, 'sex', e.target.value)
                        }
                      />
                    ) : (
                      uru.sex
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Date of Birth</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="date"
                        value={uru.dateOfBirth}
                        onChange={(e) =>
                          handleChange(uru._id, 'dateOfBirth', e.target.value)
                        }
                      />
                    ) : (
                      uru.dateOfBirth
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Address</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.address}
                        onChange={(e) =>
                          handleChange(uru._id, 'address', e.target.value)
                        }
                      />
                    ) : (
                      uru.address
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">District</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.district}
                        onChange={(e) =>
                          handleChange(uru._id, 'district', e.target.value)
                        }
                      />
                    ) : (
                      uru.district
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">State</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.state}
                        onChange={(e) =>
                          handleChange(uru._id, 'state', e.target.value)
                        }
                      />
                    ) : (
                      uru.state
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Pin Code</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.pinCode}
                        onChange={(e) =>
                          handleChange(uru._id, 'pinCode', e.target.value)
                        }
                      />
                    ) : (
                      uru.pinCode
                    )}
                  </td>
                </tr>
                <thead>
                  <tr>
                    <th className="manage-uru-table-header" colSpan="2">Educational Qualification and Contact Details</th>
                  </tr>
                </thead>
                <tr>
                  <th className="manage-uru-table-sub-header">Educational Qualification</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.educationalQualification}
                        onChange={(e) =>
                          handleChange(uru._id, 'educationalQualification', e.target.value)
                        }
                      />
                    ) : (
                      uru.educationalQualification
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">WhatsApp Mobile Number</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.whatsappMobileNumber}
                        onChange={(e) =>
                          handleChange(uru._id, 'whatsappMobileNumber', e.target.value)
                        }
                      />
                    ) : (
                      uru.whatsappMobileNumber
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Email ID</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="email"
                        value={uru.emailId}
                        onChange={(e) =>
                          handleChange(uru._id, 'emailId', e.target.value)
                        }
                      />
                    ) : (
                      uru.emailId
                    )}
                  </td>
                </tr>
                <thead>
                  <tr>
                    <th className="manage-uru-table-header" colSpan="2">Record Details</th>
                  </tr>
                </thead>
                <tr>
                  <th className="manage-uru-table-sub-header">Record Category</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.recordCategory}
                        onChange={(e) =>
                          handleChange(uru._id, 'recordCategory', e.target.value)
                        }
                      />
                    ) : (
                      uru.recordCategory
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Record Title</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.recordTitle}
                        onChange={(e) =>
                          handleChange(uru._id, 'recordTitle', e.target.value)
                        }
                      />
                    ) : (
                      uru.recordTitle
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Record Description</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <textarea
                        value={uru.recordDescription}
                        onChange={(e) =>
                          handleChange(uru._id, 'recordDescription', e.target.value)
                        }
                      />
                    ) : (
                      uru.recordDescription
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Purpose of Record Attempt</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.purposeOfRecordAttempt}
                        onChange={(e) =>
                          handleChange(uru._id, 'purposeOfRecordAttempt', e.target.value)
                        }
                      />
                    ) : (
                      uru.purposeOfRecordAttempt
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Date of Attempt</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="date"
                        value={uru.dateOfAttempt}
                        onChange={(e) =>
                          handleChange(uru._id, 'dateOfAttempt', e.target.value)
                        }
                      />
                    ) : (
                      uru.dateOfAttempt
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Record Venue</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <input
                        type="text"
                        value={uru.recordVenue}
                        onChange={(e) =>
                          handleChange(uru._id, 'recordVenue', e.target.value)
                        }
                      />
                    ) : (
                      uru.recordVenue
                    )}
                  </td>
                </tr>
                <thead>
                  <tr>
                    <th className="manage-uru-table-header" colSpan="2">Media Links</th>
                  </tr>
                </thead>
              <tr>
  <th className="manage-uru-table-sub-header">Google Drive Link</th>
  <td className="manage-uru-table-data">
    {editing[uru._id] ? (
      <input
        type="text"
        value={uru.googleDriveLink}
        onChange={(e) =>
          handleChange(uru._id, 'googleDriveLink', e.target.value)
        }
      />
    ) : (
      <a
        href={uru.googleDriveLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Google Drive Link
      </a>
    )}
  </td>
</tr>


<tr>
  <th className="manage-uru-table-sub-header">Facebook Link</th>
  <td className="manage-uru-table-data">
    {editing[uru._id] ? (
      <input
        type="text"
        value={uru.facebookLink}
        onChange={(e) =>
          handleChange(uru._id, 'facebookLink', e.target.value)
        }
      />
    ) : (
      <a
        href={uru.facebookLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Facebook Profile
      </a>
    )}
  </td>
</tr>

<tr>
  <th className="manage-uru-table-sub-header">YouTube Link</th>
  <td className="manage-uru-table-data">
    {editing[uru._id] ? (
      <input
        type="text"
        value={uru.youtubeLink}
        onChange={(e) =>
          handleChange(uru._id, 'youtubeLink', e.target.value)
        }
      />
    ) : (
      <a
        href={uru.youtubeLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        View YouTube Channel
      </a>
    )}
  </td>
</tr>

<tr>
  <th className="manage-uru-table-sub-header">Instagram Link</th>
  <td className="manage-uru-table-data">
    {editing[uru._id] ? (
      <input
        type="text"
        value={uru.instagramLink}
        onChange={(e) =>
          handleChange(uru._id, 'instagramLink', e.target.value)
        }
      />
    ) : (
      <a
        href={uru.instagramLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Instagram Profile
      </a>
    )}
  </td>
</tr>

<tr>
  <th className="manage-uru-table-sub-header">LinkedIn Link</th>
  <td className="manage-uru-table-data">
    {editing[uru._id] ? (
      <input
        type="text"
        value={uru.linkedInLink}
        onChange={(e) =>
          handleChange(uru._id, 'linkedInLink', e.target.value)
        }
      />
    ) : (
      <a
        href={uru.linkedInLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        View LinkedIn Profile
      </a>
    )}
  </td>
</tr>

<tr>
  <th className="manage-uru-table-sub-header">X Link</th>
  <td className="manage-uru-table-data">
    {editing[uru._id] ? (
      <input
        type="text"
        value={uru.xLink}
        onChange={(e) =>
          handleChange(uru._id, 'xLink', e.target.value)
        }
      />
    ) : (
      <a
        href={uru.xLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        View X Profile
      </a>
    )}
  </td>
</tr>

                <thead>
                  <tr>
                    <th className="manage-uru-table-header" colSpan="2">Files</th>
                  </tr>
                </thead>
<tr>
  <th className="manage-uru-table-sub-header">Photo</th>
  <td className="manage-uru-table-data">
    {editing[uru._id] ? (
      <input
        type="text"
        value={uru.photoUrl}
        onChange={(e) =>
          handleChange(uru._id, 'photoUrl', e.target.value)
        }
      />
    ) : (
      <a
        href={uru.photoUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <img src={uru.photoUrl} alt="Photo" className="manage-uru-photo" />
      </a>
    )}
  </td>
</tr>

<tr>
  <th className="manage-uru-table-sub-header">Video</th>
  <td className="manage-uru-table-data">
    {editing[uru._id] ? (
      <input
        type="text"
        value={uru.videoUrl}
        onChange={(e) =>
          handleChange(uru._id, 'videoUrl', e.target.value)
        }
      />
    ) : (
      <a
        href={uru.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <video src={uru.videoUrl} controls className="manage-uru-video" />
      </a>
    )}
  </td>
</tr>

<tr>
  <th className="manage-uru-table-sub-header">Document</th>
  <td className="manage-uru-table-data">
    {editing[uru._id] ? (
      <input
        type="text"
        value={uru.documentUrl}
        onChange={(e) =>
          handleChange(uru._id, 'documentUrl', e.target.value)
        }
      />
    ) : (
      <a
        href={uru.documentUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        Download Document
      </a>
    )}
  </td>
</tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Status</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <select
                        value={uru.status}
                        onChange={(e) =>
                          handleStatusChange(uru._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      uru.status
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="manage-uru-table-sub-header">Action</th>
                  <td className="manage-uru-table-data">
                    {editing[uru._id] ? (
                      <button
                        className="manage-uru-save-btn"
                        onClick={() => handleSave(uru._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="manage-uru-edit-btn"
                        onClick={() => handleEdit(uru._id)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageURU;