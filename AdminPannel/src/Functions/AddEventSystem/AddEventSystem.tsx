import React, { useState, ChangeEvent, FormEvent } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./AddEventSystem.css";

interface EventFormData {
  eventName: string;
  eventLocation: string;
  locationImage: File | null;
  eventDate: string;
  eventDescription: string;
  eventOrganizer: string;
  openingDate: string;
  closingDate: string;
  status: "Ongoing" | "Date Over";
  registrationFee: string;
  category: "Normal" | "Top Category" | "Both";
}

interface EventData extends EventFormData {
  id: number;
  publishingDate: string;
}

const AddEventSystem: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    eventName: "",
    eventLocation: "",
    locationImage: null,
    eventDate: "",
    eventDescription: "",
    eventOrganizer: "",
    openingDate: "",
    closingDate: "",
    status: "Ongoing",
    registrationFee: "",
    category: "Normal",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingId) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingId ? { ...event, ...formData } : event
        )
      );
      setEditingId(null);
    } else {
      const newEvent: EventData = {
        ...formData,
        id: events.length + 1,
        publishingDate: new Date().toLocaleDateString(),
      };
      setEvents([...events, newEvent]);
    }

    setFormData({
      eventName: "",
      eventLocation: "",
      locationImage: null,
      eventDate: "",
      eventDescription: "",
      eventOrganizer: "",
      openingDate: "",
      closingDate: "",
      status: "Ongoing",
      registrationFee: "",
      category: "Normal",
    });
  };

  const handleEdit = (id: number) => {
    const eventToEdit = events.find((e) => e.id === id);
    if (eventToEdit) {
      setFormData(eventToEdit);
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const togglePublish = (id: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              status: event.status === "Ongoing" ? "Date Over" : "Ongoing",
            }
          : event
      )
    );
  };

  return (
    <div className="AddEventSystem-container">
      {/* Left Section */}
      <div className="AddEventSystem-left">
        <h2 className="AddEventSystem-heading">
          {editingId ? "✏️ Edit Event" : "🎉 Publish New Event"}
        </h2>

        <form onSubmit={handleSubmit} className="AddEventSystem-form">
          <div className="AddEventSystem-row">
            <input
              type="text"
              name="eventName"
              placeholder="Event Name"
              value={formData.eventName}
              onChange={handleInputChange}
              className="AddEventSystem-input"
              required
            />
            <input
              type="text"
              name="eventLocation"
              placeholder="Event Location"
              value={formData.eventLocation}
              onChange={handleInputChange}
              className="AddEventSystem-input"
              required
            />
          </div>

          <div className="AddEventSystem-row">
            <input
              type="file"
              name="locationImage"
              onChange={handleInputChange}
              className="AddEventSystem-input-file"
            />
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              className="AddEventSystem-input"
              required
            />
          </div>

          {/* ✅ TinyMCE Editor for Description */}
          <div className="AddEventSystem-editor">
            <label className="AddEventSystem-label">Event Description</label>
            <Editor
              apiKey="38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv"
              value={formData.eventDescription}
              init={{
                height: 350,
                menubar: true,
                branding: false,
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount paste",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                paste_as_text: false,
              }}
              onEditorChange={(content) =>
                setFormData((prev) => ({ ...prev, eventDescription: content }))
              }
            />
          </div>

          <div className="AddEventSystem-row">
            <input
              type="text"
              name="eventOrganizer"
              placeholder="Event Organizer"
              value={formData.eventOrganizer}
              onChange={handleInputChange}
              className="AddEventSystem-input"
              required
            />
            <input
              type="number"
              name="registrationFee"
              placeholder="Registration Fee"
              value={formData.registrationFee}
              onChange={handleInputChange}
              className="AddEventSystem-input"
            />
          </div>

          <div className="AddEventSystem-row">
            <div className="AddEventSystem-datebox">
              <label>Opening Date</label>
              <input
                type="date"
                name="openingDate"
                value={formData.openingDate}
                onChange={handleInputChange}
                className="AddEventSystem-input"
              />
            </div>
            <div className="AddEventSystem-datebox">
              <label>Closing Date</label>
              <input
                type="date"
                name="closingDate"
                value={formData.closingDate}
                onChange={handleInputChange}
                className="AddEventSystem-input"
              />
            </div>
          </div>

          <div className="AddEventSystem-row">
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="AddEventSystem-select"
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Date Over">Date Over</option>
            </select>

            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="AddEventSystem-select"
            >
              <option value="Normal">Normal</option>
              <option value="Top Category">Top Category</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <button type="submit" className="AddEventSystem-btn">
            {editingId ? "💾 Update Event" : "🚀 Publish Event"}
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="AddEventSystem-right">
        <h2 className="AddEventSystem-heading">📋 Manage Published Events</h2>
        <div className="AddEventSystem-tableWrapper">
          <table className="AddEventSystem-table">
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Event Name</th>
                <th>Publishing Date</th>
                <th>Opening Date</th>
                <th>Closing Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <tr key={event.id}>
                    <td>{index + 1}</td>
                    <td>{event.eventName}</td>
                    <td>{event.publishingDate}</td>
                    <td>{event.openingDate}</td>
                    <td>{event.closingDate}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          event.status === "Ongoing" ? "ongoing" : "closed"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="AddEventSystem-actions">
                      <button
                        onClick={() => togglePublish(event.id)}
                        title="Publish/Unpublish"
                        className="eye-btn"
                      >
                        {event.status === "Ongoing" ? "👁️" : "👁️‍🗨️"}
                      </button>
                      <button
                        onClick={() => handleEdit(event.id)}
                        title="Edit"
                        className="edit-btn"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        title="Delete"
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="AddEventSystem-empty">
                    No events published yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddEventSystem;
