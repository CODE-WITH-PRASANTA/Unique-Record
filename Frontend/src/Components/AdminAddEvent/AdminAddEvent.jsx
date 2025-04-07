import React, { useState } from "react";
import { FaCalendarAlt, FaLocationArrow, FaRegFileAlt, FaUserTie, FaMoneyBillWave, FaListAlt, FaImage } from "react-icons/fa";
import { MdEventAvailable, MdEventBusy, MdCategory } from "react-icons/md";
import "./AdminAddEvent.css";
import { API_URL } from "../../Api"; // Import API_URL from the config file
import { Editor } from '@tinymce/tinymce-react';



const AdminAddEvent = () => {
  const [eventData, setEventData] = useState({
    eventName: "",
    eventLocation: "",
    eventDate: "",
    eventDescription: "",
    eventOrganizer: "",
    openingDate: "",
    closingDate: "",
    currentStatus: "Ongoing",
    pricePerTicket: "",
    category: "Top Category",
    eventImage: null, // New field for the location image
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventData({ ...eventData, eventImage: file });
  };

  const handleEditorChange = (content) => {
    setEventData({ ...eventData, eventDescription: content });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("eventLocation", eventData.eventLocation);
    formData.append("eventDate", eventData.eventDate);
    formData.append("eventDescription", eventData.eventDescription);
    formData.append("eventOrganizer", eventData.eventOrganizer);
    formData.append("openingDate", eventData.openingDate);
    formData.append("closingDate", eventData.closingDate);
    formData.append("currentStatus", eventData.currentStatus);
    formData.append("pricePerTicket", eventData.pricePerTicket);
    formData.append("category", eventData.category);
    formData.append("eventImage", eventData.eventImage);
  
    try {
      const response = await fetch(`${API_URL}/events/create`, { // Use API_URL
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Event added successfully!");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };
  

  return (
    <div className="admin-add-event-container">
      <h2 className="admin-add-event-title">
        <MdEventAvailable /> Add New Event
      </h2>
      <form onSubmit={handleSubmit} className="admin-add-event-form">

        {/* Event Name & Location */}
        <div className="admin-add-event-row">
          <div className="admin-add-event-group admin-add-event-name">
            <label><MdEventAvailable /> Event Name:</label>
            <input type="text" name="eventName" value={eventData.eventName} onChange={handleChange} required />
          </div>
          <div className="admin-add-event-group admin-add-event-location">
            <label><FaLocationArrow /> Event Location:</label>
            <input type="text" name="eventLocation" value={eventData.eventLocation} onChange={handleChange} required />
          </div>
        </div>

        {/* Upload Location Image */}
        <div className="admin-add-event-group admin-add-event-image">
          <label><FaImage /> Upload Location Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>

        {/* Event Date & Description */}
        <div className="admin-add-event-row">
          <div className="admin-add-event-group admin-add-event-date">
            <label><FaCalendarAlt /> Event Date:</label>
            <input type="date" name="eventDate" value={eventData.eventDate} onChange={handleChange} required />
          </div>
        </div>
        <div className="admin-add-event-group admin-add-event-description">
  <label><FaRegFileAlt /> Event Description:</label>
  <Editor
  apiKey="38wljwg2resc6xba8ypjqp4duobboibboshf3czbuyv5iulv" // free API key
  value={eventData.eventDescription}
  onEditorChange={handleEditorChange}
  init={{
    height: 400,
    menubar: true,
    branding: false,
    statusbar: true,
    resize: true, // Enable manual resizing
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


</div>



        {/* Event Organizer */}
        <div className="admin-add-event-group admin-add-event-organizer">
          <label><FaUserTie /> Event Organizer:</label>
          <input type="text" name="eventOrganizer" value={eventData.eventOrganizer} onChange={handleChange} required />
        </div>

        {/* Opening & Closing Date */}
        <div className="admin-add-event-row">
          <div className="admin-add-event-group admin-add-event-opening-date">
            <label><MdEventAvailable /> Opening Date:</label>
            <input type="date" name="openingDate" value={eventData.openingDate} onChange={handleChange} required />
          </div>
          <div className="admin-add-event-group admin-add-event-closing-date">
            <label><MdEventBusy /> Closing Date:</label>
            <input type="date" name="closingDate" value={eventData.closingDate} onChange={handleChange} required />
          </div>
        </div>

        {/* Current Status & Price Per Ticket */}
        <div className="admin-add-event-row">
          <div className="admin-add-event-group admin-add-event-status">
            <label><FaListAlt /> Current Status:</label>
            <select name="currentStatus" value={eventData.currentStatus} onChange={handleChange}>
              <option value="Ongoing">Ongoing</option>
              <option value="Date Over">Date Over</option>
            </select>
          </div>
          <div className="admin-add-event-group admin-add-event-price">
            <label><FaMoneyBillWave /> Registration Fee:</label>
            <input type="number" name="pricePerTicket" value={eventData.pricePerTicket} onChange={handleChange} required />
          </div>
        </div>

        {/* Choose Category */}
        <div className="admin-add-event-group admin-add-event-category">
          <label><MdCategory /> Choose Category:</label>
          <select name="category" value={eventData.category} onChange={handleChange}>
            <option value="Top Category">Top Category</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        <button type="submit" className="admin-add-event-submit-btn">Add Event</button>
      </form>
    </div>
  );
};

export default AdminAddEvent;
