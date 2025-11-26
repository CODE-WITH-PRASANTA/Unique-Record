import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./ContactManagemenet.css";

interface SocialLinks {
  instagram: string;
  facebook: string;
  linkedin: string;
  twitter: string;
}

interface Contact {
  _id?: string;
  email: string;
  phone: string;
  whatsapp: string;
  social: SocialLinks;
  openHours: Record<string, string>;
  addresses: string[];
  published: boolean;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STORAGE_KEY = "contacts_v1";

/** small uid generator (kept local) */
const uid = () => Math.random().toString(36).slice(2, 9);

const ContactManagemenet: React.FC = () => {
  const [contactsList, setContactsList] = useState<Contact[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [contactData, setContactData] = useState<Contact>({
    email: "",
    phone: "",
    whatsapp: "",
    social: { instagram: "", facebook: "", linkedin: "", twitter: "" },
    openHours: { Sun: "", Mon: "", Tue: "", Wed: "", Thu: "", Fri: "", Sat: "" },
    addresses: ["", "", ""],
    published: false,
  });

  /* load contacts from localStorage on mount */
  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (list: Contact[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to persist contacts to localStorage", e);
    }
  };

  const fetchContacts = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Contact[];
        setContactsList(parsed);
      } else {
        // seed a demo contact for first-time usage
        const demo: Contact = {
          _id: uid(),
          email: "demo@example.com",
          phone: "1234567890",
          whatsapp: "1234567890",
          social: { instagram: "@demo", facebook: "demo", linkedin: "demo", twitter: "@demo" },
          openHours: { Sun: "09:00-17:00", Mon: "09:00-17:00", Tue: "09:00-17:00", Wed: "09:00-17:00", Thu: "09:00-17:00", Fri: "09:00-17:00", Sat: "" },
          addresses: ["Demo Street 1", "Demo Building 2", ""],
          published: true,
        };
        setContactsList([demo]);
        persist([demo]);
      }
    } catch (err) {
      console.error("Error reading contacts from localStorage:", err);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index?: number,
    field?: "addresses" | "openHours",
    day?: string
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    if (field === "addresses" && typeof index === "number") {
      const updatedAddresses = [...contactData.addresses];
      updatedAddresses[index] = value;
      setContactData({ ...contactData, addresses: updatedAddresses });
    } else if (field === "openHours" && day) {
      setContactData({
        ...contactData,
        openHours: { ...contactData.openHours, [day]: value },
      });
    } else if (["instagram", "facebook", "linkedin", "twitter"].includes(name)) {
      setContactData({
        ...contactData,
        social: { ...contactData.social, [name]: value },
      });
    } else {
      // general fields: email, phone, whatsapp
      setContactData({ ...contactData, [name]: value } as unknown as Contact);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // basic validation: require email or phone
    if (!contactData.email.trim() && !contactData.phone.trim()) {
      alert("Please provide at least an email or phone.");
      return;
    }

    if (editId) {
      const updated = contactsList.map((c) => (c._id === editId ? { ...c, ...contactData, _id: editId } : c));
      setContactsList(updated);
      persist(updated);
      setEditId(null);
    } else {
      const newContact: Contact = { ...contactData, _id: uid() };
      const updated = [newContact, ...contactsList];
      setContactsList(updated);
      persist(updated);
    }

    // reset form
    setContactData({
      email: "",
      phone: "",
      whatsapp: "",
      social: { instagram: "", facebook: "", linkedin: "", twitter: "" },
      openHours: { Sun: "", Mon: "", Tue: "", Wed: "", Thu: "", Fri: "", Sat: "" },
      addresses: ["", "", ""],
      published: false,
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    const updated = contactsList.filter((c) => c._id !== id);
    setContactsList(updated);
    persist(updated);
    if (editId === id) {
      setEditId(null);
      setContactData({
        email: "",
        phone: "",
        whatsapp: "",
        social: { instagram: "", facebook: "", linkedin: "", twitter: "" },
        openHours: { Sun: "", Mon: "", Tue: "", Wed: "", Thu: "", Fri: "", Sat: "" },
        addresses: ["", "", ""],
        published: false,
      });
    }
  };

  const handleEdit = (id: string) => {
    const contact = contactsList.find((c) => c._id === id);
    if (contact) {
      setContactData(contact);
      setEditId(id);
      // scroll to form top for clarity
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const togglePublish = (id: string) => {
    const updated = contactsList.map((c) => (c._id === id ? { ...c, published: !c.published } : c));
    setContactsList(updated);
    persist(updated);
  };

  return (
    <div className="ContactManagemenet-container">
      {/* =================== FORM SECTION =================== */}
      <div className="ContactManagemenet-form-section">
        <h2 className="ContactManagemenet-heading">
          {editId ? "Edit Contact" : "Add Contact"}
        </h2>

        <form onSubmit={handleSubmit} className="ContactManagemenet-form">
          <div className="ContactManagemenet-row">
            {["email", "phone", "whatsapp"].map((field, index) => (
              <div key={index} className="ContactManagemenet-item">
                <label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={contactData[field as keyof Contact] as string}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  maxLength={field !== "email" ? 20 : undefined}
                  required={field !== "whatsapp"}
                />
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="ContactManagemenet-box">
            <h4>Social Media Handles</h4>
            <div className="ContactManagemenet-row">
              {["instagram", "facebook", "linkedin", "twitter"].map(
                (field, index) => (
                  <div key={index} className="ContactManagemenet-item">
                    <label>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={contactData.social[field as keyof SocialLinks]}
                      onChange={handleChange}
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Open Hours */}
          <div className="ContactManagemenet-box">
            <h4>Open Hours</h4>
            <div className="ContactManagemenet-row">
              {days.map((day) => (
                <div key={day} className="ContactManagemenet-item">
                  <label>{day}</label>
                  <div className="ContactManagemenet-timepair">
                    <input
                      type="time"
                      value={contactData.openHours[day]?.split("-")[0] || ""}
                      onChange={(e) => {
                        const end = contactData.openHours[day]?.split("-")[1] || "";
                        handleChange(
                          {
                            target: {
                              name: day,
                              value: `${e.target.value}-${end}`,
                            },
                          } as unknown as ChangeEvent<HTMLInputElement>,
                          undefined,
                          "openHours",
                          day
                        );
                      }}
                    />
                    <span className="ContactManagemenet-time-separator">to</span>
                    <input
                      type="time"
                      value={contactData.openHours[day]?.split("-")[1] || ""}
                      onChange={(e) => {
                        const start =
                          contactData.openHours[day]?.split("-")[0] || "";
                        handleChange(
                          {
                            target: {
                              name: day,
                              value: `${start}-${e.target.value}`,
                            },
                          } as unknown as ChangeEvent<HTMLInputElement>,
                          undefined,
                          "openHours",
                          day
                        );
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="ContactManagemenet-box">
            <h4>Addresses</h4>
            {contactData.addresses.map((addr, i) => (
              <input
                key={i}
                type="text"
                value={addr}
                placeholder={`Address ${i + 1}`}
                onChange={(e) => handleChange(e, i, "addresses")}
              />
            ))}
          </div>

          <button type="submit" className="ContactManagemenet-submit-btn">
            {editId ? "Update Contact" : "Add Contact"}
          </button>
        </form>
      </div>

      {/* =================== TABLE SECTION =================== */}
      <div className="ContactManagemenet-table-section">
        <h2 className="ContactManagemenet-heading">Contacts List</h2>
        <div className="ContactManagemenet-table-wrapper">
          <table className="ContactManagemenet-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Email</th>
                <th>Phone</th>
                <th>WhatsApp</th>
                <th>Social</th>
                <th>Open Hours</th>
                <th>Addresses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactsList.map((c, index) => (
                <tr key={c._id}>
                  <td>{index + 1}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.whatsapp}</td>
                  <td>
                    <div className="ContactManagemenet-socials">
                      {Object.entries(c.social).map(
                        ([key, val]) => val && (
                          <span key={key}>
                            {key.toUpperCase()}: {val}
                          </span>
                        )
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="ContactManagemenet-openhours">
                      {Object.entries(c.openHours).map(
                        ([day, val]) => (
                          <span key={day}>
                            {day}: {val || "-"}
                          </span>
                        )
                      )}
                    </div>
                  </td>
                  <td>{c.addresses.filter((a) => a).join(" | ")}</td>
                  <td className="ContactManagemenet-actions">
                    <button
                      onClick={() => togglePublish(c._id!)}
                      className={`ContactManagemenet-publish-btn ${
                        c.published ? "published" : "unpublished"
                      }`}
                    >
                      {c.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleEdit(c._id!)}
                      className="ContactManagemenet-edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id!)}
                      className="ContactManagemenet-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {contactsList.length === 0 && (
                <tr>
                  <td colSpan={8} className="ContactManagemenet-empty">No contacts available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactManagemenet;
