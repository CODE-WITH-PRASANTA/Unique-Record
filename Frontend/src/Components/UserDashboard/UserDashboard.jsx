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

const UserDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      position: "",
  });

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

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

    // Save draft in localStorage whenever "Save & Next" clicked
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

    // On component load, check for saved draft
    useEffect(() => {
      const savedDraft = localStorage.getItem("uruDraft");
      if (savedDraft) {
        const { formData: savedData, step: savedStep } = JSON.parse(savedDraft);
        setFormData(savedData);
        setStep(savedStep);
      }
    }, []);


  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

    const handleFinalSubmit = async (e) => {
      e.preventDefault();
      if (termsAccepted) {
        setIsSubmitting(true); // Set submitting state to true
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
            localStorage.removeItem("uruDraft"); // Clear local storage
          } else {
            console.error("Error submitting form:", response);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
        } finally {
          setIsSubmitting(false); // Set submitting state to false
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
  {/* Company Logo */}
  <div className="achievement-form-logo">
    <img src={Companylogo} alt="Company Logo" />
  </div>

  {/* Social Icons */}
  <div className="achievement-form-social-icons">
    <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
    <a href="#"><FontAwesomeIcon icon={faXTwitter} /></a>
    <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
    <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
  </div>

  {/* Illustration */}
  <div className="achievement-form-illustration">
    <img src={img1} alt="Hiring Illustration" />
  </div>

  {/* Heading */}
  <h1 className="achievement-form-heading">Unique Record Of Universe</h1>

  {/* Description */}
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
                          <input
                            type="text"
                            name="otherMediaLink"
                            placeholder="Enter media link"
                            value={formData.otherMediaLink}
                            onChange={handleInputChange}
                            pattern="^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}.*$"
                            title="Please enter a valid link (with or without http/https/www)"
                          />
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
              {/* Modal for Terms */}
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
                    Your application for <strong>'Unique Record of Universe'</strong> Holder has been successfully received by URU Admin Section. 
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