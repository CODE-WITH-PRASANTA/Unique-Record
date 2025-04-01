const EventRegistration = require("../Model/eventRegistrationSchema");
const cloudinary = require("../Config/cloudinary");
const axios = require("axios");

// Event Registration Controller
const registerForEvent = async (req, res) => {
  try {
    const { phone, eventName, applicantName, sex, dateOfBirth, pinCode, district, state, email, website, education, skills, paymentDetails, bioData, passportPhoto } = req.body;

    // Upload bio-data to Cloudinary
    const bioDataUpload = await cloudinary.uploader.upload(bioData.path, {
      folder: "event-registrations",
      resource_type: "auto",
    });

    // Upload passport photo to Cloudinary
    const passportPhotoUpload = await cloudinary.uploader.upload(passportPhoto.path, {
      folder: "event-registrations",
      resource_type: "auto",
    });

    // Create registration document
    const registration = new EventRegistration({
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
      bioDataUrl: bioDataUpload.secure_url,
      passportPhotoUrl: passportPhotoUpload.secure_url,
      payment: {
        orderId: paymentDetails.orderId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        status: "PENDING",  // Set to "PENDING" initially
      },
    });

    // Save registration
    await registration.save();

    // Return response
    res.status(201).json({ message: "Event registration successful", registration });
  } catch (error) {
    console.error("Error registering event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerForEvent };
