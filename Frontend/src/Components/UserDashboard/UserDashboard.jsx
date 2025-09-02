import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./UserDashboard.css";
import img1 from "../../assets/left.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { API_URL } from '../../Api';
import Companylogo from '../../assets/UNQUE.png'
import Swal from "sweetalert2";


const UserDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progressStep = Math.min(Math.max(step - 1, 0), 5);
  const progressPercent = (progressStep / 5) * 100;
  const [photoSizeError, setPhotoSizeError] = useState(false);
  const [videoSizeError, setVideoSizeError] = useState(false);
  const [docSizeError, setDocSizeError] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleOpen = () => setShowOverlay(true);
  const handleClose = () => setShowOverlay(false);


  const [formData, setFormData] = useState({
      applicantName: "",
      sex: "",
      dateOfBirth: "",
      address: "",
      district: "",
      country: "",
      state: "",
      pinCode: "",
      educationalQualification: "",
      whatsappMobileNumber: "",
      emailId: "",
      occupation: "",
      formCategory: "",  
      recordCategory: "",
      recordTitle: "",
      recordDescription: "",
      purposeOfRecordAttempt: "",
      dateOfAttempt: "",
      recordVenue: "",
      organisationName: "",

      googleDriveLink: [""],
      facebookLink: [""],
      youtubeLink: [""],
      instagramLink: [""],
      linkedInLink: [""],
      xLink: [""],
      pinterestLink: [""],
      otherMediaLink: [""],


      // ✅ files
      photos: [],
      videos: [],
      documents: [],

      // ✅ witnesses
      witness1Name: "",
      witness1Designation: "",
      witness1Address: "",
      witness1MobileNumber: "",
      witness1EmailId: "",
      witness2Name: "",
      witness2Designation: "",
      witness2Address: "",
      witness2MobileNumber: "",
      witness2EmailId: "",

      position: "",
      
  });

  const handleLinkChange = (e, field, index) => {
  const { value } = e.target;
  setFormData((prev) => {
    const updated = [...prev[field]];
    updated[index] = value;
    return { ...prev, [field]: updated };
  });
};

// ➕ Add new link field
const addLinkField = (field) => {
  setFormData((prev) => ({
    ...prev,
    [field]: [...prev[field], ""],
  }));
};

// ❌ Remove a link field
const removeLinkField = (field, index) => {
  setFormData((prev) => {
    const updated = [...prev[field]];
    updated.splice(index, 1);
    return { ...prev, [field]: updated };
  });
};

const removeFile = (field, index) => {
  setFormData((prev) => {
    const updated = [...prev[field]];
    updated.splice(index, 1);
    return { ...prev, [field]: updated };
  });
};



  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      // ✅ Sort categories A–Z by name
      const sortedCategories = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCategories(sortedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  fetchCategories();
  }, []);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleFileChange = (e, type) => {
  const files = Array.from(e.target.files);

  if (type === "photos") {
    const totalSize = [...formData.photos, ...files].reduce(
      (acc, file) => acc + file.size,
      0
    );
    if (totalSize > 10 * 1024 * 1024) {
      setPhotoSizeError(true);
      return; // ❌ Block adding
    } else {
      setPhotoSizeError(false);
      setFormData({ ...formData, photos: [...formData.photos, ...files] });
    }
  }

  if (type === "videos") {
    const totalSize = [...formData.videos, ...files].reduce(
      (acc, file) => acc + file.size,
      0
    );
    if (totalSize > 100 * 1024 * 1024) {
      setVideoSizeError(true);
      return; // ❌ Block adding
    } else {
      setVideoSizeError(false);
      setFormData({ ...formData, videos: [...formData.videos, ...files] });
    }
  }

  if (type === "documents") {
    const invalidDoc = files.find((file) => file.size > 10 * 1024 * 1024);
    if (invalidDoc) {
      setDocSizeError(true);
      return; // ❌ Block adding
    } else {
      setDocSizeError(false);
      setFormData({ ...formData, documents: [...formData.documents, ...files] });
    }
  }
};



  const handleNext = (e) => {
      e.preventDefault();
      const nextStep = step + 1;

      // Save formData + currentStep in localStorage
      localStorage.setItem("uruDraft", JSON.stringify({ 
        formData, 
        step: nextStep 
      }));

      setStep(nextStep);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem("uruDraft");
    if (savedDraft) {
      const { formData: savedData, step: savedStep } = JSON.parse(savedDraft);

      // ensure all link fields are arrays
      const normalizedData = {
        ...savedData,
        googleDriveLink: Array.isArray(savedData.googleDriveLink) ? savedData.googleDriveLink : [savedData.googleDriveLink || ""],
        facebookLink: Array.isArray(savedData.facebookLink) ? savedData.facebookLink : [savedData.facebookLink || ""],
        youtubeLink: Array.isArray(savedData.youtubeLink) ? savedData.youtubeLink : [savedData.youtubeLink || ""],
        instagramLink: Array.isArray(savedData.instagramLink) ? savedData.instagramLink : [savedData.instagramLink || ""],
        linkedInLink: Array.isArray(savedData.linkedInLink) ? savedData.linkedInLink : [savedData.linkedInLink || ""],
        xLink: Array.isArray(savedData.xLink) ? savedData.xLink : [savedData.xLink || ""],
        pinterestLink: Array.isArray(savedData.pinterestLink) ? savedData.pinterestLink : [savedData.pinterestLink || ""],
        otherMediaLink: Array.isArray(savedData.otherMediaLink) ? savedData.otherMediaLink : [savedData.otherMediaLink || ""],
      };

      setFormData(normalizedData);
      setStep(savedStep);
    }
  }, []);
  
