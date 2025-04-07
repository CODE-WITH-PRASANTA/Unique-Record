const EventRegistration = require("../Model/eventRegistrationSchema");
const sendEmail = require("../Utils/email");


exports.registerForEvent = async (req, res) => {
  try {
    const {
      eventName,
      applicantName,
      sex,
      dateOfBirth,
      phone,
      pinCode,
      district,
      state,
      email,
      website,
      education,
      skills,
      bioDataUrl,
      passportPhotoUrl,
      orderId,
      paymentId,
      amount,
      currency,
      method,
      status,
    } = req.body;

    // Validate required fields
    if (!eventName || !applicantName || !phone || !orderId || !paymentId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save event registration details to the database
    const newRegistration = new EventRegistration({
      eventName,
      applicantName,
      sex,
      dateOfBirth: dateOfBirth, // Directly save the dateOfBirth value
      phone,
      pinCode,
      district,
      state,
      email,
      website,
      education,
      skills,
      bioDataUrl,
      passportPhotoUrl,
      orderId,
      paymentId,
      amount,
      currency,
      method,
      status,
    });

    await newRegistration.save();
    res.status(201).json({ message: "Registration successful", data: newRegistration });
  } catch (error) {
    console.error("Error in registering for event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all event registrations
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find();
    res.status(200).json({ data: registrations });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single registration by ID
exports.getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await EventRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.status(200).json({ data: registration });
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.sendRegistrationEmail = async (req, res) => {
  try {
    const registrationId = req.params.id;
    const registration = await EventRegistration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const emailContent = `
    🎉 Registration Confirmed
    
    Dear ${registration.applicantName},
    
    We are pleased to inform you that your registration for "${registration.eventName}" has been successfully processed! Below are your details:
    
    📅 Event Details:
    --------------------------------
    Event Name: ${registration.eventName}
    
    📝 Registration Details:
    --------------------------------
    Applicant Name: ${registration.applicantName}
    Email: ${registration.email}
    Phone: ${registration.phone}
    Pincode: ${registration.pinCode}
    District: ${registration.district}
    State: ${registration.state}
    
    💰 Payment Summary:
    --------------------------------
    Order ID: ${registration.orderId}
    Payment ID: ${registration.paymentId}
    Amount: ${registration.amount} ${registration.currency}
    Payment Method: ${registration.method}
    
    📌 Important Instructions:
    --------------------------------
    - Please arrive at the venue **30 minutes** before the event.
    - Carry a **valid ID proof** for verification.
    - If you have any questions, reach out to our support team.
    
    📞 Contact Us:
    --------------------------------
    - Email: support@event.com
    - Phone: +91-XXXXXXXXXX
    
    Thank you for registering with us. We look forward to welcoming you at the event!
    
    Best Regards,  
    Unique Records of Universe  
    Event Team
    `;
    
  

    await sendEmail(registration.email, "Registration Confirmation", emailContent);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending registration email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};