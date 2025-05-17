import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserDashboard.css";
import img1 from "../../assets/left.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../Api';


import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

const UserDashboard = () => {
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: "",
    sex: "",
    dateOfBirth: "",
    address: "",
    district: "",
    state: "",
    pinCode: "",
    educationalQualification: "",
    whatsappMobileNumber: "",
    emailId: "",
    occupation: "",
    recordCategory: "",
    recordTitle: "",
    recordDescription: "",
    purposeOfRecordAttempt: "",
    dateOfAttempt: "",
    recordVenue: "",
    organisationName: "",
    googleDriveLink: "",
    facebookLink: "",
    youtubeLink: "",
    instagramLink: "",
    linkedInLink: "",
    xLink: "",
    pinterestLink: "",
    otherMediaLink: "",
    photo: null,
    video: null,
    document: null,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (termsAccepted) {
      submitForm();
    } else {
      alert("Please accept the Terms and Conditions before submitting.");
    }
  };


const submitForm = async () => {
  try {
    const token = localStorage.getItem("token"); 
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "photo" || key === "video" || key === "document") {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      } else {
        form.append(key, formData[key]);
      }
    });
    const response = await axios.post(`${API_URL}/uru/create-uru`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 201) {
      setSubmitted(true);
    } else {
      alert("Error submitting form");
    }
  } catch (error) {
    console.error(error);
    alert("Error submitting form");
  }
};

  const progressStep = Math.min(Math.max(step - 1, 0), 4);
  const progressPercent = (progressStep / 4) * 100;

  useEffect(() => {
    let timer;
    if (submitted) {
      timer = setTimeout(() => {
        setStep(1);
        setSubmitted(false);
        setTermsAccepted(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [submitted]);

  return (
    <>
      <div className="achivment-container">
        <div className="achievement-form-left-panel">
          <div className="achievement-form-social-icons">
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faXTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
          </div>

          <div className="achievement-form-illustration">
            <img src={img1} alt="Hiring Illustration" />
          </div>

          <h1 className="achievement-form-heading">Unique Record Of Universe</h1>

          <p className="achievement-form-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate maiores odit impedit consequatur? Sequi reiciendis velit ab delectus quam suscipit ullam incidunt, tempora harum sapiente cumque animi eum dolore veniam eveniet soluta mollitia quibusdam! Placeat earum inventore ipsum pariatur sit laboriosam animi repudiandae natus laudantium consectetur, fugit illo corporis blanditiis, vel possimus deserunt vero, repellendus aspernatur modi beatae autem? Quam!
          </p>
        </div>

        <div className="right-panel">
          <div className="form-achivment-container">
            <h2 className="heading">Apply for URU</h2>

            <div className="progress-bar-achivment-container">
              <div className="progress-text">{progressStep} of 4 completed</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            {step === 1 && (
              <>
                <p className="paragraph">Select the position you are applying for:</p>
                <form onSubmit={handleNext}>
                  <label className="radio-box">
                    <input type="radio" name="position" />
                    <span>Unique Record</span>
                  </label>
                  <label className="radio-box">
                    <input type="radio" name="position" />
                    <span>Unique Activity</span>
                  </label>
                  <small>* Start branch radio based</small>
                  <div className="form-footer">
                    <button type="submit" className="next-button">Next</button>
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
                    <button type="submit" className="next-button">Next</button>
                  </div>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <p className="section-title">Fill about Record/Activity Details:</p>
                <form className="personal-form" onSubmit={handleNext}>
                  <div className="grid-form">
                    <div className="achivment-form-group">
                      <label>Record/Activity Category*</label>
                      <select name="recordCategory" value={formData.recordCategory} onChange={handleInputChange} required>
                        <option value="">Select</option>
                        <option value="individual">Individual Effort</option>
                        <option value="group">Group Effort</option>
                      </select>
                    </div>
                    <div className="achivment-form-group">
                      <label>Record/Activity Title*</label>
                      <input type="text" name="recordTitle" value={formData.recordTitle} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Description of Record/Activity*</label>
                      <textarea name="recordDescription" value={formData.recordDescription} onChange={handleInputChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Purpose of the Record Attempt*</label>
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
                    <button type="submit" className="next-button">Next</button>
                  </div>
                </form>
              </>
            )}

            {step === 4 && (
              <>
                <p className="section-title">Provide Record/Activity Links and Upload Documents:</p>
                <form className="personal-form" onSubmit={handleNext}>
                  <div className="grid-form">
                    <div className="achivment-form-group">
                      <label>Google Drive Link</label>
                      <input type="url" name="googleDriveLink" value={formData.googleDriveLink} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Facebook Link</label>
                      <input type="url" name="facebookLink" value={formData.facebookLink} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>YouTube Link</label>
                      <input type="url" name="youtubeLink" value={formData.youtubeLink} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Instagram Link</label>
                      <input type="url" name="instagramLink" value={formData.instagramLink} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>LinkedIn Link</label>
                      <input type="url" name="linkedInLink" value={formData.linkedInLink} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>X Link</label>
                      <input type="url" name="xLink" value={formData.xLink} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Pinterest Link</label>
                      <input type="url" name="pinterestLink" value={formData.pinterestLink} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Other Media Link</label>
                      <input type="url" name="otherMediaLink" value={formData.otherMediaLink} onChange={handleInputChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Photo*</label>
                      <input type="file" name="photo" onChange={handleFileChange} required />
                    </div>
                    <div className="achivment-form-group">
                      <label>Video</label>
                      <input type="file" name="video" onChange={handleFileChange} />
                    </div>
                    <div className="achivment-form-group">
                      <label>Documents (PDF)</label>
                      <input type="file" name="document" onChange={handleFileChange} />
                    </div>
                  </div>
                  <div className="form-footer">
                    <button type="button" className="prev-button" onClick={handlePrevious}>← Previous</button>
                    <button type="submit" className="next-button">Next</button>
                  </div>
                </form>
              </>
            )}

            {step === 5 && !submitted && (
              <form className="thank-you-achivment-container" onSubmit={handleFinalSubmit}>
                <h2 className="heading">Thank you for your time</h2>
                <p className="paragraph">We will contact you shortly at the following email address <strong>{formData.emailId}</strong></p>
                <div className="checkbox-area">
                  <label>
                    <input type="checkbox" onChange={() => setTermsAccepted(!termsAccepted)} />
                    I accept the <a href="#">Terms and conditions</a>
                  </label>
                </div>
                <div className="form-footer">
                  <button type="button" className="prev-button" onClick={handlePrevious}>Previous</button>
                  <button type="submit" className="submit-button">Submit</button>
                </div>
              </form>
            )}

            {submitted && (
              <div className="thank-you-achivment-container">
                <div className="thank-you-achivment-container">
                  <div className="success-icon">
                    <FontAwesomeIcon icon={faCircleCheck} size="3x" color="#14b866" />
                  </div>
                  <h2 className="heading">Request successfully sent!</h2>
                  <p className="paragraph">You will be redirect back in 5 seconds</p>
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