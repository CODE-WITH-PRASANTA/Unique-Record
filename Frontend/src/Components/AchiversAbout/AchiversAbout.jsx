import React, { useState, useEffect } from "react";
import "./AchiversAbout.css";
import { FaFacebookF, FaWhatsapp, FaEnvelope, FaShareAlt , FaInstagram  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";  // modern X logo
import { FiDownload } from "react-icons/fi";
import { API_URL } from '../../Api';
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Helmet } from "react-helmet";


const AchiversAbout = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [uru, setUru] = useState({});
  const { id } = useParams();
  const sharableLink = `${window.location.origin}/achiever/${id}`;
  // State for read more / read less
const [showFullDesc, setShowFullDesc] = useState(false);
const [showFullPurpose, setShowFullPurpose] = useState(false);


  const shareOnInstagram = async (url, name, postUrl) => {
    try {
      const text = getShareMessage(name, postUrl);

      if (navigator.share) {
        await navigator.share({
          title: `${name}'s Unique Record`,
          text,
          url: postUrl,
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(postUrl);
        alert("Link copied! Open Instagram and paste it in your post or story.");
      }
    } catch (error) {
      console.error("Error sharing on Instagram:", error);
    }
  };

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

    // Common share text generator
    const getShareMessage = (name, postUrl) => 
      `🌟 View ${name}'s Unique Records/Activity on URU web portal 🌟\n\n🔗 ${postUrl}`;

    // Facebook
    const shareOnFacebook = (url, name, postUrl) => {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(getShareMessage(name, postUrl))}`;
      window.open(facebookUrl, '_blank');
    };

    // Twitter / X
    const shareOnTwitter = (url, name, postUrl) => {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareMessage(name, postUrl))}`;
      window.open(twitterUrl, '_blank');
    };

    // WhatsApp
    const shareOnWhatsApp = (url, name, postUrl) => {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(getShareMessage(name, postUrl))}`;
      window.open(whatsappUrl, '_blank');
    };

    // Email
    const shareOnEmail = (url, name, postUrl) => {
      const emailUrl = `mailto:?subject=${encodeURIComponent(name + "'s Unique Record")}&body=${encodeURIComponent(getShareMessage(name, postUrl))}`;
      window.open(emailUrl, '_blank');
    };

    // Other Platforms (Web Share API)
    const shareOnOtherPlatforms = async (url, name, postUrl) => {
      try {
        const text = getShareMessage(name, postUrl);

        if (navigator.canShare && navigator.canShare({ files: [] })) {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], `${name}_certificate.jpg`, { type: blob.type });

          await navigator.share({
            title: `${name}'s Unique Record`,
            text,
            url: postUrl,
            files: [file],
          });
        } else {
          await navigator.share({
            title: `${name}'s Unique Record`,
            text,
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
      <Helmet>
        <title>{uru.applicantName} | URU Achiever</title>
        <meta property="og:title" content={`${uru.applicantName}'s Unique Record`} />
        <meta property="og:description" content={uru.recordDescription?.slice(0, 150) || "Unique Record on URU"} />
        <meta property="og:image" content={uru.photoUrl || uru.certificateUrl} />
        <meta property="og:url" content={sharableLink} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>


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
   {uru.position}
  </h2>

{/* Wrap details + photo in flex */}
<div className="achiver-right-top">
<div className="uru-details-card">
  <h2 className="uru-title">
    Unique Records of Universe Holder's Name :{" "}
    <span className="uru-highlight">{uru.applicantName}</span>
  </h2>

  <div className="uru-info-grid">
    <p className="uru-info"><strong>District:</strong> {uru.district || "N/A"}</p>
    <p className="uru-info"><strong>State:</strong> {uru.state || "N/A"}</p>
    <p className="uru-info"><strong>Country:</strong> {uru.country || "N/A"}</p>
  </div>

  <div className="uru-details-list">
    <p className="uru-detail"><strong>Registration No:</strong> {uru.regNo}</p>
    <p className="uru-detail">
      <strong>Reg. Date:</strong>{" "}
      {uru.createdAt ? formatDate(uru.createdAt) : "N/A"}
    </p>
    <p className="uru-detail">
      <strong>Category:</strong> {uru.formCategory}
    </p>
    <p className="uru-detail">
      <strong>Effort Type:</strong> {uru.recordCategory}
    </p>
    <p className="uru-detail">
      <strong>Date of Digitization in the Universe:</strong>{" "}
      {uru.createdAt
        ? formatDate(
            new Date(
              new Date(uru.createdAt).setDate(
                new Date(uru.createdAt).getDate() + 1
              )
            )
          )
        : "N/A"}
    </p>
  </div>
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
        <FaXTwitter  />
      </button>
       <button
        className="share-btn insta"
        onClick={() =>
          shareOnInstagram(uru.certificateUrl, uru.applicantName, sharableLink)
        }
      >
        <FaInstagram />
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
        <div className="achiver-summary-section">
          <h3 className="achiver-summary-heading">Records / Activity Description</h3>
          <p className="achiver-summary">{uru.recordDescription}</p>
        </div>
        ) : (
            <div className="achiver-description-table">
            {/* Basic Information */}
            <h3 className="section-heading">Basic Information</h3>
            <table className="uru-table">
              <tbody>
                <tr><td className="uru-label">Application Number</td><td>{uru.applicationNumber || "N/A"}</td></tr>
                <tr><td className="uru-label">Applicant Name</td><td>{uru.applicantName || "N/A"}</td></tr>
                <tr><td className="uru-label">Applicant Date</td><td>{uru.createdAt ? new Date(uru.createdAt).toLocaleDateString() : "N/A"}</td></tr>
                <tr>
                    <td className="uru-label">Sex</td>
                    <td>
                      <strong>
                        {uru.sex
                          ? uru.sex.charAt(0).toUpperCase() + uru.sex.slice(1).toLowerCase()
                          : "N/A"}
                      </strong>
                    </td>
                  </tr>
                <tr><td className="uru-label">Date of Birth</td><td>{uru.dateOfBirth ? new Date(uru.dateOfBirth).toLocaleDateString() : "N/A"}</td></tr>
                <tr><td className="uru-label">Address</td><td>{uru.address || "N/A"}</td></tr>
                <tr><td className="uru-label">District</td><td>{uru.district || "N/A"}</td></tr>
                <tr><td className="uru-label">State</td><td>{uru.state || "N/A"}</td></tr>
                <tr><td className="uru-label">Country</td><td>{uru.country || "N/A"}</td></tr>
                <tr><td className="uru-label">Pin Code</td><td>{uru.pinCode || "N/A"}</td></tr>
                <tr><td className="uru-label">Educational Qualification</td><td>{uru.educationalQualification || "N/A"}</td></tr>
                <tr><td className="uru-label">WhatsApp Mobile</td><td>{uru.whatsappMobileNumber || "N/A"}</td></tr>
                <tr><td className="uru-label">Email ID</td><td>{uru.emailId || "N/A"}</td></tr>
                <tr><td className="uru-label">Occupation</td><td>{uru.occupation || "N/A"}</td></tr>
              </tbody>
            </table>

            {/* Record/Activity Details */}
            <h3 className="section-heading">Record / Activity Details</h3>
            <table className="uru-table">
              <tbody>
                <tr><td className="uru-label">Effort Type</td><td><strong>{uru.recordCategory || "N/A"}</strong></td></tr>
                <tr><td className="uru-label">Submitting Category</td><td>{uru.formCategory || "N/A"}</td></tr>
                <tr><td className="uru-label">Type</td><td>{uru.position || "N/A"}</td></tr>
                <tr><td className="uru-label">Title</td><td>{uru.recordTitle || "N/A"}</td></tr>
                <tr>
                  <td className="uru-label">Description</td>
                  <td>
                    <p className="uru-text">
                      {showFullDesc ? uru.recordDescription : uru.recordDescription?.slice(0, 250) + (uru.recordDescription?.length > 250 ? "..." : "")}
                    </p>
                    {uru.recordDescription?.length > 250 && (
                      <button className="readmore-btn" onClick={() => setShowFullDesc(!showFullDesc)}>
                        {showFullDesc ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="uru-label">Purpose</td>
                  <td>
                    <p className="uru-text">
                      {showFullPurpose ? uru.purposeOfRecordAttempt : uru.purposeOfRecordAttempt?.slice(0, 250) + (uru.purposeOfRecordAttempt?.length > 250 ? "..." : "")}
                    </p>
                    {uru.purposeOfRecordAttempt?.length > 250 && (
                      <button className="readmore-btn" onClick={() => setShowFullPurpose(!showFullPurpose)}>
                        {showFullPurpose ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </td>
                </tr>
                <tr><td className="uru-label">Date of Attempt</td><td>{uru.dateOfAttempt ? new Date(uru.dateOfAttempt).toLocaleDateString() : "N/A"}</td></tr>
                <tr><td className="uru-label">Venue</td><td>{uru.recordVenue || "N/A"}</td></tr>
                <tr><td className="uru-label">Organisation / Group</td><td>{uru.organisationName || "N/A"}</td></tr>
              </tbody>
            </table>

            {/* Witness Information */}
            <h3 className="section-heading">Witness - 1</h3>
            <table className="uru-table">
              <tbody>
                <tr><td className="uru-label">Name</td><td>{uru.witness1?.name || "N/A"}</td></tr>
                <tr><td className="uru-label">Designation</td><td>{uru.witness1?.designation || "N/A"}</td></tr>
                <tr><td className="uru-label">Address</td><td>{uru.witness1?.address || "N/A"}</td></tr>
                <tr><td className="uru-label">Mobile</td><td>{uru.witness1?.mobileNumber || "N/A"}</td></tr>
                <tr><td className="uru-label">Email</td><td>{uru.witness1?.emailId || "N/A"}</td></tr>
              </tbody>
            </table>

            <h3 className="section-heading">Witness - 2</h3>
            <table className="uru-table">
              <tbody>
                <tr><td className="uru-label">Name</td><td>{uru.witness2?.name || "N/A"}</td></tr>
                <tr><td className="uru-label">Designation</td><td>{uru.witness2?.designation || "N/A"}</td></tr>
                <tr><td className="uru-label">Address</td><td>{uru.witness2?.address || "N/A"}</td></tr>
                <tr><td className="uru-label">Mobile</td><td>{uru.witness2?.mobileNumber || "N/A"}</td></tr>
                <tr><td className="uru-label">Email</td><td>{uru.witness2?.emailId || "N/A"}</td></tr>
              </tbody>
            </table>

           {/* Evidence */}
<h3 className="section-heading">Evidence</h3>
<table className="uru-table">
  <tbody>
    <tr>
      <td className="uru-label">Google Drive</td>
      <td>
        {uru.googleDriveLink ? (
          <a href={uru.googleDriveLink} target="_blank" rel="noreferrer" className="link-btn">
            Open Link
          </a>
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">Facebook</td>
      <td>
        {uru.facebookLink ? (
          <a href={uru.facebookLink} target="_blank" rel="noreferrer" className="link-btn">
            Open Link
          </a>
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">YouTube</td>
      <td>
        {uru.youtubeLink ? (
          <a href={uru.youtubeLink} target="_blank" rel="noreferrer" className="link-btn">
            Open Link
          </a>
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">Instagram</td>
      <td>
        {uru.instagramLink ? (
          <a href={uru.instagramLink} target="_blank" rel="noreferrer" className="link-btn">
            Open Link
          </a>
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">LinkedIn</td>
      <td>
        {uru.linkedInLink ? (
          <a href={uru.linkedInLink} target="_blank" rel="noreferrer" className="link-btn">
            Open Link
          </a>
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">X (Twitter)</td>
      <td>
        {uru.xLink ? (
          <a href={uru.xLink} target="_blank" rel="noreferrer" className="link-btn">
            Open Link
          </a>
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">Pinterest</td>
      <td>
        {uru.pinterestLink ? (
          <a href={uru.pinterestLink} target="_blank" rel="noreferrer" className="link-btn">
            Open Link
          </a>
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">Other Media</td>
      <td>
        {uru.otherMediaLink ? (
          <a href={uru.otherMediaLink} target="_blank" rel="noreferrer" className="link-btn">
            Open Link
          </a>
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">Photo</td>
      <td>
        {uru.photoUrl ? (
          <img src={uru.photoUrl} alt="Record" className="record-photo" />
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">Video</td>
      <td>
        {uru.videoUrl ? (
          <video src={uru.videoUrl} controls width="250" />
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">Document</td>
      <td>
        {uru.documentUrl ? (
          <a href={uru.documentUrl} target="_blank" rel="noreferrer" className="link-btn">
            View Document
          </a>
        ) : "N/A"}
      </td>
    </tr>
    <tr>
      <td className="uru-label">Certificate</td>
      <td>
        {uru.certificateUrl ? (
          <a href={uru.certificateUrl} target="_blank" rel="noreferrer" className="link-btn">
            View Certificate
          </a>
        ) : "N/A"}
      </td>
    </tr>
  </tbody>
</table>


           {/* 🎉 Congratulations Message */}
        <div className="congrats-message">
          🎉 Congratulations..! <strong>{uru.applicantName}</strong> has been successfully registered in the <em>'Unique Records of Universe'</em>.
        </div>

          </div>

        )}
      </div>
    </div>
  );
};

export default AchiversAbout;