const handleFinalSubmit = async (e) => {
  e.preventDefault();

  if (!termsAccepted) {
    // ⚠️ Terms not accepted
    Swal.fire({
      icon: "warning",
      title: "Please accept the Terms and Conditions",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return;
  }

  setIsSubmitting(true);

  let timerInterval;
  Swal.fire({
    title: "Processing Submission...",
    html: "You are uploading high quality documents.<br/> Please wait up to <b>60</b> seconds while we verify your submission.",
    timer: 60000, // 60 sec max
    timerProgressBar: true,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup().querySelector("b");
      timerInterval = setInterval(() => {
        if (timer) {
          timer.textContent = Math.ceil(Swal.getTimerLeft() / 1000); // show seconds left
        }
      }, 1000);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  });

  try {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((val) => {
          formDataToSend.append(key, val);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/uru/create-uru`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.close(); // close the countdown popup

    if (response.status === 201) {
      setSubmitted(true);
      localStorage.removeItem("uruDraft");

      Swal.fire({
        icon: "success",
        title: "Form submitted successfully ✅",
        text: "Your record has been securely stored in the universe.",
        timer: 2500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again.",
        timer: 2500,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    Swal.close();
    console.error("Error submitting form:", error);

    let errorMessage = "Unexpected error occurred. Please try again.";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: errorMessage,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <>
      <div className="achivment-container">
        <div className="achievement-form-left-panel">
      {/* Company Logo */}
      <div className="achievement-form-logo">
        <img src={Companylogo} alt="Company Logo" />
      </div>

      {/* Instructions Button */}
      <div className="achievement-form-social-icons">
        <button className="instructions-btn" onClick={handleOpen}>
          Instructions
        </button>
      </div>

      {/* Illustration */}
      <div className="achievement-form-illustration">
        <img src={img1} alt="Hiring Illustration" />
      </div>

      {/* Heading */}
      <h1 className="achievement-form-heading">Unique Records Of Universe</h1>

      {/* Description */}
      <p className="achievement-form-description">
        Unique Records Universe (URU) aims to provide a global platform and recognition to extraordinary, inspiring, verifiable human achievements, natural phenomena and innovations from around the world by digitally cataloguing them. Our aim is to preserve unique records or activities for positive inspiration to future generations with inclusive, transparent and ethical standards.
      </p>

        {/* Overlay */}
        {showOverlay && (
          <div className="overlay">
            <div className="overlay-content">
              <h2 className="left-uru-heading">
                Important Guidelines for Filling Online Application Form
              </h2>

              <div className="left-uru-text">
                <div className="left-uru-section">
                  <span className="left-uru-number">1.</span>
                  <p>
                    <b>Start Application:</b> Login with the login ID created while
                    registering your account in the login section on the website and
                    click on the <b>"Apply for URU Holder"</b> tab and open the form.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">2.</span>
                  <p>
                    <b>Fill Personal Information:</b> Enter your full name, email,
                    address, educational qualification details and contact number
                    accurately.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">3.</span>
                  <p>
                    <b>Provide Record Details:</b> Provide a brief description of your
                    unique activity or record and upload the relevant documents.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">4.</span>
                  <p>
                    <b>Complete All Sections:</b> Fill all the 5 steps of the form
                    carefully, ensure that no mandatory field is left blank and fill in
                    the details carefully and correctly. Because once the final form is
                    submitted, you will not be able to edit, update that form.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">5.</span>
                  <p>
                    <b>Read Terms and Conditions:</b> Read and accept the terms and
                    conditions carefully before submitting the form.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">6.</span>
                  <p>
                    <b>Review:</b> Recheck the details entered by you using the
                    <b> "Previous"</b> button and make changes as required.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">7.</span>
                  <p>
                    <b>Submit:</b> After verifying all the information, click on the
                    <b> "Submit"</b> button. After submission, you will receive a
                    confirmation email.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">8.</span>
                  <p>
                    <b>Help:</b> For any issues, email our admin team at{" "}
                    <b>uruonline2025@gmail.com</b> or contact us on mobile number{" "}
                    <b>+91 9472351693</b>.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">9.</span>
                  <p>
                    After successful submission of the form, URU JURI team will
                    thoroughly check the unique records/unique activities mentioned in
                    your application. Recognition will be granted only if it is
                    approved, otherwise your application may be rejected.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">10.</span>
                  <p>
                    If your application is verified by the scrutiny committee and jury
                    committee, then in the next step you can see the updated status by
                    opening the Application Status tab. After paying the prescribed fee
                    mentioned there, your unique record/unique activity will be duly
                    published on the URU's worldwide website along with all the details
                    and information provided by you and a digital certificate will also
                    be issued.
                  </p>
                </div>

                <div className="left-uru-section">
                  <span className="left-uru-number">11.</span>
                  <p>
                    The application, certification fee in URU is ₹9,639/-. But as per
                    the decision of the committee, after the application is accepted
                    till further notice, you will have to pay only ₹3,693/-. Concession
                    will also be given from this revised fee for people from specially
                    economically weaker meritorious class who have really done some
                    unique work.
                  </p>
                </div>

                <div className="left-uru-note">
                  <b>Note:</b> All the information filled by you in the application
                  should be accurate and true. Submission of incomplete or wrong
                  information may result in cancellation of application. If your unique
                  record/unique activity is registered on the URU website and in future
                  that information is proved to be false, then your published details
                  will be removed from the website. In this regard, you will also be
                  informed separately and your side will also be taken.
                </div>
              </div>

              <button className="close-btn" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        )}

        </div>

        <div className="right-panel">
          <div className="form-achivment-container">
            <h2 className="heading">Apply Online Appliction Form</h2>
            <small className="Sub-heading">Apply online to have your unique record or activity registered in the digital archives of the universe</small>
            <div className="progress-bar-achivment-container">
              <div className="progress-text">{progressStep} of 5 completed</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            {step === 1 && (
              <>
                <p className="paragraph">Select the position you are applying for:</p>
                <form onSubmit={handleNext} >
                  <label className="radio-box">
                    <input type="radio" name="position" value="Unique Record" onChange={handleInputChange} />
                    <span>Unique Record</span>
                  </label>
                  <label className="radio-box">
                    <input type="radio" name="position" value="Unique Activity" onChange={handleInputChange} />
                    <span>Unique Activity</span>
                  </label>
                  <small>* Start  Choose branch radio based</small>
                  <div className="form-footer">
                    <button type="submit" className="next-button">Save & Next</button>
                  </div>
                </form>
              </>
            )}
            {step === 2 && (
              <>
                <p className="section-title">Please fill in your personal details:</p>
                <form className="personal-form" onSubmit={handleNext}>
                  <div className="grid-form">
                    <div className="achivment-form-group">
                      <label>Applicant Name*</label>
                      <input type="text" name="applicantName" value={formData.applicantName} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Sex*</label>
                      <select name="sex" value={formData.sex} onChange={handleInputChange} required>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="transgender">Transgender</option>
                      </select>
                    </div>
                    <div className="achivment-form-group">
                      <label>Date of Birth*</label>
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Address*</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>District*</label>
                      <input type="text" name="district" value={formData.district} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>State*</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Country*</label>
                      <input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Pin Code*</label>
                      <input type="text" name="pinCode" value={formData.pinCode} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Educational Qualification*</label>
                      <input type="text" name="educationalQualification" value={formData.educationalQualification} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>WhatsApp Mobile Number*</label>
                      <input type="tel" name="whatsappMobileNumber" value={formData.whatsappMobileNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Email ID*</label>
                      <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Occupation*</label>
                      <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-footer">
                    <button type="button" className="prev-button" onClick={handlePrevious}>← Previous</button>
                    <button type="submit" className="next-button">Save & Next</button>
                  </div>
                </form>
              </>
            )}
            {step === 3 && (
              <>
                <p className="section-title">Fill about Record/Activity Details:</p>
                <form className="personal-form" onSubmit={handleNext}>
                  <div className="grid-form">

                   {/* New Category Selection */}
                    <div className="achivment-form-group">
                      <label>Select Category *</label>
                      <select
                        name="formCategory"
                        value={formData.formCategory}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="achivment-form-group">
                      <label>Effort Type *</label>
                      <select name="recordCategory" value={formData.recordCategory} onChange={handleInputChange} required>
                        <option value="">Select</option>
                        <option value="individual">Individual Effort</option>
                        <option value="group">Group Effort</option>
                      </select>
                    </div>
                    <div className="achivment-form-group">
                      <label>Record/Activity Title*</label>
                      < textarea type="text" name="recordTitle" value={formData.recordTitle} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Description of Record/Activity*</label>
                      <textarea name="recordDescription" value={formData.recordDescription} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Purpose of the Record/Activity Attempt*</label>
                      <textarea name="purposeOfRecordAttempt" value={formData.purposeOfRecordAttempt} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Date of the Attempted*</label>
                      <input type="date" name="dateOfAttempt" value={formData.dateOfAttempt} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Record/Activity Venue*</label>
                      <input type="text" name="recordVenue" value={formData.recordVenue} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Organisation Name (optional)</label>
                      <input type="text" name="organisationName" value={formData.organisationName} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-footer">
                    <button type="button" className="prev-button" onClick={handlePrevious}>← Previous</button>
                    <button type="submit" className="next-button">Save & Next</button>
                  </div>
                </form>
              </>
              )}
            {step === 4 && (
                <>
                  <div className="section-title">
                    <h2 className="evidence-heading">Evidence :</h2>
                    <p>
                      You should attach full details of evidence related to your achievements,
                      photographs, biodata including newspaper cuttings and various types of
                      social media and web links.
                    </p>
                  </div>

                  <form className="personal-form" onSubmit={handleNext}>
                    <div className="grid-form">

                      {/* 🔗 Google Drive Links */}
                      <div className="achivment-form-group">
                        <label>Google Drive Links</label>
                        {formData.googleDriveLink.map((link, index) => (
                          <div key={index} className="link-input-group">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => handleLinkChange(e, "googleDriveLink", index)}
                              placeholder="Enter Google Drive link"
                              className="link-input"
                            />
                            {index === formData.googleDriveLink.length - 1 && (
                              <button
                                type="button"
                                onClick={() => addLinkField("googleDriveLink")}
                                className="step-btn step-btn-add"
                              >
                                ➕
                              </button>
                            )}
                            {formData.googleDriveLink.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLinkField("googleDriveLink", index)}
                                className="step-btn step-btn-remove"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 🔗 Facebook Links */}
                      <div className="achivment-form-group">
                        <label>Facebook Links</label>
                        {formData.facebookLink.map((link, index) => (
                          <div key={index} className="link-input-group">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => handleLinkChange(e, "facebookLink", index)}
                              placeholder="Enter Facebook link"
                              className="link-input"
                            />
                            {index === formData.facebookLink.length - 1 && (
                              <button
                                type="button"
                                onClick={() => addLinkField("facebookLink")}
                                className="step-btn step-btn-add"
                              >
                                ➕
                              </button>
                            )}
                            {formData.facebookLink.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLinkField("facebookLink", index)}
                                className="step-btn step-btn-remove"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 🔗 YouTube Links */}
                      <div className="achivment-form-group">
                        <label>YouTube Links</label>
                        {formData.youtubeLink.map((link, index) => (
                          <div key={index} className="link-input-group">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => handleLinkChange(e, "youtubeLink", index)}
                              placeholder="Enter YouTube link"
                              className="link-input"
                            />
                            {index === formData.youtubeLink.length - 1 && (
                              <button
                                type="button"
                                onClick={() => addLinkField("youtubeLink")}
                                className="step-btn step-btn-add"
                              >
                                ➕
                              </button>
                            )}
                            {formData.youtubeLink.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLinkField("youtubeLink", index)}
                                className="step-btn step-btn-remove"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 🔗 Instagram Links */}
                      <div className="achivment-form-group">
                        <label>Instagram Links</label>
                        {formData.instagramLink.map((link, index) => (
                          <div key={index} className="link-input-group">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => handleLinkChange(e, "instagramLink", index)}
                              placeholder="Enter Instagram link"
                              className="link-input"
                            />
                            {index === formData.instagramLink.length - 1 && (
                              <button
                                type="button"
                                onClick={() => addLinkField("instagramLink")}
                                className="step-btn step-btn-add"
                              >
                                ➕
                              </button>
                            )}
                            {formData.instagramLink.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLinkField("instagramLink", index)}
                                className="step-btn step-btn-remove"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 🔗 LinkedIn Links */}
                      <div className="achivment-form-group">
                        <label>LinkedIn Links</label>
                        {formData.linkedInLink.map((link, index) => (
                          <div key={index} className="link-input-group">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => handleLinkChange(e, "linkedInLink", index)}
                              placeholder="Enter LinkedIn link"
                              className="link-input"
                            />
                            {index === formData.linkedInLink.length - 1 && (
                              <button
                                type="button"
                                onClick={() => addLinkField("linkedInLink")}
                                className="step-btn step-btn-add"
                              >
                                ➕
                              </button>
                            )}
                            {formData.linkedInLink.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLinkField("linkedInLink", index)}
                                className="step-btn step-btn-remove"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 🔗 X (Twitter) Links */}
                      <div className="achivment-form-group">
                        <label>X (Twitter) Links</label>
                        {formData.xLink.map((link, index) => (
                          <div key={index} className="link-input-group">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => handleLinkChange(e, "xLink", index)}
                              placeholder="Enter X (Twitter) link"
                              className="link-input"
                            />
                            {index === formData.xLink.length - 1 && (
                              <button
                                type="button"
                                onClick={() => addLinkField("xLink")}
                                className="step-btn step-btn-add"
                              >
                                ➕
                              </button>
                            )}
                            {formData.xLink.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLinkField("xLink", index)}
                                className="step-btn step-btn-remove"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 🔗 Pinterest Links */}
                      <div className="achivment-form-group">
                        <label>Pinterest Links</label>
                        {formData.pinterestLink.map((link, index) => (
                          <div key={index} className="link-input-group">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => handleLinkChange(e, "pinterestLink", index)}
                              placeholder="Enter Pinterest link"
                              className="link-input"
                            />
                            {index === formData.pinterestLink.length - 1 && (
                              <button
                                type="button"
                                onClick={() => addLinkField("pinterestLink")}
                                className="step-btn step-btn-add"
                              >
                                ➕
                              </button>
                            )}
                            {formData.pinterestLink.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLinkField("pinterestLink", index)}
                                className="step-btn step-btn-remove"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 🔗 Other Media Links */}
                      <div className="achivment-form-group">
                        <label>Other Media Links</label>
                        {formData.otherMediaLink.map((link, index) => (
                          <div key={index} className="link-input-group">
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => handleLinkChange(e, "otherMediaLink", index)}
                              placeholder="Enter Other Media link"
                              className="link-input"
                            />
                            {index === formData.otherMediaLink.length - 1 && (
                              <button
                                type="button"
                                onClick={() => addLinkField("otherMediaLink")}
                                className="step-btn step-btn-add"
                              >
                                ➕
                              </button>
                            )}
                            {formData.otherMediaLink.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLinkField("otherMediaLink", index)}
                                className="step-btn step-btn-remove"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                    {/* 📷 Photos */}
                    <div className="achivment-form-group">
                      <label>
                        Upload Photos (JPG/PNG) <small>(Max total 10MB)</small>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, "photos")}
                      />
                      <div className="file-preview-container">
                        {formData.photos.map((file, index) => (
                          <div key={index} className="file-preview">
                            {file instanceof File ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="file-img"
                              />
                            ) : (
                              <img src={file} alt="preview" className="file-img" />
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile("photos", index)}
                              className="step-btn-remove-file"
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>
                      {/* Warning for Photos */}
                      {photoSizeError && (
                        <p className="error-text">⚠️ Total photo size must be under 10MB</p>
                      )}
                    </div>

                    {/* 🎥 Videos */}
                    <div className="achivment-form-group">
                      <label>
                        Upload Videos (MP4) <small>(Max total 100MB)</small>
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => handleFileChange(e, "videos")}
                      />
                      <ul className="file-list">
                        {formData.videos.map((file, index) => (
                          <li key={index} className="file-list-item">
                            {file instanceof File ? (
                              <video src={URL.createObjectURL(file)} controls className="file-video" />
                            ) : (
                              <video src={file} controls className="file-video" />
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile("videos", index)}
                              className="step-btn step-btn-remove"
                            >
                              ❌
                            </button>
                          </li>
                        ))}
                      </ul>
                      {/* Warning for Videos */}
                      {videoSizeError && (
                        <p className="error-text">⚠️ Total video size must be under 100MB</p>
                      )}
                    </div>

                    {/* 📄 Documents */}
                    <div className="achivment-form-group">
                      <label>
                        Upload Documents (PDF) <small>(Each max 10MB)</small>
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={(e) => handleFileChange(e, "documents")}
                      />
                      <ul className="file-list">
                        {formData.documents.map((file, index) => (
                          <li key={index} className="file-list-item">
                            <span className="file-name">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile("documents", index)}
                              className="step-btn step-btn-remove"
                            >
                              ❌
                            </button>
                          </li>
                        ))}
                      </ul>
                      {/* Warning for Documents */}
                      {docSizeError && (
                        <p className="error-text">⚠️ Each document must be under 10MB</p>
                      )}
                    </div>


                    </div>

                    {/* Navigation */}
                    <div className="form-footer">
                      <button type="button" className="prev-button" onClick={handlePrevious}>← Previous</button>
                      <button type="submit" className="next-button">Save & Next</button>
                    </div>
                  </form>
                </>
            )}
            {step === 5 && (
              <>
                <p className="section-title">Witness Details (Optional):</p>
                <form className="personal-form" onSubmit={handleNext}>
                  <div className="grid-form">
                    <h3>Witness 1</h3>
                    <div className="achivment-form-group">
                      <label>Name of Witness 1</label>
                      <input type="text" name="witness1Name" value={formData.witness1Name} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Witness Designation</label>
                      <input type="text" name="witness1Designation" value={formData.witness1Designation} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Witness Address</label>
                      <input type="text" name="witness1Address" value={formData.witness1Address} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Witness Mobile Number</label>
                      <input type="tel" name="witness1MobileNumber" value={formData.witness1MobileNumber} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Witness Email ID</label>
                      <input type="email" name="witness1EmailId" value={formData.witness1EmailId} onChange={handleInputChange} />
                    </div>

                    <h3>Witness 2</h3>
                    <div className="achivment-form-group">
                      <label>Name of Witness 2</label>
                      <input type="text" name="witness2Name" value={formData.witness2Name} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Witness Designation</label>
                      <input type="text" name="witness2Designation" value={formData.witness2Designation} onChange={handleInputChange} />
                    </div>
                                        <div className="achivment-form-group">
                      <label>Witness Mobile Number</label>
                      <input type="tel" name="witness2MobileNumber" value={formData.witness2MobileNumber} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Witness Email ID</label>
                      <input type="email" name="witness2EmailId" value={formData.witness2EmailId} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-footer">
                    <button type="button" className="prev-button" onClick={handlePrevious}>← Previous</button>
                    <button type="submit" className="next-button">Save & Next</button>
                  </div>
                </form>
              </>
            )}
            {step === 6 && !submitted && (
          <form className="thank-you-achivment-container" onSubmit={handleFinalSubmit}>
          <div className="thankyou-container">
              <h2 className="thankyou-heading">
                Thank you very much for your unique contribution.
              </h2>
              <div className="thankyou-system">
                <p>
                  This is the final step of application to digitally secure your unique 
                  <span className="highlight"> record/activity legacy </span> in the universe.
                </p>
              </div>
              <p className="thankyou-paragraph">
                We will contact you shortly at the following email address 
                <strong> {formData.emailId}</strong>
              </p>
            </div>


            {/* Terms and Conditions Checkbox */}
            <div className="checkbox-area">
              <label>
                <input 
                  type="checkbox" 
                  checked={termsAccepted} 
                  onChange={() => setTermsAccepted(!termsAccepted)} 
                />
                I accept the{" "}
                <span className="terms-link" onClick={() => setShowTerms(true)}>
                  Terms and Conditions
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="form-footer">
              <button type="button" className="prev-button" onClick={handlePrevious}>
                Previous
              </button>
            <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={!termsAccepted || isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit"}
            </button>
                    </div>
                  </form>
            )}
            {showTerms && (
                <div
                  className="user-dashboard-terms-overlay"
                  onClick={() => setShowTerms(false)}
                >
                  <div
                    className="user-dashboard-terms-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="user-dashboard-terms-header">
                      <h2>Policy, Rules, and Terms for Recording Achievements</h2>
                      <button
                        className="user-dashboard-close-btn"
                        onClick={() => setShowTerms(false)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="user-dashboard-terms-content">
                      <h3>1. Objective</h3>
                      <p>
                        Unique Records of Universe (URU) aims to recognize and showcase extraordinary,
                        inspiring, and verified human achievements, natural phenomena, and innovations
                        on a global platform. Our goal is to preserve records with inclusive, transparent,
                        and ethical standards.
                      </p>

                      <h3>2. Eligibility</h3>
                      <p>
                        <strong>2.1 Applicants</strong>: Any individual, group, organization, or community
                        (regardless of age, gender, nationality, or background) may apply for a record.
                      </p>
                      <p><strong>2.2 Type of Achievement</strong>: Records may fall under, but are not limited to:</p>
                      <ul>
                        <li>Human skills (e.g., completing a task in the fastest time)</li>
                        <li>Natural phenomena (e.g., longest, shortest, highest, lowest)</li>
                        <li>Social impact (e.g., largest participation in a social initiative)</li>
                        <li>Technological innovations (e.g., smallest solar energy device)</li>
                        <li>Cultural and artistic achievements (e.g., longest, shortest, or collective dance performance)</li>
                      </ul>
                      <p>
                        <strong>2.3 Original Achievement</strong>: The record must be unique and not duplicate
                        any existing record in the URU database, unless it surpasses an existing record.
                      </p>
                      <p>
                        <strong>2.4 Ethics</strong>: The achievement must not be illegal, unethical, indecent,
                        obscene, or harmful to the environment or society in any way.
                      </p>

                      <h3>3. Application Process</h3>
                      <p><strong>3.1 Application Form</strong>: Applicants must log in to the official URU website and complete the "Record Application Form." The form should include:</p>
                      <ul>
                        <li>Description of the achievement</li>
                        <li>Mention of category and uniqueness</li>
                        <li>Location, date, and time</li>
                        <li>Evidence for the proposed record (videos, photos, witness statements)</li>
                      </ul>
                      <p>
                        <strong>3.2 Initial Fee</strong>: A non-refundable initial fee of ₹3,693/- will be
                        charged to cover application review, verification process, and digital maintenance.
                        The fee may change over time as per the website’s information board.
                      </p>
                      <p>
                        <strong>3.3 Review Time</strong>: The initial review will be completed within
                        15 working days. If approved, the applicant will be directed to pay the designated
                        fee through their login ID. Upon successful payment, the entry and digital
                        certificate will be published on the website.
                      </p>

                      <h3>4. Evidence and Verification</h3>
                      <p><strong>4.1 Types of Evidence:</strong></p>
                      <ul>
                        <li><strong>Visual Evidence</strong>: High-quality videos, photos, social media links with timestamps</li>
                        <li><strong>Written Evidence</strong>: Signed statements from at least two independent witnesses</li>
                        <li><strong>Technical Evidence</strong>: Calibration certificates for measuring devices (if applicable)</li>
                      </ul>
                      <p><strong>4.2 Independent Verification</strong>: URU may include experts based on the achievement’s nature or send a representative (expenses borne by the applicant).</p>
                      <p><strong>4.3 Transparency</strong>: Applicants will be regularly updated on verification progress.</p>

                      <h3>5. Rules and Terms</h3>
                      <p><strong>5.1 Accuracy</strong>: Applicants must provide truthful information. False or misleading details may result in cancellation, liability, or legal action.</p>
                      <p><strong>5.2 Ownership</strong>: URU reserves the right to use record-related materials (videos, photos, descriptions, etc.) for promotion with credit to the applicant.</p>
                      <p><strong>5.3 Dispute Resolution</strong>: Disputes will be resolved by URU’s expert panel, and their decision will be final.</p>
                      <p><strong>5.4 Right to Amend</strong>: URU may amend policies and terms without notice.</p>
                      <p><strong>5.5 Risk Responsibility</strong>: Applicants are solely responsible for injuries, damages, or legal issues during the attempt.</p>

                      <h3>6. Record Recognition</h3>
                      <p><strong>6.1 Certificate</strong>: Successfully verified records receive an official URU certificate.</p>
                      <p><strong>6.2 Publication</strong>: Records are featured on the URU website, magazine, and promotional materials.</p>
                      <p><strong>6.3 Validity</strong>: A record remains valid until surpassed. Outdated records are archived as “Historical Records.”</p>

                      <h3>7. Privacy and Data Protection</h3>
                      <p><strong>7.1 Data Usage</strong>: Personal data will only be used for verification and promotion.</p>
                      <p><strong>7.2 Security</strong>: URU adopts technical measures to ensure confidentiality and security of applicant data.</p>

                      <h3>8. Contact and Support</h3>
                      <p><strong>8.1 Assistance</strong>: Applicants may contact URU through the official website or helpline.</p>
                      <p><strong>8.2 Feedback</strong>: URU welcomes suggestions for improvement.</p>

                      <h3>9. Legal Compliance</h3>
                      <ul>
                        <li>Applicants must comply with all applicable laws (India and respective regions).</li>
                        <li>Use of the website for illegal activities is strictly prohibited.</li>
                      </ul>

                      <h3>10. Security Guidelines</h3>
                      <ul>
                        <li><strong>Account Security</strong>: Use strong passwords and don’t share credentials.</li>
                        <li><strong>Secure Browsing</strong>: Keep devices safe (updated antivirus, etc.).</li>
                        <li><strong>Suspicious Activity</strong>: Report any suspicious activity immediately.</li>
                      </ul>

                      <h3>11. Policy Updates</h3>
                      <p>
                        Policies may be updated periodically to reflect legal or technological changes.
                        Updates will be notified on the website, and continued use will be deemed acceptance
                        of the latest policy.
                      </p>
                    </div>
                  </div>
                </div>
            )}
            {submitted && (
              <div className="thank-you-wrapper">
                <div className="thank-you-card">
                  <div className="success-icon">
                    <FontAwesomeIcon icon={faCircleCheck} size="3x" color="#fff" />
                  </div>
                  <h2 className="thank-heading">The application process was successful!</h2>
                  <p className="thank-text">
                    Your application for <strong>'Unique Records Of Universe'</strong> Holder has been successfully received by URU Admin Section. 
                    After application approval, go to the Application Status page and pay the prescribed fee.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;