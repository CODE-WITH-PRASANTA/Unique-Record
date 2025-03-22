import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Api"; // Adjust path as needed
import "./AdminEditEvent.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";


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
                <td className="Admin-edit-event-description">{truncateText(event.eventDescription, 4)}</td>
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
            <input type="text" name="eventName" value={editEvent.eventName} onChange={handleEditChange} placeholder="Event Name" />
            <input type="text" name="eventLocation" value={editEvent.eventLocation} onChange={handleEditChange} placeholder="Location" />
            <input type="date" name="eventDate" value={editEvent.eventDate.split("T")[0]} onChange={handleEditChange} />
            <textarea name="eventDescription" value={editEvent.eventDescription} onChange={handleEditChange} placeholder="Description"></textarea>
            <input type="text" name="eventOrganizer" value={editEvent.eventOrganizer} onChange={handleEditChange} placeholder="Organizer" />
            <input type="date" name="openingDate" value={editEvent.openingDate.split("T")[0]} onChange={handleEditChange} />
            <input type="date" name="closingDate" value={editEvent.closingDate.split("T")[0]} onChange={handleEditChange} />
            <input type="number" name="pricePerTicket" value={editEvent.pricePerTicket} onChange={handleEditChange} placeholder="Price" />
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
