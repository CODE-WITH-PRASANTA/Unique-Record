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

const UserDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: "",
    sex: "",
    dateOfBirth: "",
    address: "",
    district: "",
    country: "", // changed to lowercase 'c'
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
    position: "", // added position field
  });


useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  fetchCategories();
}, []);

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

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (termsAccepted) {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === "photo" || key === "video" || key === "document") {
            formDataToSend.append(key, formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/uru/create-uru`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.status === 201) {
          setSubmitted(true);
        } else {
          console.error("Error submitting form:", response);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      alert("Please accept the Terms and Conditions before submitting.");
    }
  };

  const progressStep = Math.min(Math.max(step - 1, 0), 5);
  const progressPercent = (progressStep / 5) * 100;

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
          Unique Records Universe (URU) aims to provide a global platform and recognition to extraordinary, inspiring, verifiable human achievements, natural phenomena and innovations from around the world by digitally cataloguing them. Our aim is to preserve unique records or activities for positive inspiration to future generations with inclusive, transparent and ethical standards.
          </p>
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
  <label>Effort Type *</label>
  <select name="recordCategory" value={formData.recordCategory} onChange={handleInputChange} required>
    <option value="">Select</option>
    <option value="individual">Individual Effort</option>
    <option value="group">Group Effort</option>
    {categories.map((category) => (
      <option key={category._id} value={category.name}>{category.name}</option>
    ))}
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
                    <button type="submit" className="next-button">Next</button>
                  </div>
                </form>
              </>
            )}

            {step === 4 && (
              <>
                <p className="section-title"><h2 className="evidence-heading">Evidence :</h2> 
                  You should attach full details of evidence related to your achievements, photographs, biodata including newspaper cuttings and various types of social media and web links.</p>
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
                      <input type="url" name="linkedInLink" value={formData.linkedInLink} onClick={handleInputChange} />
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
                    <button type="submit" className="next-button">Next</button>
                  </div>
                </form>
              </>
            )}

            {step === 6 && !submitted && (
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
                  <p className="paragraph">You will be see the submission successfull.</p>
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