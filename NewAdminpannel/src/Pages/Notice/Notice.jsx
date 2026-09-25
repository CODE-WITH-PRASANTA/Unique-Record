import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Notice.css";

/* =========================================
   CONSTANTS
========================================= */
const ITEMS_PER_PAGE = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_EXTRA_FILES = 5;
const MAX_DESCRIPTION = 500;

const PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const EXTRA_EXTENSIONS = [
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip", "jpg", "jpeg", "png",
];
const EXTRA_ACCEPT = EXTRA_EXTENSIONS.map((ext) => `.${ext}`).join(",");

const EMPTY_FORM = {
  postingDate: "",
  postOwner: "",
  title: "",
  description: "",
  link: "",
};

const FIELD_ORDER = ["photo", "postingDate", "postOwner", "title", "description", "link"];

/* =========================================
   ICONS (inline SVG)
========================================= */
const ICONS = {
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </>
  ),
  calendar: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  file: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </>
  ),
  align: (
    <>
      <path d="M15 12H3" />
      <path d="M17 18H3" />
      <path d="M21 6H3" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  fileUp: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M12 12v6" />
      <path d="m9 15 3-3 3 3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  edit: <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />,
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  external: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
  clip: (
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
};

const Icon = ({ name, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICONS[name]}
  </svg>
);

/* =========================================
   HELPERS
========================================= */
const isBlobUrl = (url) => typeof url === "string" && url.startsWith("blob:");

const revokeUrl = (url) => {
  if (isBlobUrl(url)) URL.revokeObjectURL(url);
};

const getExt = (name = "") => {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

const formatSize = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatDate = (value) => {
  if (!value) return "-";
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return value;
  return `${d} ${MONTHS[Number(m) - 1] || m} ${y}`;
};

const normalizeUrl = (value = "") => {
  const raw = value.trim();
  if (!raw) return "";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
    return withProtocol;
  } catch (err) {
    return null;
  }
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/* =========================================
   COMPONENT
========================================= */
const Notice = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const photoInputRef = useRef(null);
  const filesInputRef = useRef(null);
  const formCardRef = useRef(null);
  const toastTimer = useRef(null);

  const noticesRef = useRef([]);
  const photoRef = useRef(null);
  const extraFilesRef = useRef([]);
  noticesRef.current = notices;
  photoRef.current = photo;
  extraFilesRef.current = extraFiles;

  const isSavedUrl = (url) =>
    noticesRef.current.some(
      (item) => item.photo?.url === url || item.files.some((f) => f.url === url)
    );

  const revokeIfUnsaved = (url) => {
    if (!url) return;
    if (!isSavedUrl(url)) revokeUrl(url);
  };

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      noticesRef.current.forEach((item) => {
        revokeUrl(item.photo?.url);
        item.files.forEach((f) => revokeUrl(f.url));
      });
      revokeUrl(photoRef.current?.url);
      extraFilesRef.current.forEach((f) => revokeUrl(f.url));
    };
  }, []);

  const showToast = (type, message) => {
    clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    if (!viewItem && !deleteTarget) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setViewItem(null);
        setDeleteTarget(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [viewItem, deleteTarget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const processPhoto = (file) => {
    if (!file) return;

    if (!PHOTO_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo: "Only JPG, PNG, WEBP and AVIF images are allowed." }));
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setErrors((prev) => ({ ...prev, photo: "Photo must be smaller than 5 MB." }));
      return;
    }

    if (photo) revokeIfUnsaved(photo.url);
    setPhoto({ url: URL.createObjectURL(file), name: file.name });
    setErrors((prev) => ({ ...prev, photo: "" }));
  };

  const removePhoto = () => {
    if (photo) revokeIfUnsaved(photo.url);
    setPhoto(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const processFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    const list = [...extraFiles];
    const problems = [];

    incoming.forEach((file) => {
      if (!EXTRA_EXTENSIONS.includes(getExt(file.name))) {
        problems.push(`"${file.name}" is not an allowed file type.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        problems.push(`"${file.name}" is larger than 10 MB.`);
        return;
      }
      if (list.some((f) => f.name === file.name && f.size === file.size)) return;
      if (list.length >= MAX_EXTRA_FILES) {
        problems.push(`You can attach up to ${MAX_EXTRA_FILES} files.`);
        return;
      }
      list.push({
        id: uid(),
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      });
    });

    setExtraFiles(list);
    setErrors((prev) => ({ ...prev, files: problems[0] || "" }));
  };

  const removeExtraFile = (id) => {
    const target = extraFiles.find((f) => f.id === id);
    if (target) revokeIfUnsaved(target.url);
    setExtraFiles((prev) => prev.filter((f) => f.id !== id));
    setErrors((prev) => ({ ...prev, files: "" }));
  };

  const dragProps = (target, onFiles) => ({
    onDragOver: (e) => {
      e.preventDefault();
      if (dragTarget !== target) setDragTarget(target);
    },
    onDragLeave: (e) => {
      e.preventDefault();
      setDragTarget(null);
    },
    onDrop: (e) => {
      e.preventDefault();
      setDragTarget(null);
      onFiles(e.dataTransfer?.files);
    },
  });

  const openOnKey = (e, ref) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      ref.current?.click();
    }
  };

  const validate = () => {
    const err = {};

    if (!photo) err.photo = "Please upload a notice photo.";
    if (!form.postingDate) err.postingDate = "Please select a posting date.";
    if (!form.postOwner.trim()) err.postOwner = "Please enter the post owner's name.";
    if (!form.title.trim()) err.title = "Please enter the notice title.";
    if (!form.description.trim()) err.description = "Please enter the notice description.";

    if (!form.link.trim()) {
      err.link = "Please enter the notice link.";
    } else if (normalizeUrl(form.link) === null) {
      err.link = "Enter a valid link, e.g. https://example.com/notice";
    }

    setErrors(err);

    const firstKey = FIELD_ORDER.find((key) => err[key]);
    if (firstKey) {
      setTimeout(() => {
        document.getElementById(`NoticeField-${firstKey}`)?.focus();
      }, 0);
    }

    return Object.keys(err).length === 0;
  };

  const resetForm = (revokePending = true) => {
    if (revokePending) {
      if (photo) revokeIfUnsaved(photo.url);
      extraFiles.forEach((f) => revokeIfUnsaved(f.url));
    }

    setForm(EMPTY_FORM);
    setErrors({});
    setPhoto(null);
    setExtraFiles([]);
    setEditId(null);

    if (photoInputRef.current) photoInputRef.current.value = "";
    if (filesInputRef.current) filesInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast("error", "Please fix the highlighted fields.");
      return;
    }

    const payload = {
      postingDate: form.postingDate,
      postOwner: form.postOwner.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      link: normalizeUrl(form.link),
      photo,
      files: extraFiles,
    };

    if (editId) {
      const oldItem = notices.find((item) => item.id === editId);
      const updated = { ...oldItem, ...payload };

      setNotices((prev) => prev.map((item) => (item.id === editId ? updated : item)));

      if (oldItem) {
        const keep = new Set([updated.photo.url, ...updated.files.map((f) => f.url)]);
        [oldItem.photo?.url, ...oldItem.files.map((f) => f.url)].forEach((url) => {
          if (url && !keep.has(url)) revokeUrl(url);
        });
      }

      showToast("success", "Notice updated successfully.");
      resetForm(false);
      return;
    }

    const newItem = {
      id: Date.now(),
      active: true,
      ...payload,
    };

    setNotices((prev) => [newItem, ...prev]);
    setSearch("");
    setCurrentPage(1);
    showToast("success", "Notice published successfully.");
    resetForm(false);
  };

  const handleEdit = (item) => {
    if (photo) revokeIfUnsaved(photo.url);
    extraFiles.forEach((f) => revokeIfUnsaved(f.url));

    setEditId(item.id);
    setForm({
      postingDate: item.postingDate,
      postOwner: item.postOwner,
      title: item.title,
      description: item.description,
      link: item.link,
    });
    setPhoto(item.photo);
    setExtraFiles([...item.files]);
    setErrors({});

    if (photoInputRef.current) photoInputRef.current.value = "";
    if (filesInputRef.current) filesInputRef.current.value = "";

    formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;

    if (editId === target.id) resetForm(false);

    setNotices((prev) => prev.filter((item) => item.id !== target.id));

    revokeUrl(target.photo?.url);
    target.files.forEach((f) => revokeUrl(f.url));

    if (viewItem?.id === target.id) setViewItem(null);
    setDeleteTarget(null);
    showToast("success", "Notice deleted successfully.");
  };

  const toggleStatus = (id) => {
    setNotices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const filteredNotices = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notices;
    return notices.filter((item) =>
      [item.title, item.postOwner, item.description].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [notices, search]);

  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const activeCount = notices.filter((item) => item.active).length;

  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
      return;
    }
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) pages.push("left-ellipsis");

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("right-ellipsis");
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="Notice">
      {/* ================= HEADER ================= */}
      <div className="NoticeHeader">
        <div className="NoticeHeaderText">
          <h2>Notice Management</h2>
          <p>Create, publish and manage notices for your website</p>
        </div>

        <div className="NoticeHeaderStats">
          <div className="NoticeHeaderBadge">
            <span>{notices.length}</span>
            <small>Total</small>
          </div>
          <div className="NoticeHeaderBadge active">
            <span>{activeCount}</span>
            <small>Active</small>
          </div>
        </div>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="NoticeFormCard" ref={formCardRef}>
        <div className="NoticeFormHeading">
          <h3>{editId ? "Edit Notice" : "Add Notice"}</h3>
          {editId && <span className="NoticeEditingTag">Editing</span>}
        </div>

        <form className="NoticeForm" onSubmit={handleSubmit} noValidate>
          <div className="NoticeGrid">
            {/* PHOTO */}
            <div className="NoticeField">
              <label className="NoticeLabel" htmlFor="NoticeField-photo">
                <Icon name="image" /> Upload Photo <em>*</em>
              </label>

              <input
                ref={photoInputRef}
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => {
                  processPhoto(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />

              {photo ? (
                <div className="NoticePhotoPreview">
                  <img src={photo.url} alt="Notice preview" />
                  <div className="NoticePhotoInfo">
                    <strong title={photo.name}>{photo.name}</strong>
                    <div className="NoticePhotoActions">
                      <button type="button" onClick={() => photoInputRef.current?.click()}>
                        Change
                      </button>
                      <button type="button" className="danger" onClick={removePhoto}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  id="NoticeField-photo"
                  className={`NoticeDropzone ${dragTarget === "photo" ? "dragging" : ""} ${
                    errors.photo ? "error" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => photoInputRef.current?.click()}
                  onKeyDown={(e) => openOnKey(e, photoInputRef)}
                  {...dragProps("photo", (files) => processPhoto(files?.[0]))}
                >
                  <span className="NoticeChooseBtn">Choose File</span>
                  <span className="NoticeDropText">No file chosen</span>
                  <small>JPG, PNG, WEBP, AVIF · Max 5 MB</small>
                </div>
              )}

              {errors.photo && <p className="NoticeError">{errors.photo}</p>}
            </div>

            {/* POSTING DATE */}
            <div className="NoticeField">
              <label className="NoticeLabel" htmlFor="NoticeField-postingDate">
                <Icon name="calendar" /> Manage Posting Date <em>*</em>
              </label>
              <input
                id="NoticeField-postingDate"
                name="postingDate"
                type="date"
                className={`NoticeInput ${errors.postingDate ? "error" : ""}`}
                value={form.postingDate}
                onChange={handleChange}
              />
              {errors.postingDate && <p className="NoticeError">{errors.postingDate}</p>}
            </div>

            {/* POST OWNER */}
            <div className="NoticeField">
              <label className="NoticeLabel" htmlFor="NoticeField-postOwner">
                <Icon name="user" /> By (Post Owner Name) <em>*</em>
              </label>
              <input
                id="NoticeField-postOwner"
                name="postOwner"
                type="text"
                className={`NoticeInput ${errors.postOwner ? "error" : ""}`}
                placeholder="Enter post owner's name"
                value={form.postOwner}
                onChange={handleChange}
                maxLength={60}
              />
              {errors.postOwner && <p className="NoticeError">{errors.postOwner}</p>}
            </div>

            {/* TITLE */}
            <div className="NoticeField">
              <label className="NoticeLabel" htmlFor="NoticeField-title">
                <Icon name="file" /> Notice Title <em>*</em>
              </label>
              <input
                id="NoticeField-title"
                name="title"
                type="text"
                className={`NoticeInput ${errors.title ? "error" : ""}`}
                placeholder="Enter notice title"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.title && <p className="NoticeError">{errors.title}</p>}
            </div>

            {/* DESCRIPTION */}
            <div className="NoticeField NoticeFieldFull">
              <label className="NoticeLabel" htmlFor="NoticeField-description">
                <Icon name="align" /> Notice Description <em>*</em>
              </label>
              <textarea
                id="NoticeField-description"
                name="description"
                className={`NoticeTextarea ${errors.description ? "error" : ""}`}
                placeholder="Enter notice description"
                value={form.description}
                onChange={handleChange}
                maxLength={MAX_DESCRIPTION}
                rows={5}
              />
              <div className="NoticeFieldMeta">
                {errors.description ? (
                  <p className="NoticeError">{errors.description}</p>
                ) : (
                  <span />
                )}
                <small>
                  {form.description.length}/{MAX_DESCRIPTION}
                </small>
              </div>
            </div>

            {/* LINK */}
            <div className="NoticeField NoticeFieldFull">
              <label className="NoticeLabel" htmlFor="NoticeField-link">
                <Icon name="link" /> Notice Link <em>*</em>
              </label>
              <input
                id="NoticeField-link"
                name="link"
                type="text"
                inputMode="url"
                className={`NoticeInput ${errors.link ? "error" : ""}`}
                placeholder="Enter link to the notice"
                value={form.link}
                onChange={handleChange}
              />
              {errors.link && <p className="NoticeError">{errors.link}</p>}
            </div>

            {/* OTHER FILES */}
            <div className="NoticeField NoticeFieldFull">
              <label className="NoticeLabel" htmlFor="NoticeField-files">
                <Icon name="fileUp" /> Upload Other Files (Optional)
              </label>

              <input
                ref={filesInputRef}
                type="file"
                hidden
                multiple
                accept={EXTRA_ACCEPT}
                onChange={(e) => {
                  processFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              <div
                id="NoticeField-files"
                className={`NoticeDropzone ${dragTarget === "files" ? "dragging" : ""} ${
                  errors.files ? "error" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => filesInputRef.current?.click()}
                onKeyDown={(e) => openOnKey(e, filesInputRef)}
                {...dragProps("files", processFiles)}
              >
                <span className="NoticeChooseBtn">Choose Files</span>
                <span className="NoticeDropText">
                  {extraFiles.length
                    ? `${extraFiles.length} file${extraFiles.length > 1 ? "s" : ""} selected`
                    : "No file chosen"}
                </span>
                <small>
                  PDF, DOC, XLS, PPT, TXT, ZIP, JPG, PNG · Max 10 MB each · Up to{" "}
                  {MAX_EXTRA_FILES} files
                </small>
              </div>

              {errors.files && <p className="NoticeError">{errors.files}</p>}

              {extraFiles.length > 0 && (
                <ul className="NoticeFileList">
                  {extraFiles.map((file) => (
                    <li key={file.id} className="NoticeFileItem">
                      <span className="NoticeFileExt">{getExt(file.name) || "file"}</span>
                      <div className="NoticeFileInfo">
                        <strong title={file.name}>{file.name}</strong>
                        <small>{formatSize(file.size)}</small>
                      </div>
                      <button
                        type="button"
                        className="NoticeFileRemove"
                        onClick={() => removeExtraFile(file.id)}
                        aria-label={`Remove ${file.name}`}
                        title="Remove"
                      >
                        <Icon name="close" size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="NoticeFormActions">
            <button type="button" className="NoticeClearButton" onClick={() => resetForm()}>
              {editId ? "Cancel Edit" : "Clear"}
            </button>
            <button type="submit" className="NoticeSubmitButton">
              {editId ? "Update Notice" : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="NoticeTableCard">
        <div className="NoticeTableTop">
          <div className="NoticeTableTitle">
            <h3>Notice List</h3>
            <p>All published and hidden notices</p>
          </div>

          <div className="NoticeSearch">
            <Icon name="search" size={16} />
            <input
              type="text"
              placeholder="Search title, owner or description"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search notices"
            />
            {search && (
              <button
                type="button"
                className="NoticeSearchClear"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="NoticeTableWrapper">
          <table className="NoticeTable">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Photo</th>
                <th>Notice</th>
                <th>Posted By</th>
                <th>Date</th>
                <th>Files</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentNotices.length > 0 ? (
                currentNotices.map((item, index) => (
                  <tr key={item.id}>
                    <td data-label="Sl. No.">
                      <span className="NoticeSerial">
                        {String(startIndex + index + 1).padStart(2, "0")}
                      </span>
                    </td>

                    <td data-label="Photo">
                      <div className="NoticeTableImage">
                        <img key={item.photo.url} src={item.photo.url} alt={item.title} />
                      </div>
                    </td>

                    <td data-label="Notice">
                      <div className="NoticeTableText">
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                    </td>

                    <td data-label="Posted By">
                      <span className="NoticeOwner">{item.postOwner}</span>
                    </td>

                    <td data-label="Date">
                      <span className="NoticeDate">{formatDate(item.postingDate)}</span>
                    </td>

                    <td data-label="Files">
                      {item.files.length > 0 ? (
                        <span className="NoticeFilesTag">
                          <Icon name="clip" size={13} /> {item.files.length}
                        </span>
                      ) : (
                        <span className="NoticeNoFiles">-</span>
                      )}
                    </td>

                    <td data-label="Status">
                      <div className="NoticeStatus">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.active}
                          className={`NoticeSwitch ${item.active ? "on" : ""}`}
                          onClick={() => toggleStatus(item.id)}
                          title={item.active ? "Click to hide" : "Click to publish"}
                        >
                          <span />
                        </button>
                        <small className={item.active ? "on" : ""}>
                          {item.active ? "Active" : "Hidden"}
                        </small>
                      </div>
                    </td>

                    <td data-label="Action">
                      <div className="NoticeActions">
                        <button
                          type="button"
                          className="NoticeViewButton"
                          onClick={() => setViewItem(item)}
                          title="View"
                          aria-label="View notice"
                        >
                          <Icon name="eye" size={16} />
                        </button>

                        <button
                          type="button"
                          className="NoticeEditButton"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          aria-label="Edit notice"
                        >
                          <Icon name="edit" size={16} />
                        </button>

                        <button
                          type="button"
                          className="NoticeDeleteButton"
                          onClick={() => setDeleteTarget(item)}
                          title="Delete"
                          aria-label="Delete notice"
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="NoticeEmpty">
                    <div className="NoticeEmptyIcon">
                      <Icon name="bell" size={26} />
                    </div>
                    <h4>{search ? "No matching notices" : "No Notices Found"}</h4>
                    <p>
                      {search
                        ? "Try a different search word."
                        : "Add your first notice using the form above."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="NoticePagination">
            <div className="NoticePaginationInfo">
              <span>
                Showing <strong>{startIndex + 1}</strong> -{" "}
                <strong>{Math.min(startIndex + ITEMS_PER_PAGE, filteredNotices.length)}</strong>{" "}
                of <strong>{filteredNotices.length}</strong>
              </span>
            </div>

            <div className="NoticePaginationControls">
              <button
                type="button"
                className="NoticePageArrow"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <Icon name="left" size={16} />
              </button>

              <div className="NoticePageNumbers">
                {getPageNumbers().map((page, index) => {
                  if (page === "left-ellipsis" || page === "right-ellipsis") {
                    return (
                      <span key={`ell-${index}`} className="NoticePageEllipsis">
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={page}
                      type="button"
                      className={`NoticePageNumber ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {String(page).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="NoticePageArrow"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <Icon name="right" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewItem && (
        <div className="NoticeModalOverlay" onClick={() => setViewItem(null)}>
          <div
            className="NoticeModal"
            role="dialog"
            aria-modal="true"
            aria-label="Notice details"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="NoticeModalHeader">
              <h3>Notice Details</h3>
              <button
                type="button"
                className="NoticeModalClose"
                onClick={() => setViewItem(null)}
                aria-label="Close"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="NoticeModalBody">
              <div className="NoticeModalImage">
                <img src={viewItem.photo.url} alt={viewItem.title} />
              </div>

              <h4 className="NoticeModalTitle">{viewItem.title}</h4>

              <div className="NoticeModalMeta">
                <span>
                  <Icon name="user" size={14} /> {viewItem.postOwner}
                </span>
                <span>
                  <Icon name="calendar" size={14} /> {formatDate(viewItem.postingDate)}
                </span>
                <span className={`NoticeModalStatus ${viewItem.active ? "on" : ""}`}>
                  {viewItem.active ? "Active" : "Hidden"}
                </span>
              </div>

              <p className="NoticeModalDescription">{viewItem.description}</p>

              <a
                className="NoticeModalLink"
                href={viewItem.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="link" size={15} />
                <span>{viewItem.link}</span>
                <Icon name="external" size={14} />
              </a>

              {viewItem.files.length > 0 && (
                <div className="NoticeModalFiles">
                  <h5>Attached Files</h5>
                  <ul className="NoticeFileList">
                    {viewItem.files.map((file) => (
                      <li key={file.id} className="NoticeFileItem">
                        <span className="NoticeFileExt">{getExt(file.name) || "file"}</span>
                        <div className="NoticeFileInfo">
                          <strong title={file.name}>{file.name}</strong>
                          <small>{formatSize(file.size)}</small>
                        </div>
                        <a
                          className="NoticeFileDownload"
                          href={file.url}
                          download={file.name}
                          title="Download"
                          aria-label={`Download ${file.name}`}
                        >
                          <Icon name="download" size={15} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="NoticeModalFooter">
              <button
                type="button"
                className="NoticeClearButton"
                onClick={() => setViewItem(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="NoticeSubmitButton"
                onClick={() => {
                  const item = viewItem;
                  setViewItem(null);
                  handleEdit(item);
                }}
              >
                Edit Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {deleteTarget && (
        <div className="NoticeModalOverlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="NoticeModal NoticeConfirmModal"
            role="alertdialog"
            aria-modal="true"
            aria-label="Delete notice"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="NoticeConfirmIcon">
              <Icon name="trash" size={24} />
            </div>
            <h3>Delete this notice?</h3>
            <p>
              "<strong>{deleteTarget.title}</strong>" will be removed permanently. This cannot be
              undone.
            </p>

            <div className="NoticeConfirmActions">
              <button
                type="button"
                className="NoticeClearButton"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button type="button" className="NoticeDangerButton" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOAST ================= */}
      {toast && (
        <div className={`NoticeToast ${toast.type}`} role="status" aria-live="polite">
          <Icon name={toast.type === "error" ? "alert" : "check"} size={17} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Notice;