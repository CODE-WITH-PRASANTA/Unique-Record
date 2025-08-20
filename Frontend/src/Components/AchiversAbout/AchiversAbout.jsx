import React, { useState, useEffect } from "react";
import "./AchiversAbout.css";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaEnvelope, FaShareAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { API_URL } from '../../Api';
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";  // ✅ FIXED IMPORT


const AchiversAbout = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [uru, setUru] = useState({});
  const { id } = useParams();
  const sharableLink = `${window.location.origin}/${uru.applicationNumber}`;

  useEffect(() => {
    const fetchPublishedUruById = async () => {
      try {
        const response = await fetch(`${API_URL}/uru/fetch-published-uru/${id}`);
        const data = await response.json();
        setUru(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPublishedUruById();
  }, [id]);

  // Functions
  const downloadCertificate = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `${name}_certificate.pdf`;
    link.click();
  };

  const shareOnFacebook = (url, name, postUrl) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
    window.open(facebookUrl, '_blank');
  };

  const shareOnTwitter = (url, name, postUrl) => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${postUrl}&text=Check out ${name}'s certificate!`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnWhatsApp = (url, name, postUrl) => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=Check out ${name}'s certificate! ${postUrl}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnEmail = (url, name, postUrl) => {
    const emailUrl = `mailto:?subject=${name}'s Certificate&body=Check out ${name}'s certificate! ${postUrl}`;
    window.open(emailUrl, '_blank');
  };

  const shareOnOtherPlatforms = async (url, name, postUrl) => {
    try {
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `${name}_certificate.jpg`, { type: blob.type });

        await navigator.share({
          title: `${name}'s Certificate`,
          text: `Check out ${name}'s certificate!`,
          url: postUrl,
          files: [file],
        });
      } else {
        await navigator.share({
          title: `${name}'s Certificate`,
          text: `Check out ${name}'s certificate!`,
          url: postUrl,
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);

      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" }); // Aug
      const year = date.getFullYear();

      // Add ordinal suffix
      const getOrdinal = (n) => {
        if (n > 3 && n < 21) return "th";
        switch (n % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      };

      return `${day}${getOrdinal(day)} ${month} ${year}`;
    };


  return (
    <div className="achiver-about-wrapper">
      {/* Header Card */}
     <div className="achiver-about-card">
  {/* Left Side Image */}
  <div className="achiver-about-left">
    <img
      src={uru.certificateUrl}
      alt={uru.applicantName}
      className="achiver-about-photo"
    />
  </div>

 <div className="achiver-about-right">
  <h2 className="achiver-about-title">
    {uru.applicationNumber}. {uru.position}
  </h2>

{/* Wrap details + photo in flex */}
<div className="achiver-right-top">
  <div className="achiver-about-details">
    <p><strong>Registration No:</strong> {uru.regNo}</p>
    
   <p>
  <strong>Reg. Date:</strong>{" "}
  {uru.createdAt ? formatDate(uru.createdAt) : "N/A"}
</p>

    
    <p><strong>Name:</strong> {uru.applicantName}</p>
    <p><strong>Ph No:</strong> {uru.whatsappMobileNumber}</p>
    
   <p>
  <strong>Date Of Achieving:</strong>{" "}
  {uru.createdAt
    ? formatDate(new Date(new Date(uru.createdAt).setDate(new Date(uru.createdAt).getDate() + 1)))
    : "N/A"}
</p>
    <p><strong>Submitting Category:</strong> {uru.formCategory}</p>
    <p><strong>Effort Type:</strong> {uru.recordCategory}</p>
  </div>

  {/* Applicant Photo */}
  <div className="achiver-about-photo-section">
    <img
      src={uru.photoUrl}
      alt={`${uru.applicantName} Profile`}
      className="achiver-applicant-photo"
    />
  </div>
</div>


  {/* Download Button */}
  <button
    className="achiver-download-btn"
    onClick={() => downloadCertificate(uru.certificateUrl, uru.applicantName)}
  >
    <FiDownload className="Achiver-download-icon" /> Download
  </button>

    {/* Share Buttons */}
    <div className="achiver-share-buttons">
      <button
        className="share-btn fb"
        onClick={() =>
          shareOnFacebook(uru.certificateUrl, uru.applicantName, sharableLink)
        }
      >
        <FaFacebookF />
      </button>
      <button
        className="share-btn x"
        onClick={() =>
          shareOnTwitter(uru.certificateUrl, uru.applicantName, sharableLink)
        }
      >
        <FaTwitter />
      </button>
      <button
        className="share-btn wa"
        onClick={() =>
          shareOnWhatsApp(uru.certificateUrl, uru.applicantName, sharableLink)
        }
      >
        <FaWhatsapp />
      </button>
      <button
        className="share-btn mail"
        onClick={() =>
          shareOnEmail(uru.certificateUrl, uru.applicantName, sharableLink)
        }
      >
        <FaEnvelope />
      </button>
      <button
        className="share-btn more"
        onClick={() =>
          shareOnOtherPlatforms(uru.certificateUrl, uru.applicantName, sharableLink)
        }
      >
        <FaShareAlt />
      </button>
    </div>
  </div>
      </div>
      {/* Tabs Section */}
      <div className="achiver-tabs">
        <button
          className={`tab-btn ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
        <button
          className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
      </div>

      {/* Tab Content */}
      <div className="achiver-tab-content">
        {activeTab === "summary" ? (
          <p className="achiver-summary">{uru.recordDescription}</p>
        ) : (
          <div className="achiver-description-table">
            <h3>Basic Information</h3>
            <table>
              <tbody>
                <tr><td>Application Number</td><td>{uru.applicationNumber || "N/A"}</td></tr>
                <tr><td>Applicant Name</td><td>{uru.applicantName || "N/A"}</td></tr>
                <tr><td>Sex</td><td>{uru.sex || "N/A"}</td></tr>
                <tr><td>Date of Birth</td><td>{uru.dateOfBirth ? new Date(uru.dateOfBirth).toLocaleDateString() : "N/A"}</td></tr>
                <tr><td>Age</td><td>{uru.dateOfBirth ? new Date().getFullYear() - new Date(uru.dateOfBirth).getFullYear() : "N/A"}</td></tr>
                <tr><td>Address</td><td>{uru.address || "N/A"}</td></tr>
                <tr><td>District</td><td>{uru.district || "N/A"}</td></tr>
                <tr><td>State</td><td>{uru.state || "N/A"}</td></tr>
                <tr><td>Country</td><td>{uru.country || "N/A"}</td></tr>
                <tr><td>Pin Code</td><td>{uru.pinCode || "N/A"}</td></tr>
                <tr><td>Educational Qualification</td><td>{uru.educationalQualification || "N/A"}</td></tr>
                <tr><td>WhatsApp Mobile</td><td>{uru.whatsappMobileNumber || "N/A"}</td></tr>
                <tr><td>Email ID</td><td>{uru.emailId || "N/A"}</td></tr>
                <tr><td>Occupation</td><td>{uru.occupation || "N/A"}</td></tr>
              </tbody>
            </table>

            <h3>Record/Activity Details</h3>
            <table>
              <tbody>
                <tr><td>Effort Type</td><td>{uru.recordCategory || "N/A"}</td></tr>
                <tr><td>Submiting Category</td><td>{uru.formCategory || "N/A"}</td></tr>
                <tr><td>Type</td><td>{uru.position || "N/A"}</td></tr>
                <tr><td>Title</td><td>{uru.recordTitle || "N/A"}</td></tr>
                <tr><td>Description</td><td>{uru.recordDescription || "N/A"}</td></tr>
                <tr><td>Purpose</td><td>{uru.purposeOfRecordAttempt || "N/A"}</td></tr>
                <tr><td>Date of Attempt</td><td>{uru.dateOfAttempt ? new Date(uru.dateOfAttempt).toLocaleDateString() : "N/A"}</td></tr>
                <tr><td>Venue</td><td>{uru.recordVenue || "N/A"}</td></tr>
                <tr><td>Organisation/Group</td><td>{uru.organisationName || "N/A"}</td></tr>
              </tbody>
            </table>

            <h3>Witness Information</h3>
            <table>
              <tbody>
                <tr><td>Witness 1 - Name</td><td>{uru.witness1?.name || "N/A"}</td></tr>
                <tr><td>Witness 1 - Designation</td><td>{uru.witness1?.designation || "N/A"}</td></tr>
                <tr><td>Witness 1 - Address</td><td>{uru.witness1?.address || "N/A"}</td></tr>
                <tr><td>Witness 1 - Mobile</td><td>{uru.witness1?.mobileNumber || "N/A"}</td></tr>
                <tr><td>Witness 1 - Email</td><td>{uru.witness1?.emailId || "N/A"}</td></tr>

                <tr><td>Witness 2 - Name</td><td>{uru.witness2?.name || "N/A"}</td></tr>
                <tr><td>Witness 2 - Designation</td><td>{uru.witness2?.designation || "N/A"}</td></tr>
                <tr><td>Witness 2 - Address</td><td>{uru.witness2?.address || "N/A"}</td></tr>
                <tr><td>Witness 2 - Mobile</td><td>{uru.witness2?.mobileNumber || "N/A"}</td></tr>
                <tr><td>Witness 2 - Email</td><td>{uru.witness2?.emailId || "N/A"}</td></tr>
              </tbody>
            </table>

            <h3>Evidence</h3>
            <table>
              <tbody>
                <tr><td>Google Drive</td><td>{uru.googleDriveLink || "N/A"}</td></tr>
                <tr><td>Facebook</td><td>{uru.facebookLink || "N/A"}</td></tr>
                <tr><td>YouTube</td><td>{uru.youtubeLink || "N/A"}</td></tr>
                <tr><td>Instagram</td><td>{uru.instagramLink || "N/A"}</td></tr>
                <tr><td>LinkedIn</td><td>{uru.linkedInLink || "N/A"}</td></tr>
                <tr><td>X (Twitter)</td><td>{uru.xLink || "N/A"}</td></tr>
                <tr><td>Pinterest</td><td>{uru.pinterestLink || "N/A"}</td></tr>
                <tr><td>Other Media</td><td>{uru.otherMediaLink || "N/A"}</td></tr>
                <tr>
                  <td>Photo</td>
                  <td>{uru.photoUrl ? <img src={uru.photoUrl} alt="Record" className="record-photo" /> : "N/A"}</td>
                </tr>
                <tr>
                  <td>Video</td>
                  <td>{uru.videoUrl ? <video src={uru.videoUrl} controls width="250" /> : "N/A"}</td>
                </tr>
                <tr>
                  <td>Document</td>
                  <td>{uru.documentUrl ? <a href={uru.documentUrl} target="_blank" rel="noreferrer">View Document</a> : "N/A"}</td>
                </tr>
                <tr>
                  <td>Certificate</td>
                  <td>{uru.certificateUrl ? <a href={uru.certificateUrl} target="_blank" rel="noreferrer">View Certificate</a> : "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchiversAbout;
