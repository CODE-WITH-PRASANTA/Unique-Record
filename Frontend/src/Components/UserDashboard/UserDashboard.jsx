import React, { useEffect, useRef, useState } from 'react';
import './UserDashboard.css';

const LOGO_SRC = null;

const STEPS = [
  { id: 1, title: 'Application Type', hint: 'Record or activity', desc: 'Choose what you want to register.' },
  { id: 2, title: 'Personal Details', hint: 'About you', desc: 'Tell us who is applying.' },
  { id: 3, title: 'Record Details', hint: 'What you attempted', desc: 'Describe what you attempted or achieved.' },
  { id: 4, title: 'Evidence & Media', hint: 'Links and uploads', desc: 'Add links and files that prove it.' },
  { id: 5, title: 'Witnesses', hint: 'Optional support', desc: 'Add up to two witnesses (optional).' },
  { id: 6, title: 'Confirmation', hint: 'Accept & submit', desc: 'Review and complete your application.' }
];
const TOTAL_STEPS = STEPS.length;
const COMPLETABLE = 5;

const LINK_FIELDS = [
  { name: 'driveLink', label: 'Google Drive Links', icon: 'globe' },
  { name: 'facebookLink', label: 'Facebook Links', icon: 'globe' },
  { name: 'youtubeLink', label: 'YouTube Links', icon: 'globe' },
  { name: 'instagramLink', label: 'Instagram Links', icon: 'globe' },
  { name: 'linkedinLink', label: 'LinkedIn Links', icon: 'globe' },
  { name: 'twitterLink', label: 'X (Twitter) Links', icon: 'globe' },
  { name: 'pinterestLink', label: 'Pinterest Links', icon: 'globe' },
  { name: 'otherMediaLink', label: 'Other Media Links', icon: 'globe' }
];

const UPLOADS = [
  { kind: 'photos', label: 'Upload Photos (JPG/PNG)', limit: 'Max total 10MB', maxMB: 10, accept: 'image/png,image/jpeg' },
  { kind: 'videos', label: 'Upload Videos (MP4)', limit: 'Max total 100MB', maxMB: 100, accept: 'video/mp4' },
  { kind: 'documents', label: 'Upload Documents (PDF)', limit: 'Total max 10MB', maxMB: 10, accept: 'application/pdf', full: true }
];

