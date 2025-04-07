import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Api"; // Adjust path as needed
import "./AdminEditEvent.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';



const AdminEditEvent = () => {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/all`);
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + " ..." : text;
  };

  // Open edit modal
  const openEditModal = (event) => {
    setEditEvent(event);
    setIsModalOpen(true);
  };

  const closeEditModal = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Unsaved changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close it!",
      cancelButtonText: "No, keep editing!",
      reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      setIsModalOpen(false);
    }
  };
  

  // Handle input change in edit form
  const handleEditChange = (e) => {
    setEditEvent({ ...editEvent, [e.target.name]: e.target.value });
  };


  const handleSaveChanges = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.put(`${API_URL}/events/update/${editEvent._id}`, editEvent);
        setEvents(events.map(event => (event._id === editEvent._id ? response.data.event : event)));
        closeEditModal();
        Swal.fire("Saved!", "Your event has been updated.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to update the event.", "error");
      }
    }
  };
  
const handleDeleteEvent = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`${API_URL}/events/delete/${id}`);
      setEvents(events.filter(event => event._id !== id));
      Swal.fire("Deleted!", "The event has been removed.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the event.", "error");
    }
  }
};


  return (
    <div className="Admin-edit-event-container">
      <h2 className="Admin-edit-event-title">Manage Events</h2>
      <div className="Admin-edit-event-table-container">
        <table className="Admin-edit-event-table">
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Event Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Description</th>
              <th>Organizer</th>
              <th>Opening Date</th>
              <th>Closing Date</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event._id} className="Admin-edit-event-row">
                <td>{index + 1}</td>
                <td className="Admin-edit-event-name">{truncateText(event.eventName, 4)}</td>
                <td className="Admin-edit-event-location">{event.eventLocation}</td>
                <td className="Admin-edit-event-date">{event.eventDate.split("T")[0]}</td>
                <td className="Admin-edit-event-description" dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(truncateText(event.eventDescription, 20))
}}></td>

                <td className="Admin-edit-event-organizer">{event.eventOrganizer}</td>
                <td className="Admin-edit-event-opening">{event.openingDate.split("T")[0]}</td>
                <td className="Admin-edit-event-closing">{event.closingDate.split("T")[0]}</td>
                <td className="Admin-edit-event-price">{event.pricePerTicket}</td>
                <td className="Admin-edit-event-actions">
                  <button className="Admin-edit-event-edit-btn" onClick={() => openEditModal(event)}>
                    <FaEdit />
                  </button>
                  <button className="Admin-edit-event-delete-btn" onClick={() => handleDeleteEvent(event._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
  <div className={`Admin-edit-event-modal ${isModalOpen ? "show" : ""}`}>
    <div className="Admin-edit-event-modal-content">
      <h3 className="Admin-edit-event-modal-title">Edit Event</h3>

      <div className="Admin-edit-event-form">
        <div className="Admin-edit-event-column">
          <label className="Admin-edit-event-label">Event Name</label>
          <input type="text" name="eventName" value={editEvent.eventName} onChange={handleEditChange} placeholder="Event Name" />

          <label className="Admin-edit-event-label">Location</label>
          <input type="text" name="eventLocation" value={editEvent.eventLocation} onChange={handleEditChange} placeholder="Location" />

          <label className="Admin-edit-event-label">Event Date</label>
          <input type="date" name="eventDate" value={editEvent.eventDate.split("T")[0]} onChange={handleEditChange} />

          <label className="Admin-edit-event-label">Opening Date</label>
          <input type="date" name="openingDate" value={editEvent.openingDate.split("T")[0]} onChange={handleEditChange} />

          <label className="Admin-edit-event-label">Closing Date</label>
          <input type="date" name="closingDate" value={editEvent.closingDate.split("T")[0]} onChange={handleEditChange} />
        </div>

        <div className="Admin-edit-event-column">
          <label className="Admin-edit-event-label">Description</label>
          <Editor
  apiKey="38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv"
  value={editEvent.eventDescription}
  onEditorChange={(newContent) =>
    setEditEvent({ ...editEvent, eventDescription: newContent })
  }
  init={{
    height: 400,
    menubar: true,
    branding: false,
    statusbar: true,
    resize: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'paste', 'help', 'wordcount',
      'emoticons', 'autosave', 'directionality'
    ],
    toolbar:
      'undo redo | blocks fontselect fontsizeselect | ' +
      'bold italic underline strikethrough forecolor backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image media emoticons table | ' +
      'ltr rtl | removeformat code preview fullscreen help',
    image_caption: true,
    image_title: true,
    image_dimensions: true,
    media_live_embeds: true,
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
  }}
/>

          <label className="Admin-edit-event-label">Organizer</label>
          <input type="text" name="eventOrganizer" value={editEvent.eventOrganizer} onChange={handleEditChange} placeholder="Organizer" />

          <label className="Admin-edit-event-label">Price per Ticket</label>
          <input type="number" name="pricePerTicket" value={editEvent.pricePerTicket} onChange={handleEditChange} placeholder="Price" />

          <label className="Admin-edit-event-label">Current Status</label>
          <select name="currentStatus" value={editEvent.currentStatus} onChange={handleEditChange} className="Admin-edit-event-status">
            <option value="Ongoing">Ongoing</option>
            <option value="Date Over">Date Over</option>
          </select>
        </div>
      </div>

      <div className="Admin-edit-event-modal-actions">
        <button className="Admin-edit-event-save-btn" onClick={handleSaveChanges}>Save</button>
        <button className="Admin-edit-event-cancel-btn" onClick={closeEditModal}>Cancel</button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default AdminEditEvent;
