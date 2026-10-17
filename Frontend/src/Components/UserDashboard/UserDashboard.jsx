import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../../Api';
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
  { kind: 'photos', label: 'Upload Photos (JPG/PNG)', limit: 'Max total 10MB', maxMB: 10, accept: 'image/png,image/jpeg,image/jpg,image/webp', required: true },
  { kind: 'documents', label: 'Upload Documents (PDF)', limit: 'Total max 10MB', maxMB: 10, accept: 'application/pdf,.pdf', required: false }
];

export const RECORD_CATEGORIES = [
  'Agriculture & Allied',
  'AI Technology',
  'Aircrafting',
  'Allopathic',
  'Animal Welfare',
  'Architecture',
  'Art',
  'Astrology',
  'Astronomy',
  'Ayurved',
  'Biology',
  'Bird Science',
  'Boating',
  'Brain Memory Power',
  'Bright & Brilliant Children',
  'Chemistry',
  'Civics',
  'Communications Revolution',
  'Competition',
  'Cosmic Energy Absorption',
  'Cow Service',
  'Dance',
  'Discover',
  'Economics',
  'Education',
  'Electric Vehicle',
  'Entomology',
  'Entrepreneurship',
  'Fashion & Design',
  'Film & Entertainment',
  'Food and Drink',
  'Forest Conservation',
  'Geography',
  'Geology',
  'Hindi',
  'History & Archeology',
  'Homeopathy',
  'Human Sciences & Behaviour',
  'Humanity Research',
  'Import & Export',
  'Indian Civilization Culture',
  'Information Technology',
  'Innovation',
  'Inspiring People',
  'International Peace',
  'Journalism',
  'Language',
  'Literature',
  'Marathon',
  'Marketing and Research',
  'Martial Arts',
  'Mass Communications',
  'Math',
  'Medical Service',
  'Mountain Studies & Research',
  'Mountaineer',
  'Nature & Environment',
  'Ocean Studies',
  'Online/Virtual',
  'Painting',
  'Physics',
  'Political Science',
  'Power of Yagya and Chanting',
  'Prodigious Talents',
  'Psychology',
  'Religion and Culture',
  'Religious Book',
  'Research',
  'River Conservation',
  'Sanskrit',
  'Science & Development',
  'Science & Technology',
  'Sculpture Art',
  'Seven Chakras Activity of the Body',
  'Shastra & Puran',
  'Singing and Playing',
  'Social Welfare',
  'Social Work & Development',
  'Sociology',
  'Space & Technology',
  'Special Talents',
  'Spirituality',
  'Sports',
  'Stunt',
  'Talented Child',
  'Tour & Travells',
  'Unani Medicine',
  'Upnishad',
  'Ved',
  'Water Conservation',
  'Website Development & Coding',
  "Women's Empowerment & Leadership",
  "World's Fattest",
  "World's Longest",
  "World's Oldest",
  "World's Slowest",
  "World's Smallest",
  "World's Tallest",
  "World's Thinnest",
  "World's Youngest",
  'Yoga & Meditation',
  'Other'
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

  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <div className={`udu-preview udu-preview-${kind}`}>
      {kind === 'photos' && url && <img src={url} alt={file.name} />}
      {kind === 'documents' && (
        <div className="udu-doc-chip">
          <span className="udu-doc-icon">PDF</span>
          <span className="udu-doc-name" title={file.name}>
            {file.name} <small style={{ opacity: 0.75 }}>({sizeMB} MB)</small>
          </span>
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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    category: '',
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

  // Pre-fill user data from localStorage if logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        setFormData((prev) => ({
          ...prev,
          applicantName: prev.applicantName || u.name || u.fullName || '',
          emailId: prev.emailId || u.email || '',
          whatsappNumber: prev.whatsappNumber || u.phoneNumber || u.mobile || '',
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [links, setLinks] = useState(
    LINK_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: [''] }), {})
  );
  const [files, setFiles] = useState({ photos: [], videos: [], documents: [] });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

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

    const maxBytes = maxMB * 1024 * 1024;

    // 1. File Format / Extension Validation
    if (kind === 'photos') {
      const invalidPhoto = incoming.find((f) => {
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        const validExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
        const validType = f.type ? f.type.startsWith('image/') : false;
        return !validExt && !validType;
      });

      if (invalidPhoto) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Photo Format',
          text: `"${invalidPhoto.name}" is not a valid image format. Please select JPG, PNG, or WEBP photos only.`,
          confirmButtonColor: '#2563eb'
        });
        if (input) input.value = '';
        return;
      }
    } else if (kind === 'documents') {
      const invalidDoc = incoming.find((f) => {
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        const validExt = ['pdf'].includes(ext);
        const validType = f.type === 'application/pdf';
        return !validExt && !validType;
      });

      if (invalidDoc) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Document Format',
          text: `"${invalidDoc.name}" is not a valid PDF document. Please upload PDF files only.`,
          confirmButtonColor: '#2563eb'
        });
        if (input) input.value = '';
        return;
      }
    }

    // 2. Individual File Size Validation (<= 10MB)
    const oversizedFile = incoming.find((f) => f.size > maxBytes);
    if (oversizedFile) {
      const sizeMB = (oversizedFile.size / (1024 * 1024)).toFixed(2);
      Swal.fire({
        icon: 'warning',
        title: 'File Size Exceeded',
        html: `The file <strong>"${oversizedFile.name}"</strong> is <strong>${sizeMB} MB</strong>.<br/>Maximum allowed size is <strong>${maxMB} MB</strong>.`,
        confirmButtonColor: '#2563eb'
      });
      if (input) input.value = '';
      return;
    }

    // 3. Cumulative Total Size Validation (<= 10MB)
    const currentSize = files[kind].reduce((sum, f) => sum + f.size, 0);
    const incomingSize = incoming.reduce((sum, f) => sum + f.size, 0);
    if (currentSize + incomingSize > maxBytes) {
      const totalMB = ((currentSize + incomingSize) / (1024 * 1024)).toFixed(2);
      Swal.fire({
        icon: 'warning',
        title: 'Upload Limit Exceeded',
        html: `Adding these files would make the total size <strong>${totalMB} MB</strong>.<br/>Total files for this section cannot exceed <strong>${maxMB} MB</strong>.`,
        confirmButtonColor: '#2563eb'
      });
      if (input) input.value = '';
      return;
    }

    setFiles((prev) => ({ ...prev, [kind]: [...prev[kind], ...incoming] }));
    if (input) input.value = '';
  };

  const removeFile = (kind, index) =>
    setFiles((prev) => ({ ...prev, [kind]: prev[kind].filter((_, i) => i !== index) }));

  const handleNext = () => {
    if (formRef.current && !formRef.current.reportValidity()) return;

    // Validation for Step 4 (Evidence & Media)
    if (currentStep === 4) {
      if (!files.photos || files.photos.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Photo Required',
          text: 'Please upload at least one valid supporting photo (JPG, PNG, or WEBP, Max 10MB) before proceeding to the next step.',
          confirmButtonColor: '#2563eb'
        });
        return;
      }

      const maxBytes = 10 * 1024 * 1024;
      const totalPhotoSize = files.photos.reduce((sum, f) => sum + f.size, 0);
      if (totalPhotoSize > maxBytes) {
        Swal.fire({
          icon: 'error',
          title: 'Photo Size Limit Exceeded',
          text: `Total uploaded photos size is ${(totalPhotoSize / (1024 * 1024)).toFixed(2)} MB. Maximum allowed is 10 MB. Please remove some files.`,
          confirmButtonColor: '#2563eb'
        });
        return;
      }

      if (files.documents && files.documents.length > 0) {
        const totalDocSize = files.documents.reduce((sum, f) => sum + f.size, 0);
        if (totalDocSize > maxBytes) {
          Swal.fire({
            icon: 'error',
            title: 'Document Size Limit Exceeded',
            text: `Total uploaded documents size is ${(totalDocSize / (1024 * 1024)).toFixed(2)} MB. Maximum allowed is 10 MB. Please remove some files.`,
            confirmButtonColor: '#2563eb'
          });
          return;
        }
      }
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      return Swal.fire({
        icon: 'warning',
        title: 'Terms & Conditions Required',
        text: 'Please accept the Terms and Conditions before submitting your application.',
        confirmButtonColor: '#2563eb'
      });
    }

    // Ensure valid photo is attached before submitting
    if (!files.photos || files.photos.length === 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Photo Required',
        text: 'Please upload at least one valid supporting photo (JPG, PNG, or WEBP, Max 10MB) before submitting your application.',
        confirmButtonColor: '#2563eb'
      });
    }

    const maxBytes = 10 * 1024 * 1024;
    const totalPhotoSize = files.photos.reduce((sum, f) => sum + f.size, 0);
    if (totalPhotoSize > maxBytes) {
      return Swal.fire({
        icon: 'error',
        title: 'Photo Size Limit Exceeded',
        text: 'Total uploaded photos size exceeds 10 MB. Please remove some files before saving.',
        confirmButtonColor: '#2563eb'
      });
    }

    if (files.documents && files.documents.length > 0) {
      const totalDocSize = files.documents.reduce((sum, f) => sum + f.size, 0);
      if (totalDocSize > maxBytes) {
        return Swal.fire({
          icon: 'error',
          title: 'Document Size Limit Exceeded',
          text: 'Total uploaded documents size exceeds 10 MB. Please remove some files before saving.',
          confirmButtonColor: '#2563eb'
        });
      }
    }

    try {
      setIsSubmitting(true);
      Swal.fire({
        title: 'Submitting Application...',
        text: 'Please wait while we upload your files and save your application.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const data = new FormData();
      // Append form fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Attach logged-in user identification
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u.id || u._id) data.append('userId', u.id || u._id);
          if (u.uniqueId) data.append('uniqueId', u.uniqueId);
          if (!formData.emailId && u.email) data.append('emailId', u.email);
        }
      } catch (e) {
        console.error(e);
      }

      // Append links
      data.append('links', JSON.stringify(links));

      // Append files
      if (files.photos && files.photos.length > 0) {
        files.photos.forEach((file) => data.append('photos', file));
      }
      if (files.videos && files.videos.length > 0) {
        files.videos.forEach((file) => data.append('videos', file));
      }
      if (files.documents && files.documents.length > 0) {
        files.documents.forEach((file) => data.append('documents', file));
      }

      // Attach token if present
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await axios.post(`${API_URL}/uru/apply`, data, { headers });

      const appNumber = res.data?.applicationNumber || res.data?.data?.applicationNumber || res.data?.appNo || 'URU';

      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        html: `
          <div style="font-size: 15px; margin-top: 10px;">
            <p>Your unique application has been registered successfully.</p>
            <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; margin: 15px 0;">
              <strong>Application Number:</strong>
              <div style="font-size: 20px; font-weight: bold; color: #0284c7; margin-top: 4px;">${appNumber}</div>
            </div>
            <p style="color: #64748b; font-size: 13px;">Our evaluation team will review your application. You can track status on your dashboard.</p>
          </div>
        `,
        confirmButtonText: 'View Application Status',
        showCancelButton: true,
        cancelButtonText: 'Submit Another',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/uru/application-status');
        } else {
          window.location.reload();
        }
      });
    } catch (err) {
      console.error('Error submitting application:', err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.message || 'Failed to submit application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const completed = Math.min(currentStep - 1, COMPLETABLE);
  const progressPercent = (completed / COMPLETABLE) * 100;
  const active = STEPS[currentStep - 1];

  return (
    <div className="udu-dashboard-container">
      {/* ================= Premium Sidebar ================= */}
      <aside className="udu-sidebar-section">
        <div className="udu-sidebar-inner">
          <div className="udu-sidebar-hero">
            <ClipboardIllustration />
          </div>

          <h1 className="udu-sidebar-title">Unique Records Of Universe</h1>

          <div className="udu-sidebar-desc-card">
            <p className="udu-sidebar-desc">
              Unique Records Universe (URU) empowers extraordinary, inspiring human achievements and innovations worldwide through digital archival preservation and global recognition.
            </p>
          </div>

          <button
            type="button"
            className="udu-sidebar-instruction-btn"
            onClick={() => setShowInstructionsModal(true)}
          >
            <span className="udu-sib-icon">📋</span>
            <span className="udu-sib-label">Important Instructions</span>
            <span className="udu-sib-badge">View</span>
          </button>

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
                      <select id="category" {...bind('category')} required>
                        <option value="">-- Select Category --</option>
                        {formData.category && !RECORD_CATEGORIES.includes(formData.category) && (
                          <option value={formData.category}>{formData.category}</option>
                        )}
                        {RECORD_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
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
                    {UPLOADS.map((u) => {
                      const fileCount = (files[u.kind] || []).length;
                      const totalBytes = (files[u.kind] || []).reduce((s, f) => s + f.size, 0);
                      const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
                      const isRequiredEmpty = u.required && fileCount === 0;

                      return (
                        <div className="udu-upload-box" key={u.kind}>
                          <label className="udu-upload-label" htmlFor={u.kind}>
                            {u.label} <small>({u.limit})</small>
                            {u.required && <span className="udu-req">*</span>}
                          </label>
                          <label className={`udu-dropzone ${isRequiredEmpty ? 'udu-dropzone-required' : ''}`} htmlFor={u.kind}>
                            <span className="udu-choose-btn">
                              <Icon name="upload" className="udu-btn-svg" />
                              Choose Files
                            </span>
                            <span className="udu-choose-text">
                              {fileCount
                                ? `${fileCount} file(s) selected (${totalMB} MB)`
                                : (u.required ? 'No file chosen (Required)' : 'No file chosen')}
                            </span>
                            <input
                              id={u.kind}
                              type="file"
                              multiple
                              accept={u.accept}
                              onChange={(e) => handleFiles(u.kind, u.maxMB, e.target.files, e.target)}
                            />
                          </label>

                          {fileCount > 0 && (
                            <div className="udu-preview-grid">
                              {files[u.kind].map((file, i) => (
                                <FilePreview key={`${file.name}-${file.size}-${i}`} file={file} kind={u.kind} onRemove={() => removeFile(u.kind, i)} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                    <label htmlFor="acceptTerms">
                      <input
                        id="acceptTerms"
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        required
                      />
                      <span>
                        I have read and accept the{' '}
                        <button
                          type="button"
                          className="udu-terms-link-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowTermsModal(true);
                          }}
                        >
                          Terms and Conditions
                        </button>{' '}
                        and verify all data provided is accurate.
                      </span>
                    </label>
                  </div>

                  {/* Terms & Conditions Modal */}
                  {showTermsModal && (
                    <div className="udu-modal-overlay" onClick={() => setShowTermsModal(false)}>
                      <div className="udu-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="udu-modal-header">
                          <div className="udu-modal-title-wrap">
                            <span className="udu-modal-badge">📜 Official Policy</span>
                            <h3>Unique Records of Universe (URU)</h3>
                            <p>Terms and Conditions &amp; Applicant Undertaking</p>
                          </div>
                          <button
                            type="button"
                            className="udu-modal-close-btn"
                            onClick={() => setShowTermsModal(false)}
                            aria-label="Close Terms"
                          >
                            ×
                          </button>
                        </div>

                        <div className="udu-modal-body">
                          <div className="udu-modal-intro">
                            <p>
                              By submitting this application to <strong>Unique Records of Universe (URU)</strong> (operated under <em>DIVYA PRERAK KAHANIYAN HUMANITY RESEARCH CENTRE TRUST</em>), you solemnly agree and adhere to the following Terms, Conditions, and Guidelines:
                            </p>
                          </div>

                          <div className="udu-modal-section">
                            <h4>1. Authenticity &amp; Declaration of Truth</h4>
                            <p>All information, personal particulars, attempt descriptions, timelines, and venues provided in this application are strictly authentic, truthful, and accurate. Any intentional exaggeration or fabricated information will lead to immediate disqualification.</p>
                          </div>

                          <div className="udu-modal-section">
                            <h4>2. Evidentiary Proof &amp; Media Rights</h4>
                            <p>All uploaded photographs, video links, certificates, and supporting documents must be original. You warrant that you hold full rights, permissions, or ownership of the submitted materials, and that they do not infringe upon any third-party copyright, privacy, or intellectual property rights.</p>
                          </div>

                          <div className="udu-modal-section">
                            <h4>3. Scrutiny, Verification &amp; Adjudication</h4>
                            <p>Submission of an application does not guarantee record confirmation or certification. URU's editorial and verification board reserves the full and unfettered right to assess, verify with experts/witnesses, and approve or reject any record claim at its sole discretion.</p>
                          </div>

                          <div className="udu-modal-section">
                            <h4>4. Worldwide Publication &amp; Digital Archival</h4>
                            <p>Upon approval, you grant URU the worldwide, non-exclusive, perpetual right to digitally archive, display, publish, and promote the record title, your name, photograph, and achievement narrative across the official website, record database, certificates, and promotional publications.</p>
                          </div>

                          <div className="udu-modal-section">
                            <h4>5. Safety &amp; Risk Indemnity</h4>
                            <p>Any record, activity, or stunt was attempted entirely of the applicant's own free will, judgment, and risk. URU and its trustees or associates assume no liability or responsibility for any injury, accident, loss, or legal complication arising during or following the attempt.</p>
                          </div>

                          <div className="udu-modal-section">
                            <h4>6. Revocation Policy</h4>
                            <p>If at any time post-approval a record is discovered to have been achieved through fraud, forged documents, unethical practices, or copyright infringement, URU reserves the right to immediately revoke the record and nullify any issued certificates.</p>
                          </div>

                          <div className="udu-modal-section">
                            <h4>7. Governing Law &amp; Jurisdiction</h4>
                            <p>All disputes, claims, and inquiries shall be subject to the exclusive jurisdiction of the competent courts of India and governed by the laws of India.</p>
                          </div>
                        </div>

                        <div className="udu-modal-footer">
                          <button
                            type="button"
                            className="udu-modal-secondary-btn"
                            onClick={() => setShowTermsModal(false)}
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="udu-modal-accept-btn"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, acceptTerms: true }));
                              setShowTermsModal(false);
                            }}
                          >
                            ✓ I Read &amp; Accept Terms
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                <button type="submit" className="udu-btn-submit" disabled={!formData.acceptTerms || isSubmitting}>
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application 🚀'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      {/* ================= Important Instructions Modal ================= */}
      {showInstructionsModal && (
        <div className="udu-modal-overlay" onClick={() => setShowInstructionsModal(false)}>
          <div className="udu-modal-card udu-instructions-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="udu-modal-header">
              <div className="udu-modal-title-wrap">
                <span className="udu-modal-badge">📋 Official Guidelines</span>
                <h3>Important Instructions for Filling Out the Online Application Form</h3>
                <p>Please review these detailed instructions and guidelines before submitting</p>
              </div>
              <button
                type="button"
                className="udu-modal-close-btn"
                onClick={() => setShowInstructionsModal(false)}
                aria-label="Close Instructions"
              >
                ×
              </button>
            </div>

            <div className="udu-modal-body udu-instructions-modal-body">
              <div className="udu-instructions-list">
                <div className="udu-inst-item">
                  <span className="udu-inst-num">1</span>
                  <div className="udu-inst-content">
                    <strong>Start Your Application:</strong>
                    <p>Log in to the website using the login ID created during account registration. Click on the “Apply for URU Holder” tab to open the application form.</p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">2</span>
                  <div className="udu-inst-content">
                    <strong>Enter Personal Information:</strong>
                    <p>Accurately provide your full name, email address, residential address, and contact number.</p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">3</span>
                  <div className="udu-inst-content">
                    <strong>Provide Record Details:</strong>
                    <p>Enter a brief description of your unique achievement, activity, or record and upload the relevant supporting documents.</p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">4</span>
                  <div className="udu-inst-content">
                    <strong>Complete All Sections:</strong>
                    <p>Carefully complete all five steps of the application form. Ensure that no mandatory field is left blank and provide accurate information after due consideration. Once the final form has been submitted, you will not be able to edit or update it.</p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">5</span>
                  <div className="udu-inst-content">
                    <strong>Read the Terms and Conditions:</strong>
                    <p>Before submitting the form, carefully read and accept the terms and conditions.</p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">6</span>
                  <div className="udu-inst-content">
                    <strong>Review Your Application:</strong>
                    <p>Use the “Previous” button to review the information you have entered and make any necessary corrections before final submission.</p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">7</span>
                  <div className="udu-inst-content">
                    <strong>Submit the Application:</strong>
                    <p>After verifying all the information, click the “Submit” button. You will receive a confirmation email after successful submission.</p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">8</span>
                  <div className="udu-inst-content">
                    <strong>Contact for Assistance:</strong>
                    <p>
                      If you encounter any problems, contact our administrative team at{' '}
                      <a href="mailto:uruonline2025@gmail.com" className="udu-inst-link">uruonline2025@gmail.com</a> or call{' '}
                      <a href="tel:+919472351693" className="udu-inst-link">+91 9472351693</a>.
                    </p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">9</span>
                  <div className="udu-inst-content">
                    <strong>Verification of Application:</strong>
                    <p>After successful submission, the URU Jury Team will thoroughly examine the unique record or unique activity described in your application. Recognition will be granted only if the application meets the required criteria and is approved; otherwise, your application may be rejected.</p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">10</span>
                  <div className="udu-inst-content">
                    <strong>Application Status and Publication:</strong>
                    <p>If your application is verified by the Scrutiny Committee and the Jury Committee, you can check its updated status by opening the “Application Status” tab. After payment of the prescribed fee mentioned there, your unique record or unique activity, along with the details and information provided by you, will be officially published on the URU worldwide website, and a digital certificate will also be issued.</p>
                  </div>
                </div>

                <div className="udu-inst-item udu-inst-fee-item">
                  <span className="udu-inst-num">11</span>
                  <div className="udu-inst-content">
                    <strong>Application and Certification Fees:</strong>
                    <p>
                      The application and certification fee for URU is <span className="udu-fee-old">₹9,639</span>. However, as per the committee's decision, until further notice, applicants whose applications are approved will be required to pay only <span className="udu-fee-new">₹3,693</span>. Concessions on this revised fee may also be granted to genuinely deserving and meritorious applicants from economically weaker backgrounds who have accomplished something unique.
                    </p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">12</span>
                  <div className="udu-inst-content">
                    <strong>Updating Published Records:</strong>
                    <p>
                      If you wish to add any additional information to your successfully published unique record or activity in the future, you may do so. To request an update, send an email from your previously registered email address to the official URU email address:{' '}
                      <a href="mailto:uruonline2025@gmail.com" className="udu-inst-link">uruonline2025@gmail.com</a>.
                    </p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">13</span>
                  <div className="udu-inst-content">
                    <strong>Reclassification from Unique Record to Unique Activity:</strong>
                    <p>If you apply under the Unique Record category but the Jury Committee determines that your application is more suitable for the Unique Activity category, your application will be registered under the Unique Activity category.</p>
                  </div>
                </div>

                <div className="udu-inst-item">
                  <span className="udu-inst-num">14</span>
                  <div className="udu-inst-content">
                    <strong>Reclassification from Unique Activity to Unique Record:</strong>
                    <p>If you apply under the Unique Activity category but the Jury Committee determines that your application is more suitable for the Unique Record category, your application will be registered under the Unique Record category.</p>
                  </div>
                </div>
              </div>

              {/* Note Alert Card */}
              <div className="udu-inst-note-box">
                <div className="udu-inst-note-title">
                  <span>⚠️</span>
                  <h4>Note</h4>
                </div>
                <p>
                  All information provided must be accurate and truthful. Applications containing incomplete or incorrect information may be rejected. Even if your unique record or unique activity has already been published on the URU website, if the information is subsequently found to be false, the published details may be removed from the website. In such cases, you will be informed separately and given an opportunity to present your explanation.
                </p>
              </div>
            </div>

            <div className="udu-modal-footer">
              <button
                type="button"
                className="udu-modal-accept-btn"
                onClick={() => setShowInstructionsModal(false)}
              >
                ✓ Understood, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;