const ICONS = {
  user: (<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
  users: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  mapPin: (<><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>),
  home: (<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>),
  globe: (<><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>),
  hash: (<path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />),
  cap: (<><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>),
  phone: (<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />),
  mail: (<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></>),
  briefcase: (<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>),
  layers: (<><path d="M12 2L2 7l10 5 10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></>),
  building: (<><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" /></>),
  badge: (<><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5" /></>),
  zap: (<path d="M13 2L3 14h9l-1 8 10-12h-9z" />),
  upload: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5M12 3v12" /></>),
  check: (<path d="M20 6L9 17l-5-5" />)
};

const Icon = ({ name, className = 'udu-field-icon' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

const APPLICATION_TYPES = [
  { value: 'Unique Record', icon: 'badge', desc: 'Register a verifiable world-class achievement, phenomenon or innovation.' },
  { value: 'Unique Activity', icon: 'zap', desc: 'Register a distinctive landmark activity, expedition or event.' }
];

const Field = ({ label, name, value, onChange, type = 'text', placeholder, required, full, icon, children }) => (
  <div className={`udu-input-group ${full ? 'udu-full-span' : ''}`}>
    <label htmlFor={name}>
      {label}
      {required && <span className="udu-req">*</span>}
    </label>
    <div className={`udu-control ${icon ? 'udu-has-icon' : ''}`}>
      {icon && <Icon name={icon} />}
      {children || (
        <input id={name} type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} />
      )}
    </div>
  </div>
);

const FilePreview = ({ file, kind, onRemove }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (kind === 'documents') return undefined;
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file, kind]);

  return (
    <div className={`udu-preview udu-preview-${kind}`}>
      {kind === 'photos' && url && <img src={url} alt={file.name} />}
      {kind === 'videos' && url && <video src={url} controls preload="metadata" />}
      {kind === 'documents' && (
        <div className="udu-doc-chip">
          <span className="udu-doc-icon">PDF</span>
          <span className="udu-doc-name">{file.name}</span>
        </div>
      )}
      <button type="button" className="udu-remove-btn" onClick={onRemove} aria-label={`Remove ${file.name}`}>×</button>
    </div>
  );
};

const Logo = () =>
  LOGO_SRC ? (
    <img className="udu-logo-img" src={LOGO_SRC} alt="Unique Records Universe" />
  ) : (
    <span className="udu-brand">
      <span className="udu-logo-fallback" aria-hidden="true">
        <span className="udu-logo-core"></span>
      </span>
      <span className="udu-brand-text">
        <strong>URU</strong>
        <em>Records Universe</em>
      </span>
    </span>
  );

const ClipboardIllustration = () => (
  <svg className="udu-illustration" viewBox="0 0 260 250" role="img" aria-label="Record clipboard with medal">
    <defs>
      <radialGradient id="uduGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
        <stop offset="70%" stopColor="#6366f1" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="uduBoard" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      <linearGradient id="uduGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>
    <circle cx="130" cy="122" r="118" fill="url(#uduGlow)" />
    <circle cx="130" cy="122" r="108" fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 8" strokeLinecap="round" />
    <ellipse cx="130" cy="228" rx="62" ry="8" fill="#000" fillOpacity="0.3" />
    <g transform="translate(70 38)">
      <rect x="0" y="14" width="120" height="164" rx="16" fill="url(#uduBoard)" />
      <rect x="8" y="26" width="104" height="144" rx="10" fill="#ffffff" />
      <rect x="36" y="4" width="48" height="24" rx="8" fill="#cbd5e1" />
      <circle cx="34" cy="60" r="13" fill="#e2e8f0" />
      <path d="M12 98c0-13 9-21 22-21s22 8 22 21z" fill="#e2e8f0" />
      <rect x="64" y="50" width="34" height="7" rx="3.5" fill="#0f172a" />
      <rect x="64" y="64" width="34" height="5" rx="2.5" fill="#94a3b8" />
      <rect x="20" y="140" width="15" height="22" rx="4" fill="#38bdf8" />
      <rect x="42" y="126" width="15" height="36" rx="4" fill="#10b981" />
      <rect x="64" y="114" width="15" height="48" rx="4" fill="#6366f1" />
      <rect x="86" y="132" width="15" height="30" rx="4" fill="#f59e0b" />
    </g>
    <g transform="translate(202 82)">
      <path d="M-13 16L-20 48L-7 41L0 52L0 20Z" fill="#f43f5e" />
      <path d="M13 16L20 48L7 41L0 52L0 20Z" fill="#e11d48" />
      <circle r="26" fill="url(#uduGold)" stroke="#fff" strokeWidth="3" />
      <circle r="18" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" />
      <polygon points="0,-11 2.8,-3.8 10.5,-3.4 4.4,1.4 6.5,8.8 0,4.5 -6.5,8.8 -4.4,1.4 -10.5,-3.4 -2.8,-3.8" fill="#fff" />
    </g>
  </svg>
);

const UserDashboard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    applicationType: 'Unique Record',
    applicantName: '',
    sex: 'Female',
    dateOfBirth: '',
    address: '',
    district: '',
    state: '',
    country: 'India',
    pinCode: '',
    educationalQualification: '',
    whatsappNumber: '',
    emailId: '',
    occupation: '',
    category: 'Other',
    effortType: 'Individual Effort',
    activityTitle: '',
    activityDescription: '',
    activityPurpose: '',
    attemptDate: '',
    activityVenue: '',
    organisationName: '',
    witness1Name: '',
    witness1Designation: '',
    witness1Address: '',
    witness1Mobile: '',
    witness1Email: '',
    witness2Name: '',
    witness2Designation: '',
    witness2Address: '',
    witness2Mobile: '',
    witness2Email: '',
    acceptTerms: false
  });

  const [links, setLinks] = useState(
    LINK_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: [''] }), {})
  );
  const [files, setFiles] = useState({ photos: [], videos: [], documents: [] });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const bind = (name) => ({ name, value: formData[name], onChange: handleChange });

  const updateLink = (key, index, value) =>
    setLinks((prev) => ({ ...prev, [key]: prev[key].map((l, i) => (i === index ? value : l)) }));
  const addLink = (key) => setLinks((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
  const removeLink = (key, index) =>
    setLinks((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));

  const handleFiles = (kind, maxMB, fileList, input) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    const currentSize = files[kind].reduce((sum, f) => sum + f.size, 0);
    const incomingSize = incoming.reduce((sum, f) => sum + f.size, 0);
    if (currentSize + incomingSize > maxMB * 1024 * 1024) {
      alert(`Total size for this upload must be under ${maxMB}MB.`);
    } else {
      setFiles((prev) => ({ ...prev, [kind]: [...prev[kind], ...incoming] }));
    }
    if (input) input.value = '';
  };

  const removeFile = (kind, index) =>
    setFiles((prev) => ({ ...prev, [kind]: prev[kind].filter((_, i) => i !== index) }));

  const handleNext = () => {
    if (formRef.current && !formRef.current.reportValidity()) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert('Please accept the Terms and Conditions.');
      return;
    }
    console.log('Submitted Application Data:', { ...formData, links, files });
    alert('Application submitted successfully!');
  };

  const completed = Math.min(currentStep - 1, COMPLETABLE);
  const progressPercent = (completed / COMPLETABLE) * 100;
  const active = STEPS[currentStep - 1];

  return (
    <div className="udu-dashboard-container">
      {/* ================= Premium Sidebar ================= */}
      <aside className="udu-sidebar-section">
        <div className="udu-sidebar-inner">
          <div className="udu-sidebar-top">
            <Logo />
            <div className="udu-sidebar-badge">
              <span className="udu-badge-icon">i</span>
              Instructions
            </div>
          </div>

          <div className="udu-sidebar-hero">
            <ClipboardIllustration />
          </div>

          <h1 className="udu-sidebar-title">Unique Records Of Universe</h1>

          <div className="udu-sidebar-desc-card">
            <p className="udu-sidebar-desc">
              Unique Records Universe (URU) empowers extraordinary, inspiring human achievements and innovations worldwide through digital archival preservation and global recognition.
            </p>
          </div>

          <div className="udu-sidebar-progress">
            <div className="udu-sp-row">
              <span className="udu-sp-step">Step {currentStep} of {TOTAL_STEPS}</span>
              <span className="udu-sp-pct">{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
            </div>
            <strong className="udu-sp-title">{active.title}</strong>
            <span className="udu-sp-hint">{active.desc}</span>
            <div className="udu-sp-bars" aria-hidden="true">
              {STEPS.map((st) => (
                <span
                  key={st.id}
                  className={`udu-sp-bar ${st.id < currentStep ? 'done' : st.id === currentStep ? 'current' : ''}`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ================= Main Content Container ================= */}
      <main className="udu-main-content">
        <div className="udu-main-inner">
          <header className="udu-form-header">
            <div className="udu-header-tag">Official Registration Portal</div>
            <h2 className="udu-form-main-title">Apply Online Application Form</h2>
            <p className="udu-form-subtitle">
              Secure your unique record or historic activity permanently in the global digital archives of the universe.
            </p>
            <div className="udu-progress-indicator">
              <div className="udu-progress-meta">
                <span className="udu-completed-count">
                  ✨ Step {currentStep} of {COMPLETABLE} Completed
                </span>
                <span className="udu-progress-pct">{Math.round(progressPercent)}% Done</span>
              </div>
              <div className="udu-progress-track">
                <div className="udu-progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </header>

          <form className="udu-multi-step-form" onSubmit={handleSubmit} ref={formRef}>
            <div className="udu-card-head">
              <span className="udu-card-badge">{currentStep}</span>
              <div className="udu-card-headtext">
                <h3 className="udu-card-title">{active.title}</h3>
                <p className="udu-card-desc">{active.desc}</p>
              </div>
            </div>

            <div className="udu-card-body">
              {/* ---------- STEP 1 ---------- */}
              {currentStep === 1 && (
                <div className="udu-form-step-pane udu-step-1">
                  <h3 className="udu-section-heading">Select the position you are applying for:</h3>
                  <div className="udu-radio-group-cards">
                    {APPLICATION_TYPES.map((t) => (
                      <label
                        key={t.value}
                        className={`udu-radio-card ${formData.applicationType === t.value ? 'active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="applicationType"
                          value={t.value}
                          checked={formData.applicationType === t.value}
                          onChange={handleChange}
                          required
                        />
                        <span className="udu-radio-icon">
                          <Icon name={t.icon} className="udu-radio-svg" />
                        </span>
                        <span className="udu-radio-label-text">{t.value}</span>
                        <span className="udu-radio-desc">{t.desc}</span>
                        <span className="udu-radio-check" aria-hidden="true">
                          {formData.applicationType === t.value && <Icon name="check" className="udu-check-svg" />}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="udu-helper-note">* Choose your branch radio selection carefully to proceed.</p>
                </div>
              )}

              {/* ---------- STEP 2 ---------- */}
              {currentStep === 2 && (
                <div className="udu-form-step-pane udu-step-2">
                  <h3 className="udu-section-heading">Please fill in your personal details:</h3>
                  <div className="udu-form-grid">
                    <Field label="Applicant Name" icon="user" {...bind('applicantName')} placeholder="Enter full name" required />
                    <Field label="Sex" icon="user" name="sex" required>
                      <select id="sex" {...bind('sex')}>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>
                    <Field label="Date of Birth" icon="calendar" {...bind('dateOfBirth')} type="date" required />
                    <Field label="Address" icon="home" {...bind('address')} placeholder="Street address" required />
                    <Field label="District" icon="mapPin" {...bind('district')} placeholder="District" required />
                    <Field label="State" icon="mapPin" {...bind('state')} placeholder="State" required />
                    <Field label="Country" icon="globe" {...bind('country')} placeholder="Country" required />
                    <Field label="Pin Code" icon="hash" {...bind('pinCode')} placeholder="Pin code" required />
                    <Field label="Educational Qualification" icon="cap" {...bind('educationalQualification')} placeholder="e.g. BTech" required />
                    <Field label="WhatsApp Mobile Number" icon="phone" {...bind('whatsappNumber')} type="tel" placeholder="Mobile number" required />
                    <Field label="Email ID" icon="mail" {...bind('emailId')} type="email" placeholder="name@example.com" required />
                    <Field label="Occupation" icon="briefcase" {...bind('occupation')} placeholder="Your occupation" required />
                  </div>
                </div>
              )}

              {/* ---------- STEP 3 ---------- */}
              {currentStep === 3 && (
                <div className="udu-form-step-pane udu-step-3">
                  <h3 className="udu-section-heading">Fill about Record/Activity Details:</h3>
                  <div className="udu-form-grid">
                    <Field label="Select Category" icon="layers" name="category" required>
                      <select id="category" {...bind('category')}>
                        <option value="Other">Other</option>
                        <option value="Science & Tech">Science & Tech</option>
                        <option value="Arts & Culture">Arts & Culture</option>
                        <option value="Sports">Sports</option>
                      </select>
                    </Field>
                    <Field label="Effort Type" icon="users" name="effortType" required>
                      <select id="effortType" {...bind('effortType')}>
                        <option value="Individual Effort">Individual Effort</option>
                        <option value="Group Effort">Group Effort</option>
                      </select>
                    </Field>
                    <Field label="Record/Activity Title" name="activityTitle" required full>
                      <textarea id="activityTitle" {...bind('activityTitle')} rows="2" required placeholder="Title of your record/activity"></textarea>
                    </Field>
                    <Field label="Description of Record/Activity" name="activityDescription" required full>
                      <textarea id="activityDescription" {...bind('activityDescription')} rows="4" required placeholder="Detailed description..."></textarea>
                    </Field>
                    <Field label="Purpose of the Record/Activity Attempt" name="activityPurpose" required full>
                      <textarea id="activityPurpose" {...bind('activityPurpose')} rows="3" required placeholder="State the purpose"></textarea>
                    </Field>
                    <Field label="Date of the Attempted" icon="calendar" {...bind('attemptDate')} type="date" required />
                    <Field label="Record/Activity Venue" icon="mapPin" {...bind('activityVenue')} placeholder="Location / Venue" required />
                    <Field label="Organisation Name (optional)" icon="building" {...bind('organisationName')} placeholder="Associated organisation, if any" full />
                  </div>
                </div>
              )}

              {/* ---------- STEP 4 ---------- */}
              {currentStep === 4 && (
                <div className="udu-form-step-pane udu-step-4">
                  <h3 className="udu-section-heading">Evidence & Documentation:</h3>
                  <p className="udu-section-subtext">
                    Attach full evidentiary details, photographs, biodata, newspaper cuttings, and official web/social media links.
                  </p>

                  <div className="udu-links-grid">
                    {LINK_FIELDS.map((f) => (
                      <div className="udu-input-group-addon" key={f.name}>
                        <label htmlFor={`${f.name}-0`}>{f.label}</label>
                        {links[f.name].map((val, i) => (
                          <div className="udu-input-with-btn" key={i}>
                            <input
                              id={`${f.name}-${i}`}
                              type="url"
                              value={val}
                              onChange={(e) => updateLink(f.name, i, e.target.value)}
                              placeholder="https://..."
                            />
                            {i === 0 ? (
                              <button type="button" className="udu-add-btn" onClick={() => addLink(f.name)} aria-label={`Add another ${f.label}`}>+</button>
                            ) : (
                              <button type="button" className="udu-add-btn udu-add-btn-remove" onClick={() => removeLink(f.name, i)} aria-label="Remove link">×</button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="udu-upload-section-grid">
                    {UPLOADS.map((u) => (
                      <div className={`udu-upload-box ${u.full ? 'udu-full-span' : ''}`} key={u.kind}>
                        <label className="udu-upload-label" htmlFor={u.kind}>
                          {u.label} <small>({u.limit})</small>
                        </label>
                        <label className="udu-dropzone" htmlFor={u.kind}>
                          <span className="udu-choose-btn">
                            <Icon name="upload" className="udu-btn-svg" />
                            Choose Files
                          </span>
                          <span className="udu-choose-text">
                            {files[u.kind].length ? `${files[u.kind].length} file(s) selected` : 'No file chosen'}
                          </span>
                          <input
                            id={u.kind}
                            type="file"
                            multiple
                            accept={u.accept}
                            onChange={(e) => handleFiles(u.kind, u.maxMB, e.target.files, e.target)}
                          />
                        </label>

                        {files[u.kind].length > 0 && (
                          <div className="udu-preview-grid">
                            {files[u.kind].map((file, i) => (
                              <FilePreview key={`${file.name}-${file.size}-${i}`} file={file} kind={u.kind} onRemove={() => removeFile(u.kind, i)} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------- STEP 5 ---------- */}
              {currentStep === 5 && (
                <div className="udu-form-step-pane udu-step-5">
                  <h3 className="udu-section-heading">Witness Details (Optional):</h3>

                  {[1, 2].map((n) => (
                    <div className={`udu-witness-card-section ${n === 2 ? 'udu-mt-4' : ''}`} key={n}>
                      <h4 className="udu-sub-heading">
                        <span className="udu-sub-badge">{n}</span>
                        Witness {n}
                      </h4>
                      <div className="udu-form-grid">
                        <Field label={`Name of Witness ${n}`} icon="user" {...bind(`witness${n}Name`)} placeholder="Full name" />
                        <Field label="Witness Designation" icon="badge" {...bind(`witness${n}Designation`)} placeholder="Designation" />
                        <Field label="Witness Address" icon="home" {...bind(`witness${n}Address`)} placeholder="Address" full />
                        <Field label="Witness Mobile Number" icon="phone" {...bind(`witness${n}Mobile`)} type="tel" placeholder="Mobile number" />
                        <Field label="Witness Email ID" icon="mail" {...bind(`witness${n}Email`)} type="email" placeholder="Email address" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ---------- STEP 6 ---------- */}
              {currentStep === 6 && (
                <div className="udu-form-step-pane udu-step-6">
                  <div className="udu-thankyou-card">
                    <div className="udu-success-icon-badge">🎉</div>
                    <h3 className="udu-thank-title">Thank you very much for your unique contribution.</h3>
                    <div className="udu-thank-note">
                      <p className="udu-thank-desc">
                        This is the final step of application to digitally secure your unique <span>record/activity legacy</span> in the universe.
                      </p>
                    </div>
                    <p className="udu-contact-notice">
                      We will contact you shortly at the following email address{' '}
                      <strong>{formData.emailId || 'your-email@gmail.com'}</strong>
                    </p>
                  </div>

                  <div className="udu-terms-checkbox-wrap">
                    <label>
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        required
                      />
                      <span>I accept the Terms and Conditions and verify all data provided is accurate.</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* ---------- Navigation Actions ---------- */}
            <div className="udu-form-action-buttons">
              {currentStep > 1 && (
                <button type="button" className="udu-btn-prev" onClick={handlePrevious}>
                  ← Previous Step
                </button>
              )}
              {currentStep < TOTAL_STEPS ? (
                <button type="button" className="udu-btn-next" onClick={handleNext}>
                  Save &amp; Next Step →
                </button>
              ) : (
                <button type="submit" className="udu-btn-submit" disabled={!formData.acceptTerms}>
                  Submit Application 🚀
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;