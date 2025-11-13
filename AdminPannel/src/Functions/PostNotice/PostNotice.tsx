import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaEye, FaEyeSlash, FaEdit, FaTrashAlt } from "react-icons/fa";
import "./PostNotice.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";


interface Notice {
  id: number;
  image: File | null;
  noticeDate: string;
  author: string;
  title: string;
  description: string;
  link: string;
  otherFiles: File | null;
  postingDate: string;
  published: boolean;
}

const PostNotice: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [formData, setFormData] = useState<Omit<Notice, "id" | "postingDate" | "published">>({
    image: null,
    noticeDate: "",
    author: "",
    title: "",
    description: "",
    link: "",
    otherFiles: null,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setNotices(prev =>
        prev.map(n => n.id === editingId ? { ...n, ...formData } : n)
      );
      setEditingId(null);
    } else {
      const newNotice: Notice = {
        id: notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1,
        postingDate: new Date().toLocaleDateString(),
        published: false,
        ...formData,
      };
      setNotices(prev => [...prev, newNotice]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      image: null,
      noticeDate: "",
      author: "",
      title: "",
      description: "",
      link: "",
      otherFiles: null,
    });
  };
  
  // Delete Notice
const handleDelete = (id: number) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      popup: 'swal-center-popup'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      setNotices(prev => prev.filter(n => n.id !== id));
      if (editingId === id) resetForm();
      Swal.fire({
        title: 'Deleted!',
        text: 'The notice has been deleted successfully.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        background: '#f9f9fb',
        color: '#1e1e2f',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        customClass: {
          popup: 'swal-center-popup'
        }
      });
    }
  });
};

// Publish / Unpublish Notice
const togglePublish = (id: number) => {
  setNotices(prev =>
    prev.map(n =>
      n.id === id ? { ...n, published: !n.published } : n
    )
  );

  const notice = notices.find(n => n.id === id);
  if (!notice) return;

  Swal.fire({
    icon: 'success',
    title: notice.published ? 'Notice Unpublished!' : 'Notice Published!',
    text: notice.published ? 'The notice is now unpublished.' : 'Your notice is now live.',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    background: '#f9f9fb',
    color: '#1e1e2f',
    customClass: {
      popup: 'swal-top-center-toast'
    },
    position: 'top',
  });
};

// Edit Notice
const handleEdit = (id: number) => {
  const notice = notices.find(n => n.id === id);
  if (!notice) return;

  setFormData({
    image: notice.image,
    noticeDate: notice.noticeDate,
    author: notice.author,
    title: notice.title,
    description: notice.description,
    link: notice.link,
    otherFiles: notice.otherFiles,
  });
  setEditingId(id);

  Swal.fire({
    icon: 'info',
    title: 'Edit Mode',
    text: 'You can now edit this notice.',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    background: '#f9f9fb',
    color: '#1e1e2f',
    customClass: {
      popup: 'swal-top-center-toast'
    },
    position: 'top',
  });
};


  return (
    <div className="PostingNotice-container">
      <h2 className="PostingNotice-title">Post & Manage Notices</h2>
      <div className="PostingNotice-main">
        {/* LEFT FORM */}
        <div className="PostingNotice-left">
          <form onSubmit={handleSubmit} className="PostingNotice-form" noValidate>
            <div className="PostingNotice-form-group">
              <label>Notice Image</label>
              <input type="file" name="image" onChange={handleFileChange} />
              {formData.image && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="preview"
                  className="PostingNotice-img-preview"
                />
              )}
            </div>

            <div className="PostingNotice-form-group">
              <label>Notice Date</label>
              <input type="date" name="noticeDate" value={formData.noticeDate} onChange={handleChange} required />
            </div>

            <div className="PostingNotice-form-group">
              <label>Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} required />
            </div>

            <div className="PostingNotice-form-group">
              <label>Title</label>
              <textarea
                name="title"
                value={formData.title}
                onChange={handleChange}
                rows={2}
                placeholder="Enter title..."
                className="PostingNotice-title-input"
              />
            </div>

            <div className="PostingNotice-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter description..."
              />
            </div>

            <div className="PostingNotice-form-group">
              <label>Important Link</label>
              <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://example.com" />
            </div>

            <div className="PostingNotice-form-group">
              <label>Upload Other Files (Optional)</label>
              <input type="file" name="otherFiles" onChange={handleFileChange} />
            </div>

            <button type="submit" className="PostingNotice-submit-btn">
              {editingId ? "Update Notice" : "Post Notice"}
            </button>
          </form>
        </div>

        {/* RIGHT TABLE */}
        <div className="PostingNotice-right">
          <h3>Manage Notices</h3>
          <div className="PostingNotice-table-wrapper">
            <table className="PostingNotice-table">
              <thead>
                <tr>
                  <th>Sl No.</th>
                  <th>Image</th>
                  <th>Posting Date</th>
                  <th>Notice Date</th>
                  <th>Author</th>
                  <th>Link</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {notices.length > 0 ? notices.map((notice, index) => (
                  <tr key={notice.id}>
                    <td>{index + 1}</td>
                    <td>{notice.image ? <img src={URL.createObjectURL(notice.image)} alt="notice" className="PostingNotice-table-img" /> : "N/A"}</td>
                    <td>{notice.postingDate}</td>
                    <td>{notice.noticeDate}</td>
                    <td>{notice.author}</td>
                    <td>{notice.link ? <a href={notice.link} target="_blank" rel="noreferrer">Link</a> : "—"}</td>
                    <td className="PostingNotice-actions">
                      <button
                        className="PostingNotice-action-btn"
                        title={notice.published ? "Unpublish" : "Publish"}
                        onClick={() => togglePublish(notice.id)}
                        >
                        {notice.published ? (
                            <FaEye color="green" />
                        ) : (
                            <FaEyeSlash color="red" />
                        )}
                        </button>

                      <button className="PostingNotice-action-btn" title="Edit" onClick={() => handleEdit(notice.id)}>
                        <FaEdit />
                      </button>
                      <button className="PostingNotice-action-btn" title="Delete" onClick={() => handleDelete(notice.id)}>
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="PostingNotice-empty">No notices added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostNotice;
